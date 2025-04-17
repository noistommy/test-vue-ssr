import EventEmitter from 'node:events'
// import amqp from 'amqplib/callback_api.js'
import amqp from 'amqplib'
// const amqpBaseUrl = process.env.AMPQ_BASE_URL || 'amqp://guest:guest@localhost:5672'
const amqpBaseUrl =  'amqp://localhost'
const connectionEventNames = ['close', 'error']
const retryInterval = 4000
// let mqClient = null
let connection = null
let retryTimer = null
let channelSet = {}
let isConnected = false
let isStarted = false

function getPid () {
  return process.pid
}

function emitEvent (eventName, ...param) {
  if (mqClient) {
    mqClient.emit(eventName, ...param)
  } else {
    console.error('no mqClient')
  }
}

async function connect (isRetry = false) {
  if (!isRetry && isStarted) {
    console.log('connect is already called')
    return
  }

  isStarted = true

  if (!connection) {
    try {
      connection = await amqp.connect(amqpBaseUrl)
      connectionEventNames.forEach(eventName => {
        connection.on(eventName, reconnect)
      })

      // emitEvent('connect')
      await mqClient.emit('connect')
      isConnected = true
      console.log('mq connected')
    } catch (err) {
      // console.error(err)
      reconnect(err)
    }
  }
}

function resetConnectState () {
  connection = null
  isConnected = false
  channelSet = {}
}

function reconnect (err) {
  if (isConnected) {
    emitEvent('disconnect')
    console.log('mq disconnected')
  }
  console.log('mq reconnect')
  resetConnectState()

  if (err) {
    // console.error(err.message)
  }

  clearTimeout(retryTimer)
  retryTimer = setTimeout(() => {
    connect(true)
  }, retryInterval)
}

function onChannelClose () {
  const pid = getPid()
  delete channelSet[pid]
}

async function close () {
  clearTimeout(retryTimer)

  if (connection) {
    try {
      // prevent reconnect
      connectionEventNames.forEach(eventName => {
        connection.removeListener(eventName, reconnect)
      })
      await connection.close()
    } catch (err) {
      // console.log(err)
    }
  }

  if (isConnected) {
    emitEvent('disconnect')
  }

  console.log('mq closed')
  resetConnectState()
}

class MqClient extends EventEmitter {
  constructor() {
    super()
  }
  emitEvent (eventName, params) {
    this.emit(eventName, ...params)
  }
  async getChannel (channelName) {
    if (!connection) {
      throw new Error('no mq connection')
    }

    const pid = getPid()

    if (!channelSet[pid]) {
      const channel = await connection.createChannel()
      channel.on('close', onChannelClose)
      channel.on('error', onChannelClose)
      channelSet[pid] = channel
    }
    return channelSet[pid]
  }

  async connect () {
    try {
      connection = await amqp.connect(amqpBaseUrl)
      connectionEventNames.forEach(eventName => {
        connection.on(eventName, reconnect)
      })

      // emitEvent('connect')
      this.emitEvent('connect')
      isConnected = true
      console.log('mq connected')
    } catch (err) {
      // console.error(err)
      reconnect(err)
    }
  }

  async close () {
    await close()
  }
}

const mqClient = new MqClient()

export default mqClient

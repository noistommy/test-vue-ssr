import amqp from 'amqplib'
import { EventEmitter } from 'events'

export const mqReceiver = async () => {
  console.log('set queue')
  const queue = 'mediumQueue'
  const connection = await amqp.connect('amqp://localhost') 

  const channel = await connection.createChannel();
  await channel.assertQueue(queue, {
      durable: false
  })

  channel.consume(queue, (payload) => {
    if (payload != null) {
      let contents = JSON.parse(payload.content.toString())
      console.log('===== Receive =====');
      console.log(contents);
      channel.ack(payload)
      // sendEmailHandler(contents)
    } else {
      console.log('no data')
    }
  }, {
    noAck: false
  })
}

class MqClient extends EventEmitter {}

export const mqClient = new MqClient()
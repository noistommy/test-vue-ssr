import fs from 'node:fs/promises'
import express from 'express'
// import sendEmailHandler from './aws-ses/ses_sendmail.js'
// import {deliverHandler} from './aws-ses/emailService.js'
// import dotenv from 'dotenv'

import { Send } from './send.js'
import { mqReceiver } from './receive.js'
import mqClient from './mq-client.js'

import { logger, stream } from './logger.js'
// import amqp from 'amqplib/callback_api.js'
// import amqp from 'amqplib'
// import { channel } from 'node:diagnostics_channel'

// import mqClient from './mq-client.js'
mqClient.connect()
// dotenv.config()

// Constants
const isProduction = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 5174
const base = process.env.BASE || '/'

// Cached production assets
const templateHtml = isProduction
  ? await fs.readFile('./dist/client/index.html', 'utf-8')
  : ''
const ssrManifest = isProduction
  ? await fs.readFile('./dist/client/.vite/ssr-manifest.json', 'utf-8')
  : undefined

// Create http server
const app = express()

// Add Vite or respective production middlewares
let vite
if (!isProduction) {
  const { createServer } = await import('vite')
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base,
  })
  app.use(vite.middlewares)
} else {
  const compression = (await import('compression')).default
  const sirv = (await import('sirv')).default
  app.use(compression())
  app.use(base, sirv('./dist/client', { extensions: [] }))
}

// const getHtmlContens = async (data) => {
//   const url = 'test'
//   let render = (await vite.ssrLoadModule('/src/entry-server.js')).render
//   const rendered = await render(url, data, ssrManifest)
//   console.dir(rendered.html)

//   sendEmailHandler(rendered.html)
// }

// Serve HTML
app.use('*all', async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, '')

    let template
    let render
    if (!isProduction) {
      // Always read fresh template in development
      template = await fs.readFile('./index.html', 'utf-8')
      template = await vite.transformIndexHtml(url, template)
      render = (await vite.ssrLoadModule('/src/entry-server.js')).render
    } else {
      template = templateHtml
      render = (await import('./dist/server/entry-server.js')).render
    }

    const rendered = await render(url, ssrManifest)

    const html = template
      .replace(`<!--app-head-->`, rendered.head ?? '')
      .replace(`<!--app-html-->`, rendered.html ?? '')

    // await console.log(url, rendered)

    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)

    const rabbit = new Send().execute(rendered.html)
    // console.log(rabbit)

    // mqClient.emit('connect', 'test message')

    // deliverHandler(rendered.html)
    // console.dir(rendered.html)

    // sendEmailHandler(rendered.html)
    // mqClient.emit('connect')

  } catch (e) {
    vite?.ssrFixStacktrace(e)
    console.log(e.stack)
    res.status(500).end(e.stack)
  }
})

// mqReceiver()

// mqClient.on('connect', (msg) => {
//   console.log(`This is connect's ${msg}`)
// })
function subscribeQueue () {
  try {
    mqClient.on('connect', async () => {
      console.log('connect')
      try {
        const channel = await mqClient.getChannel('mediumQueue')
        const queueInfo = await channel.assertQueue('mediumQueue', {
            durable: false
        })
        channel.consume('mediumQueue', function (payload) {
          try {
            if (payload != null) {
              let contents = JSON.parse(payload.content.toString())
              console.log('===== MQClient =====');
              logger.info(contents)
              // sendEmailHandler(contents)
              channel.ack(payload);
            }
          } catch (err) {
            console.log(err)
            channel.nack(payload)
          }
        }, {
            noAck: false
        })
      } catch (err) {
        console.log("Error! get channel", err)
      }
    })
  } catch (err) {
    console.log("Error! event emit error",err)
  }
}
subscribeQueue ()
// app.post('/send', function (req, res) {
//   const rabbit = new Send().execute(req.body)
//   console.log(rabbit)
//   res.json({
//     status: 'OKE',
//     statusCode: 201,
//     message: 'Message success send to rabbitmq server.'
//   })
// })

// amqp.connect('amqp://localhost', function (error, connection) {
//   if (error) {
//     throw error;
//   }

//   connection.createChannel(function (error1, channel) {
//     if (error1) {
//         throw error1;
//     }

//     channel.assertQueue('mediumQueue', {
//         durable: false
//     });

//     channel.consume('mediumQueue', function (payload) {
//       if (payload != null) {
//         let contents = JSON.parse(payload.content.toString())
//         console.log('===== Receive =====');
//         console.log(contents);
//         // sendEmailHandler(contents)
//       }
//     }, {
//         noAck: true
//     })
//   })
// })

// function subscribeQueue () {
//   console.log('start', mqClient.getChannel())
//   try {
//     mqClient.on('connect', async () => {
//       const channel = await mqClient.getChannel()
//       const queueInfo = channel.assertQueue('mediumQueue', { durable: false })
      
//       if (!queueInfo) {
//         throw new Error('queue errer!')
//       }

//       // channel.prefetch(1)
//       channel.consume('mediumQueue', function (payload) {
//         console.log('payload:', payload)
//         if (payload != null) {
//           let contents = JSON.parse(payload.content.toString())
//           console.log('===== Receive =====');
//           console.log(contents);
//           // sendEmailHandler(contents)
//         }
//       }, {
//           noAck: true
//       })
//     })

//   } catch (err) {
//     console.log("err", err)
//   }
// }

// subscribeQueue()
// Start http server
app.listen(port, () => {
  logger.info(`Server started at http://localhost:${port}`)
  console.log(`Server started at http://localhost:${port}`)
})

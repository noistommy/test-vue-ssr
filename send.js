import amqp from 'amqplib/callback_api.js'

export class Send {
  constructor () {
    this.rabbit = amqp
  }
  execute(payload) {
    this.rabbit.connect('amqp://localhost', function(error0, connection) {
      if (error0) {
          throw error0;
      }
      connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1
        }
        const queue = 'mediumQueue'
        const data = JSON.stringify(payload);

        channel.assertQueue(queue, { durable: false })
        channel.sendToQueue(queue, Buffer.from(data))

        // console.log(" [x] Sent %s", data);
      })
    })
  }
}

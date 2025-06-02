const amqp = require("amqplib");
const exchangeName = process.env.RABBITMQ_EXCHANGE;
const exchangeKey = process.env.RABBITMQ_KEY

let rabbitPublisher = {
    postToExchange: async(message, messageType) => {
        try {
            const connection = await amqp.connect(process.env.RABBITMQ_URL)
            const channel = await connection.createChannel();
            await channel.assertExchange(exchangeName)

            let opts = { durable: true, persistent: true, headers: { "MessageType": messageType } };//durable: if RabbitMQ is down save the message

            //send the message to the exchange
            await channel.publish(
                exchangeName,
                exchangeKey,
                Buffer.from(JSON.stringify(message)),
                opts,
            );

            await channel.close();
            await connection.close();
        } catch (ex) {
            console.error(ex);
        }
    },
};

module.exports = rabbitPublisher;

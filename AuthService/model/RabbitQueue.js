const amqp = require("amqplib");

let rabbitQueue = {
    postToQueue: async(message, exchange, exchangeKey, headers = {}) => {
        try {
            //creates a connection
            const connection = await amqp.connect(
                process.env.CUSTOMCONNSTR_CLOUDAMQP_URL
            );
            const channel = await connection.createChannel();

            //checks if the channel exists
            await channel.checkExchange(exchange);

            //send the message to the exchange
            await channel.publish(
                exchange,
                exchangeKey,
                //durable: if RabbitMQ is down save the message
                Buffer.from(JSON.stringify(message)), {
                    headers,
                    durable: true,
                    persistent: true,
                }
            );

            await channel.close();
            await connection.close();
        } catch (ex) {
            console.error(ex);
        }
    },
};

module.exports = rabbitQueue;
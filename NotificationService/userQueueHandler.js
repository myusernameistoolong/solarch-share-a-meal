const amqp = require("amqplib");

let userQueueHandler = {
    listenUserQueue: async() => {
        try {
            //creates a connection
            const connection = await amqp.connect(
                process.env.CUSTOMCONNSTR_CLOUDAMQP_URL
            );

            const channel = await connection.createChannel();

            //checks if the channel exists

            await channel.checkExchange(process.env.CUSTOMCONNSTR_EXCHANGE);

            channel.assertQueue("userQueue", {
                durable: true,
            });

            channel.bindQueue("userQueue", process.env.CUSTOMCONNSTR_EXCHANGE, "");

            channel.consume(
                "userQueue",
                (msg) => {
                    console.log(msg.content.toString());
                },

                {
                    noAck: true,
                }
            );

            // await channel.close();

            // await connection.close();

            console.log("Success!");
        } catch (ex) {
            console.error(ex);
        }
    },
};

module.exports = userQueueHandler;
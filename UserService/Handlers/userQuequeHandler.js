const amqp = require("amqplib");
const userObject = require("../Models/user.model")();
const messageQueue = require("../MessageQueue/RabbitQueue");

let userQuequeHandler = {
    listenUserQueue: async() => {
        try {
            //creates a connection

            console.log(process.env.CUSTOMCONNSTR_CLOUDAMQP_URL);
            const connection = await amqp.connect(
                process.env.CUSTOMCONNSTR_CLOUDAMQP_URL
            );

            const channel = await connection.createChannel();

            //checks if the channel exists]

            await channel.checkExchange("amq.direct");

            channel.assertQueue("userQueue", {
                durable: true,
            });

            channel.bindQueue("userQueue", "amq.direct", "authKey");

            channel.consume(
                "userQueue",
                async(msg) => {
                    const { MessageType } = msg.properties.headers;

                    if (MessageType == "AccountCreated") {
                        let parsedData = jsonParser(msg.content.toString("utf-8"));

                        const entity = new userObject({
                            fullname: parsedData.fullname,
                            birthdate: parsedData.birthdate,
                            email: parsedData.email,
                            username: parsedData.username,
                        });
                        await entity.save();

                        console.log("Saved pushing to queue!");
                        console.log(entity);

                        messageQueue.postToQueue(entity, "amq.direct", "userKey", {
                            MessageType: "UserCreated",
                        });
                    }
                }, {
                    noAck: true,
                }
            );

            // await channel.close();

            // await connection.close();

            console.log("Success!");
        } catch (ex) {
            console.error(ex);
            process.exit(0)
        }
    },
};

//https://stackoverflow.com/questions/42494823/json-parse-returns-string-instead-of-object
function jsonParser(blob) {
    let parsed = JSON.parse(blob);
    if (typeof parsed === "string") parsed = jsonParser(parsed);
    return parsed;
}

module.exports = userQuequeHandler;
var winston = require("winston");
var { Loggly } = require("winston-loggly-bulk");
const amqp = require("amqplib");
const fs = require("fs");

let loggingQuequeHandler = {
    listenLoggingQueue: async() => {
        try {
            //creates a connection

            console.log(process.env.CUSTOMCONNSTR_CLOUDAMQP_URL);
            const connection = await amqp.connect(
                process.env.CUSTOMCONNSTR_CLOUDAMQP_URL
            );

            const channel = await connection.createChannel();

            //checks if the channel exists]
            await channel.checkExchange("amq.direct");

            channel.assertQueue("loggingQueue", {
                durable: true,
            });

            channel.bindQueue("loggingQueue", "amq.direct", "userKey");
            channel.bindQueue("loggingQueue", "amq.direct", "authKey");
            channel.bindQueue("loggingQueue", "amq.direct", "mealKey");
            channel.bindQueue("loggingQueue", "amq.direct", "ratingKey");

            channel.consume(
                "loggingQueue",
                async(msg) => {
                    const { MessageType } = msg.properties.headers;
                    let parsedData = await jsonParser(msg.content.toString("utf-8"));

                    winston.add(
                        new Loggly({
                            token: "33bafb83-7845-491c-950e-19e7dd3de051",
                            subdomain: "shareameal",
                            tags: [`${MessageType}`],
                            json: true,
                        })
                    );

                    winston.log("info", parsedData);
                }, {
                    noAck: true,
                }
            );

            console.log("Success!");
        } catch (ex) {
            console.error(ex);
        }
    },
};

//https://stackoverflow.com/questions/42494823/json-parse-returns-string-instead-of-object
function jsonParser(blob) {
    let parsed = JSON.parse(blob);
    if (typeof parsed === "string") parsed = jsonParser(parsed);
    return parsed;
}

module.exports = loggingQuequeHandler;
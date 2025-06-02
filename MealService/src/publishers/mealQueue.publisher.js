const amqp = require("amqplib")
const connectionString = process.env.RABBITMQ_URL;
const exchangeName = process.env.RABBITMQ_EXCHANGE;
const queueName = "mealQueue";
const routingKey = "mealKey"

async function postToExchange(message, messageType){
    try{
        const connection = await amqp.connect(connectionString)
        const channel = await connection.createChannel();

        await channel.assertExchange(exchangeName)
        await channel.publish(exchangeName, routingKey, Buffer.from(message), {headers: {"MessageType": messageType}, durable:true, persistent: true})

        await channel.close();
        await connection.close();
    }
    catch(err){
        console.error(err)
    }
}

//Deprecated
async function postToQueue(message, messageType){
    try{
        const connection = await amqp.connect(connectionString)
        const channel = await connection.createChannel();

        await channel.assertQueue(queueName)
        await channel.bindQueue(queueName, exchangeName, routingKey)
        await channel.sendToQueue(queueName, Buffer.from(message), {headers: {"MessageType": messageType}, durable: true, persistent: true})

        await channel.close();
        await connection.close();
    }
    catch(err){
        console.error(err)
    }
}


module.exports = {
    postToExchange
}
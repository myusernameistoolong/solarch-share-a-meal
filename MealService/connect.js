const mongoose = require('mongoose')
const amqp = require("amqplib")
const mealQueueConsumer = require("./src/consumers/mealQueue.consumer")


// these options are to not let mongoose use deprecated features of the mongo driver
const options = {
    authMechanism: "DEFAULT",
    authSource: "admin",
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

async function mongo(dbName) {
    try {
        await mongoose.connect(`${process.env.MONGO_URL}/${dbName}`, options)
        console.log(`connection to mongo DB ${dbName} established`)
    } catch (err) {
        console.error(err)
    }
}

async function rabbitMq(){
    const connection = await amqp.connect(process.env.RABBITMQ_URL)
    const channel = await connection.createChannel();

    const mealQueue = "mealQueue"
    await channel.assertExchange(process.env.RABBITMQ_EXCHANGE)
    channel.assertQueue(mealQueue, {durable:true})
    channel.bindQueue(mealQueue, process.env.RABBITMQ_EXCHANGE, "userKey")
        
    //Handlers
    mealQueueConsumer.consumeUserQueueMessage(channel)
    console.log(`Connected to RabbitMq Instance ${process.env.RABBITMQ_URL} with exchange ${process.env.RABBITMQ_EXCHANGE}`)
}


module.exports = {
    mongo,
    rabbitMq
}

CUSTOMCONNSTR_CLOUDAMQP_URL = amqps: //nnhyhzge:PyAuscQ0xtTjSykyHJ16xxxx
    CUSTOMCONNSTR_EXCHANGE = amq.direct
CUSTOMCONNSTR_ROUTING_KEY = uniqueKey
CUSTOMCONNSTR__TESTING_ROUTING_KEY = TestingKey

try {
    //creates a connection
    const connection = await amqp.connect(
        process.env.CUSTOMCONNSTR_CLOUDAMQP_URL
    );
    const channel = await connection.createChannel();

    //checks if the channel exists
    await channel.checkExchange(process.env.CUSTOMCONNSTR_EXCHANGE);

    //send the message to the exchange
    await channel.publish(
        process.env.CUSTOMCONNSTR_EXCHANGE,
        process.env.CUSTOMCONNSTR_ROUTING_KEY,
        //durable: if RabbitMQ is down save the message
        Buffer.from(JSON.stringify(req.body)), { durable: true }
    );

    await channel.close();
    await connection.close();

    res.status(200).json({
        message: "succes!",
    });
} catch (ex) {
    console.error(ex);
    res.status(400).json({
        type: "Message Queue",
        title: "Something went wrong while processing message",
        status: 400,
        message: ex,
        instance: req.originalUrl,
    });
}
const amqp = require("amqplib");
const mongoose = require('mongoose');
const MealEvent = require('./model/MealEvent');

const options = {
    authMechanism: "DEFAULT",
    authSource: "admin",
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

async function main() {

    try {

        mongoose.Promise = global.Promise;
        console.log(`${process.env.MONGO_URL}/${process.env.MONGO_DB}`);
        await mongoose.connect(`${process.env.MONGO_URL}/${process.env.MONGO_DB}`, options);
    
        console.log("Successfully conntected to mongodb!");

        //creates a connection
        const connection = await amqp.connect(
            process.env.CUSTOMCONNSTR_CLOUDAMQP_URL
        );

        const channel = await connection.createChannel();

        //checks if the channel exists

        await channel.checkExchange('amq.direct');

        await channel.assertQueue("eventSource", {
            durable: true
        });


        channel.bindQueue("eventSource", "amq.direct", "userKey");
        channel.bindQueue("eventSource", "amq.direct", "authKey");
        channel.bindQueue("eventSource", "amq.direct", "mealKey");
        channel.bindQueue("eventSource", "amq.direct", "ratingKey");


        channel.consume(
            "eventSource",
            async (msg) => {

                if (msg.properties.headers.MessageType == 'UserLeavesMeal') {

                    let jsonData = jsonParser(msg.content.toString());

                    console.log("User left meal!");
                    console.log(jsonData);

                    let { user, meal } = jsonData;


                    let mealEvent = new MealEvent({
                        email: user.email,
                        meal: meal._id,
                        type: "LEAVED",
                        date: new Date()
                    });

                    console.log("Trying to save");
                    console.log(mealEvent);

                    await mealEvent.save();

                    console.log("Saved!");

                }


                if (msg.properties.headers.MessageType == 'UserJoinedMeal') {

                    let jsonData = jsonParser(msg.content.toString());

                    let { user, meal } = jsonData;


                    let mealEvent = new MealEvent({
                        email: user.email,
                        meal: meal._id,
                        type: "JOINED",
                        date: new Date()
                    });


                    await mealEvent.save();

                }




            }, {
                noAck: true,
            }
        );


        // await channel.close();

        // await connection.close();

    } catch (ex) {
        console.error(ex);
        process.exit(0)
    }

}

main().catch(console.error);


function jsonParser(blob) {
    let parsed = JSON.parse(blob);
    if (typeof parsed === 'string') parsed = jsonParser(parsed);
    return parsed;
}
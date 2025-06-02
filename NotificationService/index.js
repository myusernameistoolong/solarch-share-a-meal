const nodemailer = require('nodemailer');
const amqp = require("amqplib");

//jfu5aqAst47n

// async..await is not allowed in global scope, must use a wrapper
async function main() {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp-mail.outlook.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'studentmeal@outlook.com', // generated ethereal user
            pass: 'jfu5aqAst47n', // generated ethereal password
        },
    });


    try {
        //creates a connection
        const connection = await amqp.connect(
            process.env.CUSTOMCONNSTR_CLOUDAMQP_URL
        );

        const channel = await connection.createChannel();

        //checks if the channel exists

        await channel.checkExchange('amq.direct');

        await channel.assertQueue("notificationService", {
            durable: true
        });


        channel.bindQueue("notificationService", "amq.direct", "userKey");
        channel.bindQueue("notificationService", "amq.direct", "authKey");
        channel.bindQueue("notificationService", "amq.direct", "mealKey");
        channel.bindQueue("notificationService", "amq.direct", "ratingKey");

        channel.consume(
            "notificationService",
            async (msg) => {

                if(msg.properties.headers.MessageType == 'UserLeavesMeal')
                {

                    let jsonData = jsonParser(msg.content.toString());

                    let recipient = jsonData.meal.offeredBy.email;

                    try 
                    {

                        await transporter.sendMail({
                            from: '"Studentmeal Meal" <studentmeal@outlook.com>', // sender address
                            to: `${recipient}`, // list of receivers
                            subject: `A user left your meal!`, // Subject line
                            text: `A user doesn't want to eat your meal anymore tonight!`, // plain text body
                            html: `A user <b>doesn't want to eat</b> your meal anymore tonight!`, // html body
                        });

                    }
                    catch(e)
                    {
                        console.log(`Couldn't not send email to ${recipient}`);
                        console.log(e);
                    }

                } 


                if(msg.properties.headers.MessageType == 'UserJoinedMeal')
                {

                    let jsonData = jsonParser(msg.content.toString());

                    let recipient = jsonData.meal.offeredBy.email;

                    try 
                    {

                        await transporter.sendMail({
                            from: '"Studentmeal Meal" <studentmeal@outlook.com>', // sender address
                            to: `${recipient}`, // list of receivers
                            subject: `A user joined your meal!`, // Subject line
                            text: `A user would like to eat your meal tonight!`, // plain text body
                            html: `A user would like to eat your meal tonight!`, // html body
                        });
    
                    }
                    catch(e)
                    {
                        console.log(`Couldn't not send email to ${recipient}`);
                        console.log(e);
                    }

                } 




            }, {
                noAck: true
            }
        );


        // await channel.close();

        // await connection.close();

    } catch (ex) {
        console.error(ex);
    }

}

main().catch(console.error);


function jsonParser(blob) {
    let parsed = JSON.parse(blob);
    if (typeof parsed === 'string') parsed = jsonParser(parsed);
    return parsed;
 }



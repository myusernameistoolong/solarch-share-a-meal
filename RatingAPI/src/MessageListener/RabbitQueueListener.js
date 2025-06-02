const RatingRoutes = require('../routes/rating_rabbit.routes')
const RatingRabbitRoutes = new RatingRoutes()
const mealQueue = "ratingQueue";

let rabbitQueueListener = {
    listen: async(channel = "amq.direct") => {
        try {
            channel.consume(mealQueue, function(msg) {
                console.log(" [x] Received %s", msg.content.toString());

                if(msg.properties.headers.MessageType != null && msg.properties.headers.MessageType != "") {
                    RatingRabbitRoutes.SendForward(msg);
                }
                channel.ack(msg)
            });
        } catch (ex) {
            console.error(ex);
        }
    },
};

module.exports = rabbitQueueListener;

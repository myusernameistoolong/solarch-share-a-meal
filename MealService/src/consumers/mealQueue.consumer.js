const queue = "mealQueue"
const User = require("../models/user.model")

function consumeUserQueueMessage(channel){
    channel.consume(queue, async (msg)=>{

        const { MessageType } = msg.properties.headers;
        
        if(MessageType == "UserCreated"){
            let parsedData = jsonParser(msg.content.toString("utf-8"))
            let user = new User(parsedData)
            await user.save();
            channel.ack(msg)
        }
        else{
            channel.ack(msg)
        }
    })
}

function jsonParser(blob) {
    let parsed = JSON.parse(blob);
    if (typeof parsed === 'string') parsed = jsonParser(parsed);
    return parsed;
 }


module.exports = {
    consumeUserQueueMessage
}
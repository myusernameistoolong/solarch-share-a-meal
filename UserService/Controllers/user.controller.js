const messageQueue = require("../MessageQueue/RabbitQueue");
class userController {
    constructor(model) {
        this.model = model;
    }
    getUsers = async(req, res) => {
        //get the lists.
        const lists = await this.model.find();

        res.status(200).send(lists);
    };

    getUserById = async(req, res) => {
        //get the lists.
        const user = await this.model.findById(req.params.id);

        res.status(200).send(user);
    };

    create = async(req, res, next) => {
        console.log("in create user");

        const entity = new this.model(req.body);
        await entity.save();

        messageQueue.postToQueue(entity, "amq.direct", "userKey");

        res.status(201).json({ messageQueue: "succes!" });
    };
}
module.exports = userController;
// this contains all basic CRUD endpoints on a schema

const errors = require("../errors")
const messageQueue = require("../MessagePublisher/RabbitPublisher");

const Meal = require('../models/meal.model')()
const User = require('../models/user.model')()

// the schema is supplied by injection
class CrudController {
    constructor(model) {
        this.model = model
    }

    create = async (req, res, next) => {
        const entity = new this.model(req.body)
        await entity.save()

        let messageType = entity.collection.collectionName + "Created"
        messageType = messageType.charAt(0).toUpperCase() + messageType.slice(1);

        messageQueue.postToExchange(entity, messageType);
        res.status(201).json({id: entity.id})
    }

    getAll = async (req, res, next) => {
        const entities = await this.model.find()
        res.status(200).send(entities)
    }

    getOne = async (req, res, next) => {
        const entity = await this.model.findById(req.params.id)
        res.status(200).send(entity)
    }

    update = async (req, res, next) => {
        const entity = await this.model.findByIdAndUpdate(req.params.id, req.body)

        let messageType = entity.collection.collectionName + "Updated"
        messageType = messageType.charAt(0).toUpperCase() + messageType.slice(1);

        messageQueue.postToExchange(entity, messageType);
        res.status(201).json({id: req.params.id})
    }

    delete = async (req, res, next) => {
        const entity = await this.model.findById(req.params.id)

        if(entity == null) {
            res.status(404).end()
            return;
        }

        let messageType = entity.collection.collectionName + "Deleted"
        messageType = messageType.charAt(0).toUpperCase() + messageType.slice(1);

        await entity.delete()
        messageQueue.postToExchange(entity, messageType);
        res.status(204).end()
    }
}

module.exports = CrudController

// this contains all basic CRUD endpoints on a schema

const errors = require("../errors")
const messageQueue = require("../MessagePublisher/RabbitPublisher");

const CookRating = require('../models/rating_cook.model')()
const User = require('../models/user.model')()

class CookRatingController {
    create = async (req, res, next) => {
        const entity = new CookRating(req.body)

        if(await User.findById(entity.cook_id) == null)
        {
            res.status(404).json("Cannot find cook ID")
            return;
        }

        if(await User.findById(entity.rated_by) == null)
        {
            res.status(404).json("Cannot find user ID")
            return;
        }

        await entity.save()

        let messageType = entity.collection.collectionName + "Created"
        messageType = messageType.charAt(0).toUpperCase() + messageType.slice(1);

        messageQueue.postToExchange(entity, messageType);
        res.status(201).json({id: entity.id})
    }

    getAll = async (req, res, next) => {
        const entities = await CookRating.find()
        res.status(200).send(entities)
    }

    getOne = async (req, res, next) => {
        let entity = await CookRating.findById(req.params.id)
        entity = await entity.populate("meal_id").populate("rated_by");
        res.status(200).send(entity)
    }

    update = async (req, res, next) => {
        const entity = await CookRating.findByIdAndUpdate(req.params.id, req.body)

        if(await User.findById(entity.cook_id) == null)
        {
            res.status(404).json("Cannot find user ID")
            return;
        }

        if(await User.findById(entity.rated_by) == null)
        {
            res.status(404).json("Cannot find cook ID")
            return;
        }

        let messageType = entity.collection.collectionName + "Updated"
        messageType = messageType.charAt(0).toUpperCase() + messageType.slice(1);

        messageQueue.postToExchange(entity, messageType);
        res.status(201).json({id: req.params.id})
    }

    delete = async (req, res, next) => {
        const entity = await CookRating.findById(req.params.id)

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

module.exports = CookRatingController

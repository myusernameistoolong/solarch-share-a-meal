// this contains all basic CRUD endpoints on a schema

const errors = require("../errors")
const messageQueue = require("../MessagePublisher/RabbitPublisher");

const MealRating = require('../models/rating_meal.model')()
const Meal = require('../models/meal.model')()
const User = require('../models/user.model')()

class MealRatingController {
    create = async (req, res, next) => {
        const entity = new MealRating(req.body)

        if(await Meal.findById(entity.meal_id) == null)
        {
            res.status(404).json("Cannot find meal ID")
            return;
        }

        console.log("TEST: " + entity.meal_id);

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
        const entities = await MealRating.find()
        res.status(200).send(entities)
    }

    getOne = async (req, res, next) => {
        let entity = await MealRating.findById(req.params.id)
        entity = await entity.populate("meal_id").populate("rated_by");
        res.status(200).send(entity)
    }

    update = async (req, res, next) => {
        const entity = await MealRating.findByIdAndUpdate(req.params.id, req.body)

        if(await Meal.findById(entity.meal_id) == null)
        {
            res.status(404).json("Cannot find meal ID")
            return;
        }

        if(await User.findById(entity.rated_by) == null)
        {
            res.status(404).json("Cannot find user ID")
            return;
        }

        let messageType = entity.collection.collectionName + "Updated"
        messageType = messageType.charAt(0).toUpperCase() + messageType.slice(1);

        messageQueue.postToExchange(entity, messageType);
        res.status(201).json({id: req.params.id})
    }

    delete = async (req, res, next) => {
        const entity = await MealRating.findById(req.params.id)

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

module.exports = MealRatingController

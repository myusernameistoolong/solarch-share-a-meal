// this contains all basic CRUD endpoints on a schema

const errors = require("../errors")
const messageQueue = require("../MessagePublisher/RabbitPublisher");
const mealRatingModel = require('../models/rating_meal.model')();
const cookRatingModel = require('../models/rating_cook.model')();

// the schema is supplied by injection
class Rating {
    getAverageRatingByMealId = async (req, res, next) => {
        const entities = await mealRatingModel.find({'meal_id': req.params.id});
        const averageRating = entities.reduce((a, b) => a + b.rating, 0) / entities.length;

        //messageQueue.postToQueue(averageRating);
        res.status(200).send("Average: " + averageRating)
    }

    getAverageRatingByCookId = async (req, res, next) => {
        const entities = await cookRatingModel.find({'cook_id': req.params.id});
        const averageRating = entities.reduce((a, b) => a + b.rating, 0) / entities.length;

        //messageQueue.postToQueue(averageRating);
        res.status(200).send("Average: " + averageRating)
    }
}

module.exports = Rating

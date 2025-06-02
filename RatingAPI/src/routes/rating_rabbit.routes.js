const express = require('express')

const MealRating = require('../models/rating_meal.model')()
const CookRating = require('../models/rating_cook.model')()
const Meal = require('../models/meal.model')()
const User = require('../models/user.model')()

class RatingMealRoutes {
    SendForward = async function(msg) {
        let type = msg.properties.headers.MessageType
        let message = msg.content

        console.log(type.toString() + ": " + message)
        message = jsonParser(message)

        //Events
        switch (type)
        {
            case "MealCreated":
                if(await Meal.findById(message._id) == null)
                {
                    const entity = new Meal(message)
                    await entity.save()
                }
                return;
            case "MealDeleted":
                await MealRating.deleteMany({ meal_id: message._id })

                if(await Meal.findById(message._id) != null)
                {
                    const entity = await Meal.findById(message._id)
                    await entity.delete()
                }
                return;
            case "UserCreated":
                if(await User.findById(message._id) == null) {
                    const entity = new User(message)
                    await entity.save()
                }
                return;
            case "UserDeleted":
                await MealRating.deleteMany({ meal_id: message._id })
                await CookRating.deleteMany({ cook_id: message._id })
                await Meal.deleteMany({ offeredBy: { "_id": message._id } } )

                if(await User.findById(message._id) != null)
                {
                    const entity = await User.findById(message._id)
                    await entity.delete()
                }
                return;
        }
    }
}

function jsonParser(blob) {
    let parsed = JSON.parse(blob);

    if (typeof parsed === 'string') parsed = jsonParser(parsed);

    return parsed;
}

module.exports = RatingMealRoutes

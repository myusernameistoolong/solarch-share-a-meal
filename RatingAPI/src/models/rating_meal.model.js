const mongoose = require('mongoose')
const Schema = mongoose.Schema

const getModel = require('./model_cache')

const RatingSchema = new Schema({
    rating: {
        type: Number,
        required: [true, 'A rating needs to have a rating.'],
        min: [1, 'rating has to be at least 11'],
        max: [5, 'rating can be 5 at most'],
    },
    meal_id: {
        type: Schema.Types.ObjectId,
        ref: "Meal",
        required: [true, 'A rating needs to have a meal id'],
    },
    rated_by: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, 'A rating needs to have a rated by user'],
    }
})

// mongoose plugin to always populate fields
RatingSchema.plugin(require('mongoose-autopopulate'));

// export the rating model through a caching function
module.exports = getModel('MealRating', RatingSchema)

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const getModel = require('./model_cache')

const MealSchema = new Schema({
    offeredBy: {
        _id: {
            type: String,
            required: [true, 'A meals needs to have an user'],
        }
    }
})

// mongoose plugin to always populate fields
MealSchema.plugin(require('mongoose-autopopulate'));

// export the rating model through a caching function
module.exports = getModel('Meal', MealSchema)

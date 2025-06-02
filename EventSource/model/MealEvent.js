const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MealEventSchema = new Schema({
    email: {
        type: String,
        validate: {
            validator: (value) => {
                var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                return re.test(value);
            },
            message: 'Email must be a valid email.'
        },
        required: [true, 'Email is required.']
    },
    meal: {
        type: String,
        validate: {
            validator: (value) => value.length > 7,
            message: 'Meal id must be at least 7 characters!'
        },
        required: [true, 'Meal id is required.']
    },
    type: {
        type: String,
        validate: {
            validator: (value) => value == "JOINED" || value == "LEAVED",
            message: 'Type must be either JOINED or LEAVED!'
        },
        required: [true, 'Type is required.']
    },
    date: {
        type: Date,
        default: new Date(),
        required: [true, 'Date is required.']
    }
});

const MealEvent = mongoose.model('MealEvent', MealEventSchema);

module.exports = MealEvent;
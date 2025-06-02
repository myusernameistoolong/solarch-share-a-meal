const mongoose = require('mongoose')
const Schema = mongoose.Schema

const getModel = require('./model_cache')

const UserSchema = new Schema({
    email: {
        type: String,
        required: [true, 'A user needs to have an email'],
    }
})

// mongoose plugin to always populate fields
UserSchema.plugin(require('mongoose-autopopulate'));

// export the rating model through a caching function
module.exports = getModel('User', UserSchema)

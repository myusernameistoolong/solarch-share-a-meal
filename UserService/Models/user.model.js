const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const getModel = require("./model_cache");

const UserSchema = new Schema({
    username: {
        type: String,
        required: [true, "Een gebruiker moet een username hebben."],
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: [true, "Geef een e-mail adres op."],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Geef een valide e-mail adres",
        ],
    },
    birthdate: {
        type: Date,
        required: [true, "Een gebruiker moet een geboortedatum hebben."],
    },
    fullname: {
        type: String,

        validate: {
            validator: (value) => value.length > 1,

            message: "Firstname must be longer than 2 characters.",
        },

        required: [true, "Firstname is required."],
    },
});

module.exports = getModel("user", UserSchema);
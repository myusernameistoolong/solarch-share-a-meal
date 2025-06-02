const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AccountSchema = new Schema({
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
    password: {
        type: String,
        validate: {
            validator: (value) => value.length > 7,
            message: 'Password must be a valid password. Contains at least 8 characters'
        },
        required: [true, 'Password is required.']
    },
    salt: {
        type: String,
        validate: {
            validator: (value) => value.length > 10,
            message: 'Salt is must be longer than 10 characters.'
        },
        required: [true, 'Salt is required.']
    }
});

const Account = mongoose.model('account', AccountSchema);

module.exports = Account;

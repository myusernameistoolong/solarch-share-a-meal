let config = {
    secretkey: 'sdgfkjdhfgdsajkhfg23846238fdsfmnbdsfghkul3487563vjhgdfjkhsgkj'
}
const moment = require('moment');
const jwt = require('jwt-simple');
const ApiError = require('./ApiError');

function encodeToken(data) {
    const playload = {
        exp: moment().add(1000, 'years').unix(),
        iat: moment().unix(),
        data: data
    };
    return jwt.encode(playload, config.secretkey);
}

function decodeToken(token, callback) {

    if(token == '' || token == undefined) {
        callback(null, new ApiError('No token specified!', 401));
    }

    try {
        const payload = jwt.decode(token, config.secretkey);

        const now = moment().unix();

        if (now > payload.exp) {
            callback(null, new ApiError('Token has expired!', 401));
        }

        callback(payload.data, null);

    } catch (err) {
        callback(null, new ApiError('Invalid token specified', 401));
    }
}

module.exports = {
    encodeToken,
    decodeToken
};
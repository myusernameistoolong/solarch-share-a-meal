class EntityNotFoundError extends Error {
    constructor(message) {
        super(message)
        this.name = 'EntityNotFoundError'
    }
}

class AccessDeniedError extends Error {
    constructor(message){
        super(message)
        this.name = "AccessDeniedError"
    }
}

class InvalidOperationError extends Error {
    constructor(message){
        super(message)
        this.name = "InvalidOperationError"
    }
}

function validation(err, req, res, next) {
    if (err.name === 'ValidationError') {
        res.status(400).json({
            name: err.name,
            message: err.message
        })
    } else {
        next(err)
    }
}

function cast(err, req, res, next) {
    if (err.name === 'CastError') {
        res.status(400).json({
            name: err.name,
            message: `Invalid resource id: ${err.value}`
            // message: err
        })
    } else {
        next(err)
    }
}

function entityNotFound(err, req, res, next) {
    if (err.name === 'EntityNotFoundError') {
        res.status(404).json({
            name: err.name,
            message: err.message
        })
    } else {
        next(err)
    }
}

function accessDenied(err, req, res, next){
    if(err.name === "AccessDeniedError"){
        res.status(401).json({
            name: err.name,
            message: err.message
        })
    }
    else{
        next(err)
    }
}

function invalidOperation(err, req, res, next){
    if(err.name === "InvalidOperationError"){
        res.status(400).json({
            name: err.name,
            message: err.message
        })
    }
}

module.exports = {
    EntityNotFoundError,
    AccessDeniedError,
    InvalidOperationError,
    handlers: [
        validation,
        cast,
        entityNotFound,
        accessDenied,
        invalidOperation
    ],
}

const express = require('express')
require('express-async-errors')

const app = express()

const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')

// parse json body of incoming request
app.use(express.json())
app.use(cors())
app.use(helmet())

// use morgan for logging
app.use(morgan('dev'))

const ratingMealRoutes = require('./routes/rating_meal.routes')
const ratingCookRoutes = require('./routes/rating_cook.routes')
const errors = require('./errors')
const baseURL = process.env.BASEURL;

app.use(baseURL + '/meal-ratings', ratingMealRoutes)
app.use(baseURL + '/cook-ratings', ratingCookRoutes)

// catch all not found response
app.use('*', function(_, res) {
    res.status(404).end()
})

// error responses
app.use('*', function(err, req, res, next) {
    console.error(`${err.name}: ${err.message}`)
    next(err)
})

app.use('*', errors.handlers)

app.use('*', function(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ message: 'Unauthorized' });
    } else {
        res.status(500).json({
            message: 'something really unexpected happened'
        })
    }
})

// export the app object for use elsewhere
module.exports = app

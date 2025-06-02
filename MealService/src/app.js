const express = require('express')
const app = express()

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})


//Routes
const mealRoutes = require("./routes/meal.routes")
app.use("/meal", mealRoutes)




// catch all not found response
app.use('*', function(_, res) {
    res.status(404).end()
})

// error responses
const errors = require("./errors")
app.use('*', function(err, req, res, next) {
    console.error(`${err.name}: ${err.message}`)
    // console.error(err)
    next(err)
})

app.use('*', errors.handlers)

app.use('*', function(err, req, res, next) {
    res.status(500).json({
        message: 'something really unexpected happened'
    })
})



module.exports = app
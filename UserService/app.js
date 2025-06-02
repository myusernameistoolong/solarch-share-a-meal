require("dotenv").config();
require("express-async-errors");
const express = require("express");
const path = require("path");

const bodyParser = require("body-parser");
const compression = require("compression");

//routes
const userRoutes = require("./Routes/user.route");
const app = express();
const errors = require("./errors");

app.use(bodyParser.json());
app.use(compression());

// Logging requests that come in for debugging purposes
app.all("*", (req, res, next) => {
    const method = req.method;
    const url = req.url;
    console.log("The used method is: ", method, " on url: ", url);
    next();
});

//API Routes
app.use("/api/user", userRoutes);

// catch non-existing endpoints
app.use("*", function(_, res) {
    res.status(404).end();
});

// catch error responses
app.use("*", function(err, req, res, next) {
    console.error(`${err.name}: ${err.message}`);
    next(err);
});

app.use("*", errors.handlers);

app.use("*", function(err, req, res, next) {
    res.status(500).json({
        message: "An unexpected error occurred.",
    });
});

module.exports = app;
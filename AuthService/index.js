const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const auth_routes = require('./routes/auth_routes')
const mongoose = require('mongoose');


require('dotenv').config()



// process.env.CUSTOMCONNSTR_CLOUDAMQP_URL = "amqp://admin:Welkom123@localhost:5672";
// process.env.CUSTOMCONNSTR_EXCHANGE = "amq.direct";


/**
 * MONGOOSE
 */
mongoose.Promise = global.Promise;
 if (process.env.NODE_ENV !== 'test') {
	//  mongoose.connect('mongodb://root:example@0.0.0.0:27017/accountsDB?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false', { useNewUrlParser: true })
	 mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true })
	 .then(() => {
		 console.log("Successfully conntected to mongodb!");
	 })
	 .catch((err) => {
		console.log("Error connecting to mongodb!");
		console.log(err);
	 });
 }


const port = process.env.PORT || 3000

let app = express()

//Body parser lib, for better body parsing.
app.use(bodyParser.json());

//Morgan logging.
app.use(morgan('dev'));

//Example catch all.
app.use('*', function(req, res, next){
	next()
})

app.use('/api', auth_routes)

//If endpoints doesn't exist we end up here.
app.use('*', function (req, res, next) {
	console.log('Endpoint doesn\'t exist!')
	let message = {
		error: "Endpoint doesn\'t exist!"
	}
	next(message)
})

app.use((err, req, res, next) => {
	console.log(err)
	res.status(404).json(err).end()	
})

app.listen(port, () => {
	console.log('Server is running on port: ' + port)
})

module.exports = app
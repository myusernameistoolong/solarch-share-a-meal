// reads the .env file and stores it as environment variables, use for config
require('dotenv').config()

const connect = require('./connect')

const User = require('./src/models/user.model')()
const Ticket = require('./src/models/ticket.model')()
const Show = require('./src/models/show.model')()
const Movie = require('./src/models/movie.model')()
const Room = require('./src/models/rating_meal.model')()

const neo = require('./neo')

// connect to the databases
connect.mongo(process.env.MONGO_TEST_DB)
connect.neo(process.env.NEO4J_TEST_DB)

beforeEach(async () => {
    // drop both collections before each test
    await Promise.all([User.deleteMany(), Ticket.deleteMany(), Show.deleteMany(), Movie.deleteMany(), Room.deleteMany() ])

    // clear neo db before each test
    const session = neo.session()
    await session.run(neo.dropAll)
    await session.close()
});

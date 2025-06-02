require('dotenv').config()
const app = require('./src/app')
const port = 3000
const connect = require("./connect")


connect.mongo(process.env.MONGO_DB).then(connect.rabbitMq)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
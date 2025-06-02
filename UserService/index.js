require("dotenv").config();
const connect = require("./connect");
const http = require("http");

const app = require("./app");
const appname = "UserService";
const port = process.env.PORT || "3000";

const userQuequeHandler = require("./Handlers/userQuequeHandler");

app.set("port", port);
// Create HTTP server.
const server = http.createServer(app);
// Listen on provided port, on all network interfaces.
server.listen(port, () => {
    console.log(`Service: \'${appname}\' running on port ${port}`);

    userQuequeHandler.listenUserQueue();
});

connect.mongo(process.env.MONGO_PROD_DB);
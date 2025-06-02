const loggingQuequeHandler = require("./Handlers/loggingQuequeHandler");

console.log("Starting the logging service...");
loggingQuequeHandler.listenLoggingQueue();
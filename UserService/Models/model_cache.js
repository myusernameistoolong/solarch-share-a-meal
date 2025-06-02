const mongoose = require("mongoose");

function getModel(modelName, modelSchema) {
    return () => {
        return mongoose.models[modelName] // Check if the model exists
            ?
            mongoose.model(modelName) // If true, only retrieve it
            :
            mongoose.model(modelName, modelSchema); // If false, define it
    };
}

module.exports = getModel;
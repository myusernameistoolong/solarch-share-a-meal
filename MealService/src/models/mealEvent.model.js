const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mealEventSchema = new Schema({
  email: String,
  meal: String,
  type: String,
  date: Date
});


module.exports = mongoose.model("MealEvent", mealEventSchema);
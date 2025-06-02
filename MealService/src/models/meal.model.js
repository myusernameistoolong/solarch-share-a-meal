const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mealSchema = new Schema({
  name: { type: String, required: true },
  description: {type: String, required: true },
  offeredBy: { type: Schema.Types.ObjectId, ref: "User", required: true},
  dateTime: {type: Date, required: true}
});


module.exports = mongoose.model("Meal", mealSchema);
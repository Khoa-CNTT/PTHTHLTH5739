const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Advice schema
const adviceSchema = new Schema(
  {
    workoutId: {
      type: Schema.Types.ObjectId,
      ref: "Workout",
      required: true,
    },
    timestamp: {
      type: Number, // Store the timestamp in seconds
      required: true,
    },
    advice: {
      type: String,
      required: true,
    },
  }
);

const Advice = mongoose.model("Advice", adviceSchema);

module.exports = Advice;

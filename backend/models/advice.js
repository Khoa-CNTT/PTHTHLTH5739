const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adviceSchema = new Schema(
  {
    workoutId: {
      type: Schema.Types.ObjectId,
      ref: "Workout",
      required: true,
    },
    timestamp: {
      type: Number, // Lưu trữ dấu thời gian tính bằng giây
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

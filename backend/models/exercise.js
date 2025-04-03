const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  exerciseType: {
    type: String,
  },
  exerciseDuration: {
    type: Number,
  },
  video: {
    type: String,
  },
  difficulty: {
    type: String,
  },
  coachId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
  ],
  isDelete: {
    type: Boolean,
    default: false,
  },
});

const Exercise = mongoose.model("Exercise", exerciseSchema);

module.exports = Exercise;

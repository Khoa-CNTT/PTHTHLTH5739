const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  question: {
    type: String,
  },
  idCoach:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account'
  },
  image: {
    type: String,
  },
  optionId: [
    {
      type: Schema.Types.ObjectId,
      ref: "Option",
    },
  ],
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  blogId: {
    type: Schema.Types.ObjectId,
    ref: "Blog",
  },
  parentCommentId: {
    type: Schema.Types.ObjectId,
    ref: "Comment",
    default: null,
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  replies: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Comment", commentSchema);

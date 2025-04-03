const mongoose = require("mongoose");

const subscriptionSchema = mongoose.Schema(
  {
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    subscriptionStatus: {
      status: {
        type: String,
        enum: ["active", "ongoing", "pause", "finish"],
        default: "active",
      },
      startTimePause: {
        type: Date,
      },
      endTimePause: {
        type: Date,
      },
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    workoutId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workout",
      },
    ],
    chatRoomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatRoom",
    },
    surveyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Survey",
    },
    adviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Advice",
    },
    revenue: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Revenue",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);

module.exports = Subscription;

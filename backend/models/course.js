const mongoose = require("mongoose");

const courseSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    slotNumber: {
      type: Number,
    },
    price: {
      type: Number,
    },
    backPrice: {
      type: Number,
    },
    discount: {
      type: Number,
    },
    image: {
      type: [String],
    },
    coachId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
    exercises: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exercise",
      },
    ],
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
    status: {
      type: String,
      default: "submit",
    },
    createAt: {
      type: Date,
      default: Date.now,
    },
    category: {
      type: String,
    },
    workout: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workout",
      },
    ],
    rejectionReason: {
      type: String,
      // This field will store the rejection reason only when the status is "rejected"
      required: function () {
        return this.status === "rejected"; // Only require this if the status is 'rejected'
      },
    },
    isDeleted: {
      type: Boolean,
      default: false, // Default value is false, indicating the course is not deleted
    },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;

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
      // Trường này sẽ lưu trữ lý do từ chối chỉ khi trạng thái là "rejected"
      required: function () {
        return this.status === "rejected"; // Chỉ yêu cầu điều này nếu trạng thái là 'rejected'
      },
    },
    isDeleted: {
      type: Boolean,
      default: false, // Giá trị mặc định là sai, cho biết khóa học không bị ẩn
    },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;

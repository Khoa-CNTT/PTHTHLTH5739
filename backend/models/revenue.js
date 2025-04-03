const mongoose = require("mongoose");

const revenueSchema = mongoose.Schema(
  {
    date: {
      type: Date,
      default: Date.now, // Tự động lấy ngày hiện tại
    },
    amount: {
      type: Number,
      required: true, // Số tiền doanh thu
    },
    revenueType: {
      type: String,
      enum: ["subscription", "other"], // Loại doanh thu (ví dụ: từ subscription hoặc các nguồn khác)
      default: "subscription",
    },
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription", // Tham chiếu tới bảng Subscription
      required: true,
    },
  },
  {
    timestamps: true, // Thêm createdAt và updatedAt tự động
  }
);

const Revenue = mongoose.model("Revenue", revenueSchema);

module.exports = Revenue;

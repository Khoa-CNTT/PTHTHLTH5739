// controllers/adminController/adminRevenueController.js

const Subscription = require("../../models/subscription");
const Account = require("../../models/account");

const getRevenueData = async (req, res) => {
  try {
    // Lấy tất cả subscription và populate các trường liên quan
    const subscriptions = await Subscription.find()
      .populate("userId", "name email")
      .populate({
        path: "courseId",
        select: "name price coachId",
        populate: {
          path: "coachId",
          select: "name email", // Chọn các trường muốn lấy từ bảng Account
        },
      });

 
    // Tính tổng doanh thu từ tất cả các subscription
    const totalRevenue = subscriptions.reduce(
      (acc, subscription) => acc + (subscription.courseId.price || 0),
      0
    );

    // Đếm số lượng subscription đang active và bị blocked
    const activeCount = subscriptions.filter(
      (sub) => sub.subscriptionStatus.status === "active"
    ).length;
    const blockedCount = subscriptions.filter(
      (sub) => sub.subscriptionStatus.status === "blocked"
    ).length;

    res.status(200).json({
      subscriptions,
      totalRevenue,
      activeCount,
      blockedCount,
    });
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu doanh thu:", error);
    res.status(500).json({ message: "Lỗi server : "+error });
  }
};

const getSubscriptionDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const subscription = await Subscription.findById(id)
      .populate("userId", "name email")
      .populate("courseId", "name price");

    if (!subscription) {
      return res.status(404).json({ message: "Không tìm thấy gói đăng ký" });
    }

    res.status(200).json(subscription);
  } catch (error) {
    console.error("Error fetching subscription detail:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getRevenueData,
  getSubscriptionDetail,
};

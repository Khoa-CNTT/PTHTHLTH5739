const Subscription = require("../../models/subscription");
const Course = require("../../models/course");

// lấy doang thu theo coachId
const getRevenueByCoachId = async (req, res) => {
  try {
    const coachId = req.account.id;

    // Tìm các khóa học thuộc về coachId
    const courses = await Course.find({ coachId });

    // Lấy tổng số khóa học
    const totalCourses = courses.length;

    // Lấy danh sách courseIds để lọc subscriptions
    const courseIds = courses.map((course) => course._id);

    // Lấy tất cả subscriptions liên quan đến các khóa học của coach
    const subscriptions = await Subscription.find({
      courseId: { $in: courseIds },
    }).populate("courseId", "name price")      
      .populate("userId", "name email");

    // Tính tổng doanh thu dựa trên giá trị `price` của từng subscription
    const totalRevenue = subscriptions.reduce(
      (sum, sub) => sum + (sub.courseId.price || 0),
      0
    );

    // Tính tổng số subscriptions
    const totalSubscriptions = subscriptions.length;

    // Tính số lượng người mua cho từng khóa học theo tháng
    const purchasesByCourseAndMonth = {};
    subscriptions.forEach((sub) => {
      const courseName = sub.courseId.name;
      const month = new Date(sub.startDate).getMonth() + 1;
      const year = new Date(sub.startDate).getFullYear();
      const monthYear = `${month}/${year}`;

      if (!purchasesByCourseAndMonth[courseName]) {
        purchasesByCourseAndMonth[courseName] = {};
      }
      if (!purchasesByCourseAndMonth[courseName][monthYear]) {
        purchasesByCourseAndMonth[courseName][monthYear] = 0;
      }
      purchasesByCourseAndMonth[courseName][monthYear] += 1;
    });

    // Định dạng dữ liệu cho biểu đồ
    const chartData = [];
    Object.keys(purchasesByCourseAndMonth).forEach((courseName) => {
      Object.keys(purchasesByCourseAndMonth[courseName]).forEach(
        (monthYear) => {
          chartData.push({
            course: courseName,
            monthYear,
            purchases: purchasesByCourseAndMonth[courseName][monthYear],
          });
        }
      );
    });

    // Trả về kết quả
    res.status(200).json({
      success: true,
      subscriptions,
      totalRevenue,
      totalSubscriptions,
      totalCourses,
      courses,
      chartData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getRevenueByCoachId,
};

const Workout = require("../../models/workout");
const Subscription = require("../../models/subscription");
const Coach = require("../../models/coach");
const Course = require("../../models/course");
const moment = require("moment");
const Advice = require("../../models/advice");

// Lấy tất cả các đăng ký của người dùng hiện tại
exports.getUserSubscriptions = async (req, res) => {
  const userId = req.account.id;

  try {
    // Tìm tất cả các đăng ký của người dùng, sắp xếp theo thời gian tạo mới nhất và populate thông tin khóa học và workout
    const subscriptions = await Subscription.find({ userId })
      .populate({
        path: "courseId",
        select: "name price image",
        populate: {
          path: "coachId",
          model: "Account",
          select: "name",
        },
      })
      .populate({
        path: "workoutId",
        model: "Workout",
        select: "name date status preview",
      })
      .sort({ createdAt: -1 });

    console.log("Đã lấy các đăng ký của người dùng:", subscriptions);

    // Nếu không tìm thấy đăng ký nào cho người dùng này
    if (!subscriptions.length) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy đăng ký nào cho người dùng này" });
    }

    res.status(200).json({ subscriptions });
  } catch (error) {
    console.error("Lỗi khi lấy các đăng ký của người dùng:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

// Lấy chi tiết của một đăng ký theo ID
exports.getSubscriptionDetails = async (req, res) => {
  const { subscriptionId } = req.params;

  try {
    // Tìm đăng ký theo ID và populate thông tin khóa học, doanh thu và workout
    const subscription = await Subscription.findById(subscriptionId)
      .populate({
        path: "courseId",
        select: "name price",
        populate: {
          path: "coachId", // Lấy thông tin huấn luyện viên
          model: "Account",
          select: "name",
        },
      })
      .populate({
        path: "revenue",
        select: "amount date",
      })
      .populate({
        path: "workoutId", // Lấy thông tin workout
        model: "Workout",
        select: "name date status preview",
      });

    // Nếu không tìm thấy đăng ký
    if (!subscription) {
      return res.status(404).json({ message: "Không tìm thấy đăng ký" });
    }

    res.status(200).json(subscription);
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết đăng ký:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

// Lấy danh sách các workout thuộc một đăng ký cụ thể, có thể lọc theo ngày
exports.getSubscriptionWorkouts = async (req, res) => {
  const { subscriptionId } = req.params;
  const { date } = req.query;

  try {
    // Tìm đăng ký theo ID và populate danh sách workout
    const subscription = await Subscription.findById(subscriptionId).populate({
      path: 'workoutId',
      select: "name date status preview", // Đảm bảo advice được bao gồm nếu cần
    });

    // Nếu không tìm thấy đăng ký
    if (!subscription) {
      return res.status(404).json({ message: "Không tìm thấy đăng ký" });
    }

    // Lọc workout theo ngày nếu có tham số date
    let workouts = subscription.workoutId;
    if (date) {
      const selectedDate = moment(date).startOf("day");
      workouts = workouts.filter((workout) =>
        moment(workout.date).isSame(selectedDate, "day")
      );
    }

    // Nếu không tìm thấy workout nào cho ngày đã chọn
    if (!workouts.length) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy workout nào cho ngày đã chọn" });
    }

    // Trả về danh sách workout
    res.status(200).json({ workouts });
  } catch (error) {
    console.error("Lỗi khi lấy các workout của đăng ký:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};
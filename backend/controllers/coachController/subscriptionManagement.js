const Subscription = require("../../models/subscription");
const Workout = require("../../models/workout");
const Course = require("../../models/course");
const Exercise = require("../../models/exercise");

// Lấy danh sách đăng ký theo coachId
const getSubscriptionsByCoachId = async (req, res) => {
  try {
    const coachId = req.account.id;

    // Tìm các khóa học thuộc về coachId
    const courses = await Course.find({ coachId });

    // Lấy danh sách courseIds để lọc đăng ký
    const courseIds = courses.map((course) => course._id);

    // Tìm các đăng ký thuộc về các khóa học này
    const subscriptions = await Subscription.find({
      courseId: { $in: courseIds },
    })
      .populate("userId", "name email")
      .populate("courseId", "name description")
      .populate('workoutId', 'status')
      .exec();

    res.status(200).json({ success: true, data: subscriptions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy danh sách workout trong một đăng ký cụ thể
const getWorkoutsBySubscriptionId = async (req, res) => {
  try {
    const { subscriptionId } = req.params;

    // Tìm đăng ký và populate chi tiết workout, bao gồm progress và thông tin bài tập
    const subscription = await Subscription.findById(subscriptionId).populate({
      path: "workoutId",
      model: "Workout",
      populate: {
        path: "progressId",
        model: "Progress",
        populate: {
          path: "exerciseId",
          model: "Exercise",
          select: "name description exerciseType exerciseDuration difficulty",
        },
      },
    });

    if (!subscription) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy đăng ký" });
    }

    console.log(subscription);

    res.status(200).json({ success: true, data: subscription.workoutId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Controller để lấy danh sách bài tập theo coachId
const getExercisesByCoach = async (req, res) => {
  try {
    const coachId = req.account.id;

    // Tìm tất cả bài tập liên quan đến coachId đã cho
    const exercises = await Exercise.find({
      coachId: coachId,
      isDelete: false,
    });

    if (!exercises.length) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy bài tập nào cho huấn luyện viên này." });
    }

    res.status(200).json(exercises);
  } catch (error) {
    console.error("Lỗi khi lấy bài tập theo huấn luyện viên:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

// Controller để cập nhật chi tiết workout trong đăng ký
const updateSubscriptionWorkout = async (req, res) => {
  try {
    const { workoutId } = req.params;
    const { name, date, status } = req.body;

    // Kiểm tra xem có workout nào khác cùng ngày không
    const existingWorkout = await Workout.findOne({
      date,
      _id: { $ne: workoutId },
    });
    if (existingWorkout) {
      return res
        .status(400)
        .json({ message: "Đã tồn tại một workout khác vào ngày này." });
    }

    // Cập nhật workout
    const updatedWorkout = await Workout.findByIdAndUpdate(
      workoutId,
      {
        name,
        date,
        status,
      },
      { new: true }
    );

    if (!updatedWorkout) {
      return res.status(404).json({ message: "Không tìm thấy workout" });
    }

    res.status(200).json(updatedWorkout);
  } catch (error) {
    console.error("Lỗi khi cập nhật workout:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

const getSuvBySubscription = async (req, res) => {
  try {
    const { id } = req.params;

    const subscription = await Subscription.findById(id).populate({
      path: "courseId",
      model: "Course",
      populate: {
        path: "questions",
        model: "Question",
        populate: {
          path: "optionId",
          model: "Option"
        }
      },
    });
    res.status(200).json(subscription);
  } catch (error) {
    console.error("Lỗi khi lấy thông tin khảo sát theo đăng ký:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
}
module.exports = {
  getSubscriptionsByCoachId,
  getWorkoutsBySubscriptionId,
  getExercisesByCoach,
  updateSubscriptionWorkout,
  getSuvBySubscription
};
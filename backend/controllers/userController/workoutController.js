const Workout = require("../../models/workout");
const Subscription = require("../../models/subscription");
const Revenue = require("../../models/revenue");
const Coach = require("../../models/coach");
const Course = require("../../models/course");
const moment = require("moment");
const Advice = require("../../models/advice");

exports.getUserSubscriptions = async (req, res) => {
  const userId = req.account.id;

  try {
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
        path: "revenue",
        select: "amount date",
      })
      .populate({
        path: "workoutId",
        model: "Workout",
        select: "name date status preview",
      })
      .sort({ createdAt: -1 });

    console.log("Fetched Subscriptions with Revenue:", subscriptions);

    if (!subscriptions.length) {
      return res
        .status(404)
        .json({ message: "No subscriptions found for this user" });
    }

    res.status(200).json({ subscriptions });
  } catch (error) {
    console.error("Error fetching user subscriptions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getSubscriptionDetails = async (req, res) => {
  const { subscriptionId } = req.params;

  try {
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
        path: "workoutId", // Lấy thông tin huấn luyện viên
        model: "Workout",
        select: "name date status preview",
      })

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    res.status(200).json(subscription);
  } catch (error) {
    console.error("Error fetching subscription details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Hàm để lấy subscription và các workout liên quan
exports.getSubscriptionWorkouts = async (req, res) => {
  const { subscriptionId } = req.params;
  const { date } = req.query;

  try {
    const subscription = await Subscription.findById(subscriptionId).populate({
      path: 'workoutId',
      select: "name date status preview", // Ensure to include advice in the selection

    });

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    // console.log(subscription.workoutId);

    let workouts = subscription.workoutId;
    if (date) {
      const selectedDate = moment(date).startOf("day");
      workouts = workouts.filter((workout) =>
        moment(workout.date).isSame(selectedDate, "day")
      );
    }

    if (!workouts.length) {
      return res
        .status(404)
        .json({ message: "No workouts found for the selected date" });
    }

    // Return the workouts
    res.status(200).json({ workouts });
  } catch (error) {
    console.error("Error fetching subscription workouts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



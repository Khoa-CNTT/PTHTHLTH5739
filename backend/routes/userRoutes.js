const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getUserProfile,
  editUserProfile,
  changePassword,
  createSurvey,
} = require("../controllers/userController/userProfileController");


// const upload = require('../middleware/multer');
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

const {
  getAllQuestions,
  getCategories,
} = require("../controllers/userController/courseController");
const courseController = require("../controllers/userController/courseController");
const workoutController = require("../controllers/userController/workoutController");

const { getAllBlogsByUser, getBlogById, getAllBlogCategory } = require('../controllers/userController/userBlogController');

/*
 * --------------------------------------------------------------------------
 *  PROFILE
 *
 */
router.put("/editUserProfile", authMiddleware(["user"]), editUserProfile);
router.put(
  "/changePassword",
  authMiddleware(["user", "coach"]),
  changePassword
);
router.get(
  "/getAccount",
  authMiddleware(["user", "coach", "admin"]),
  getUserProfile
);
router.get("/getUserProfile", authMiddleware(["user"]), getUserProfile);

/*
 * --------------------------------------------------------------------------
 *  COURSE
 *
 */

// Route lấy toàn bộ khóa học

router.get("/questions", getAllQuestions);
router.get("/courses", courseController.getAllCourses);
router.get(
  "/purchased-courses",
  authMiddleware(["user"]),
  courseController.getUserPurchasedCourses
);

// Route lấy chi tiết khóa học
router.get("/courses/:id", courseController.getCourseDetail);

// Lấy thông tin workout theo khóa học
router.get(
  "/course-detail/workouts/:workoutId",
  progressController.getWorkoutDetails
);



// BLOG
router.get("/blogs", getAllBlogsByUser);
router.get("/blogs/:blogId", getBlogById);
router.get("/blogCategory", getAllBlogCategory);



/*
 * --------------------------------------------------------------------------
 *  CATEGORIES
 *
 */

router.get("/categories", getCategories); // Thêm route mới

/*
 * --------------------------------------------------------------------------
 *  WORKOUT
 *
 */

router.get(
  "/subscriptions",
  authMiddleware(["user"]),
  workoutController.getUserSubscriptions
);

router.get(
  "/subscriptions/:subscriptionId",
  authMiddleware(["user"]),
  workoutController.getSubscriptionDetails
);

router.get(
  "/subscriptions/:subscriptionId/workouts",
  workoutController.getSubscriptionWorkouts
);


module.exports = router;

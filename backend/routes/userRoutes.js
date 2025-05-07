const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getUserProfile,
  editUserProfile,
  changePassword,
  createSurvey,
} = require("../controllers/userController/userProfileController");

const {getSuvBySubscription} = require("../controllers/coachController/subscriptionManagement")
// const upload = require('../middleware/multer');
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

const {
  getSurveyByUserId,
  checkSurveyBeforeView,
  saveSurvey,
  updateSurvey,
} = require("../controllers/userController/surveyUserController");
const {
  getAllQuestions,
  getCategories,
} = require("../controllers/userController/courseController");
const courseController = require("../controllers/userController/courseController");
const workoutController = require("../controllers/userController/workoutController");
const {
  getCourseRatings,
  addFeedback,
  rateCourse,
  updateFeedback,
  deleteFeedback,
  getFeedbacksByCourseId,
  getCurrentUser,
} = require("../controllers/userController/feedbackController");

const progressController = require('../controllers/userController/progressController');
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


router.post(
  "/payment",
  authMiddleware(["user"]),
  courseController.subscriptionPayment
);

router.post("/payment-success", courseController.handleMomoIPN);

router.get(
  "/subscribe/payment-success",
  courseController.subscriptionPaymentSuccess
);

/*
 * --------------------------------------------------------------------------
 *  FEEDBACK COURSE
 *
 */

// API: Lấy user hiện tại
router.get("/me", authMiddleware(["user"]), getCurrentUser);

// API: Thêm bình luận cho khóa học
// API thêm feedback
router.post(
  "/courses/:courseId/feedbacks",
  authMiddleware(["user"]),
  upload.fields([
    { name: "image", maxCount: 2 },
    { name: "video", maxCount: 1 },
  ]),
  addFeedback
);

router.post("/courses/:courseId/rating", authMiddleware(["user"]), rateCourse);

// API lấy thông tin rating của khóa học
router.get("/courses/:courseId/rating", getCourseRatings);

// API lấy danh sách feedback của khóa học
router.get("/courses/:courseId/feedbacks", getFeedbacksByCourseId);

// API cập nhật feedback
router.put(
  "/courses/:courseId/feedbacks/:feedbackId",
  authMiddleware(["user"]),
  upload.fields([
    { name: "image", maxCount: 2 },
    { name: "video", maxCount: 1 },
  ]),
  updateFeedback
);

// API xóa feedback
router.delete(
  "/courses/:courseId/feedbacks/:feedbackId",
  authMiddleware(["user"]),
  deleteFeedback
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

/*
 * --------------------------------------------------------------------------
 *  PROGRESS
 *
 */

router.get(
  "/workouts/:workoutId",
  authMiddleware(["user"]),
  progressController.getWorkoutDetails
);

router.patch(
  "/progress/:progressId",
  authMiddleware(["user"]),
  progressController.updateProgressCompletion
);

router.put(
  "/workouts/:workoutId/finished",
  authMiddleware(["user"]),
  progressController.updateFinishWorkout
);

router.get('/workouts/:workoutId/advice', authMiddleware(['user']), progressController.getAdviceForWorkout);



/*
 * --------------------------------------------------------------------------
 *  SUBSCRIPTION
 *
 */

// Kiểm tra xem surveyId có tồn tại không
router.get(
  "/subscriptions/:subscriptionId/check-survey",
  authMiddleware(["user", "coach", "admin"]),
  checkSurveyBeforeView
);

router.post(
  "/subscriptions/:subscriptionId/survey",
  authMiddleware(["user"]),
  saveSurvey
);

//  survey của người dùng
router.get(
  "/:subscriptionId/survey",
  authMiddleware(["coach", "user"]),
  getSurveyByUserId
);
router.put("/surveys/:surveyId", authMiddleware(["user"]), updateSurvey);
router.get(
  "/subscriptions",
  authMiddleware(["user"]),
  workoutController.getUserSubscriptions
);

router.get("/detailSub/:id", getSuvBySubscription);

module.exports = router;

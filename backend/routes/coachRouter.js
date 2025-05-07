const express = require("express");
const router = express.Router();
const Coach = require("../models/coach");
const authMiddleware = require("../middleware/authMiddleware");

const {
  getCoachProfile,
  editCoachProfile,
} = require("../controllers/coachController/coachProfileController");

const {
  submitBlogByCoach,
  updateCoachBlog,
  deleteCoachBlog,
  getCoachBlogs,
  getCoachBlogsById,
} = require("../controllers/coachController/coachBlogManagement");

const {
  getCoachList,
  getCoachDetail,
} = require("../controllers/userController/coachInfoController");


const {
  getAllBlogCategory,
} = require("../controllers/adminController/blogManagement");

const {
  getWorkoutsPreviewBySubscriptionId,
  giveAdviceForPreview,
  updateAdviceForPreview,
  deleteAdviceForPreview,
  getAdviceForPreview,
} = require("../controllers/coachController/coachPreviewController");

const {
  getAllQuestions,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  addOptionToQuestion,
  updateOption,
  deleteOption
} = require('../controllers/coachController/questionController');

const courseController = require("../controllers/coachController/courseController");

const exerciseController = require("../controllers/coachController/exerciseController");

const multer = require("../middleware/multer");

// COACH INFORMATION

router.get("/getCoachProfile", authMiddleware(["coach"]), getCoachProfile);
router.put("/editCoachProfile", authMiddleware(["coach"]), editCoachProfile);

// BLOG

router.post("/blogs", authMiddleware(["coach"]), submitBlogByCoach);

// Get all blogs submitted by the logged-in coach
router.get("/blogs", authMiddleware(["coach"]), getCoachBlogs);
router.get("/blogs/:blogId", authMiddleware(["coach"]), getCoachBlogsById);

router.put("/blogs/:blogId", authMiddleware(["coach"]), updateCoachBlog);

router.delete("/blogs/:blogId", authMiddleware(["coach"]), deleteCoachBlog);

router.get("/blogCategory", authMiddleware(["coach"]), getAllBlogCategory);


/*
 * --------------------------------------------------------------------------
 *  COURSE
 *
 */

// Tạo khóa học
router.post(
  "/createCourse",
  authMiddleware(["coach"]),
  courseController.createCourse
);


// Lấy danh sách các khóa học
router.get(
  "/course",
  authMiddleware(["coach"]),
  courseController.getCoursesByCoachId
);
router.get(
  "/course/:courseId",
  authMiddleware(["coach"]),
  courseController.getCourseById
);

// Cập nhật khóa học
router.put(
  "/course/update/:courseId",
  authMiddleware(["coach"]),
  courseController.updateCourse
);

// Xóa khóa học
router.delete(
  "/course/delete/:courseId",
  authMiddleware(["coach"]),
  courseController.deleteCourse
);

/*
 * --------------------------------------------------------------------------
 *  PROGRESS
 *
 */
router.post(
  "/workouts/:workoutId/progress",
  authMiddleware(["coach"]),
  courseController.createProgressForExercise
);

/*
 * --------------------------------------------------------------------------
 *  EXERCISE
 *
 */

router.get(
  "/exercises",
  authMiddleware(["coach", "admin"]),
  exerciseController.getExercisesByCoachId
);

// Route để tạo bài tập mới
router.post(
  "/exercises",
  authMiddleware(["coach"]),
  multer.single("video"),
  exerciseController.createExercise
);
router.get(
  "/exercises/:id",
  authMiddleware(["coach"]),
  exerciseController.getExerciseById
);

// Route để cập nhật bài tập
router.put(
  "/exercises/:id",
  authMiddleware(["coach"]),
  exerciseController.updateExercise
);

// Route để xóa bài tập
router.delete(
  "/exercises/:id",
  authMiddleware(["coach"]),
  exerciseController.deleteExercise
);

//check exercise using in course
router.get(
  "/exercises/check-usage/:id",
  authMiddleware(["coach"]),
  exerciseController.checkExerciseUsage
);

/*
 * --------------------------------------------------------------------------
 *  SUBSCRIPTION MANAGEMENT
 *
 */
const {
  getSubscriptionsByCoachId,
  getWorkoutsBySubscriptionId,
  getExercisesByCoach,
  updateSubscriptionWorkout,
} = require("../controllers/coachController/subscriptionManagement");

router.get(
  "/subscriptions",
  authMiddleware(["coach"]),
  getSubscriptionsByCoachId
);

router.get(
  "/subscriptions/:subscriptionId/workouts",
  authMiddleware(["coach"]),
  getWorkoutsBySubscriptionId
);

router.get("/exercises", authMiddleware(["coach"]), getExercisesByCoach);

router.put(
  "/subscription/workouts/:workoutId",
  authMiddleware(["coach"]),
  updateSubscriptionWorkout
);

router.get(
  "/preview/:subscriptionId",
  authMiddleware(["coach"]),
  getWorkoutsPreviewBySubscriptionId
);

router.get(
  "/preview/:subscriptionId/:workoutId/advice",
  authMiddleware(["coach"]),
  getAdviceForPreview
);


router.post(
  "/preview/:subscriptionId/:workoutId/advice",
  authMiddleware(["coach"]),
  giveAdviceForPreview
);

router.put(
  "/preview/:subscriptionId/:workoutId/advice",
  authMiddleware(["coach"]),
  updateAdviceForPreview
);

router.delete(
  "/preview/:subscriptionId/:workoutId/advice",
  authMiddleware(["coach"]),
  deleteAdviceForPreview
);


/*
 * --------------------------------------------------------------------------
 *    SUBSCRIPTION REVENUE
 *
 */
const {
  getRevenueByCoachId,
} = require("../controllers/coachController/revenueManage");

router.get("/revenue", authMiddleware(["coach"]), getRevenueByCoachId);

router.get("/coachList", getCoachList);
router.get("/coachList/:id", getCoachDetail);
/*
* --------------------------------------------------------------------------
*  SURVEY
*
*/

// CRUD Question
router.get('/questions', getAllQuestions);
router.post('/questions', addQuestion);
router.put('/questions/:id', updateQuestion);
router.delete('/questions/:id', deleteQuestion);
// CRUD Option
router.post('/questions/:id/options', addOptionToQuestion);
router.put('/questions/:id/options/:optionId', updateOption);
router.delete('/questions/:id/options/:optionId', deleteOption);

/*
 * --------------------------------------------------------------------------
 *    Feedback
 *
 */
const feedbackController = require('../controllers/coachController/feedbackController');

router.get('/feedbacks', authMiddleware(["coach"]), feedbackController.getAllFeedbacks);
router.put('/feedbacks/:feedbackId', authMiddleware(["coach"]), feedbackController.updateFeedback);

module.exports = router;

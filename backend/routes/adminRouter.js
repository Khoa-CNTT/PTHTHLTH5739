const express = require("express");
const router = express.Router();

const userAdminController = require("../controllers/adminController/userAdmin");
const coachAdminController = require("../controllers/adminController/coachAdmin");


const {
  getSubmittedCourses,
  getCourseDetail,
  acceptCourse,
  rejectCourse,
} = require("../controllers/adminController/courseManagement");



const {
  getBlogById,
  // getAllCommentsByBlog,
  // createComment,
  // updateComment,
  // deleteComment,
  // updateBlog,
  // createBlog,
  // deleteBlog,
  rejectBlog,
  approveBlog,
  getAllBlogsByUser,
  getAllBlogsByAdmin,
  // getBlogByIdAdmin,
  // getAllBlogCategory,
  // createBlogCategory,
  // updateBlogCategory,
  // deleteBlogCategory,
} = require("../controllers/adminController/blogManagement");




const {
  getRevenueData,
  getSubscriptionDetail,
} = require("../controllers/adminController/adminRevenue");
const authMiddleware = require("../middleware/authMiddleware");

/*
 * --------------------------------------------------------------------------
 *  ACCOUNT
 *
 */

// Get all accounts
router.get(
  "/accounts",
  authMiddleware(["admin"]),
  userAdminController.getAllAccounts
);

// Create a new account
router.post(
  "/accounts",
  authMiddleware(["admin"]),
  userAdminController.createAccount
);

// Update an account's
router.put(
  "/accounts/:accountId",
  authMiddleware(["admin"]),
  userAdminController.updateAccount
);

// Update user role to coach
router.put(
  "/accounts/role/:id",
  authMiddleware(["admin"]),
  userAdminController.UpdateRole
);

// Block/unblock an account
router.patch(
  "/accounts/:accountId/status",
  authMiddleware(["admin"]),
  userAdminController.blockUnblockAccount
);

/*
 * --------------------------------------------------------------------------
 *  COACH
 *
 */

// Create a new coach
router.post(
  "/createCoach",
  authMiddleware(["admin"]),
  coachAdminController.createCoach
);
router.get(
  "/coaches",
  authMiddleware(["admin"]),
  coachAdminController.getAllCoaches
);
router.get(
  "/coaches/:id",
  authMiddleware(["admin"]),
  coachAdminController.getCoachById
);
router.put(
  "/coaches/edit",
  authMiddleware(["admin"]),
  coachAdminController.editCoach
);
router.patch(
  "/coaches/:idCoach/status",
  authMiddleware(["admin"]),
  coachAdminController.blockUnblockCoach
);
router.patch(
  "/coaches/:idCoach/changeRole",
  authMiddleware(["admin"]),
  coachAdminController.changeRoleToUser
);

/*
 * --------------------------------------------------------------------------
 *  BLOG
 *
 */

// CRUD Blog
router.get("/blogs", getAllBlogsByUser);
router.get("/blogs/:blogId", getBlogById);

router.get("/manageBlog", authMiddleware(['admin']), getAllBlogsByAdmin);
router.put("/manageBlog/:blogId/accept", authMiddleware(['admin']), approveBlog);
router.put("/manageBlog/:blogId/reject", authMiddleware(['admin']), rejectBlog);


/*
 * --------------------------------------------------------------------------
 *  COURSE
 *
 */

router.get("/courses", authMiddleware(["admin"]), getSubmittedCourses);

router.get("/courses/:id", authMiddleware(["admin"]), getCourseDetail);
// router.get("/courses/:id", getCourseDetail);
router.patch("/courses/:id/accept", authMiddleware(["admin"]), acceptCourse);
router.patch("/courses/:id/reject", authMiddleware(["admin"]), rejectCourse);

/**
 * ----------------------------------------------------------------------------
 * REVENUE
 */

router.get("/revenue", authMiddleware(["admin"]), getRevenueData);

router.get("/revenue/:id", authMiddleware(["admin"]), getSubscriptionDetail);

module.exports = router;

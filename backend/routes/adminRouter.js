const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

/*
 * --------------------------------------------------------------------------
 *  ACCOUNT
 *
 */

// Lấy tất cả accounts
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
router.post("/manageBlog", authMiddleware(['admin']), createBlog);

router.get("/manageBlog/:blogId", authMiddleware(['admin']), getBlogByIdAdmin);
router.put("/manageBlog/:blogId", authMiddleware(['admin']), updateBlog);
router.delete("/manageBlog/:blogId", authMiddleware(['admin']), deleteBlog);

//
router.put("/manageBlog/:blogId/accept", authMiddleware(['admin']), approveBlog);
router.put("/manageBlog/:blogId/reject", authMiddleware(['admin']), rejectBlog);

// CRUD Blog Category

router.get("/blogCategory", authMiddleware(['admin']), getAllBlogCategory);
router.post("/blogCategory", authMiddleware(['admin']), createBlogCategory);
router.put("/blogCategory/:blogCategoryId", authMiddleware(['admin']), updateBlogCategory);
router.delete("/blogCategory/:blogCategoryId", authMiddleware(['admin']), deleteBlogCategory);


// CRUD Comment
router.get("/blogs/:blogId/comments", getAllCommentsByBlog);
router.post("/blogs/:blogId/comments", authMiddleware(['user', 'coach', 'admin']), createComment);
router.put("/comments/:commentId", authMiddleware(['user', 'coach', 'admin']), updateComment);
router.delete("/comments/:commentId", authMiddleware(['user', 'coach', 'admin']), deleteComment);

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


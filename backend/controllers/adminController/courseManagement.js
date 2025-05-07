const { populate } = require("../../models/blog");
const Course = require("../../models/course");
const mongoose = require("mongoose");

exports.getSubmittedCourses = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default values for page and limit

  try {
    const courseId = req.params.id;
    // Calculate the number of courses to skip based on current page
    const skip = (page - 1) * limit;

    // Find courses that are not deleted (isDeleted: false)
    const courses = await Course.find({ courseId })
      .skip(skip)
      .limit(limit)
      .populate("coachId", "name email") // Only retrieve name and email of the coach
      .populate({
        path: "workout", // Populate workouts in the course
        populate: {
          path: "progressId", // Populate progress inside workouts
          populate: {
            path: "exerciseId", // Populate exercise in progress
            select: "name exerciseDuration", // Only fetch necessary fields from exercise
          },
        },
      });

    // Get total count of courses to calculate the total pages
    const totalCourses = await Course.countDocuments({ courseId });

    // Calculate total pages
    const totalPages = Math.ceil(totalCourses / limit);

    res.status(200).json({
      courses, // List of courses on the current page
      totalPages, // Total number of pages
      currentPage: page, // Current page
      totalCourses, // Total number of courses
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Error fetching courses." });
  }
};

// Lấy chi tiết một khóa học theo ID
exports.getCourseDetail = async (req, res) => {
  try {
    const courseId = req.params.id;
    // Validate the courseId to check if it's a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    // Fetch the course by ID along with related coach, exercises, workouts, and progress
    const course = await Course.findById(courseId)
      .populate("coachId", "name email") // Populate coachId with name and email
      .populate({
        path: "workout", // Populate workouts
        populate: {
          path: "progressId", // Populate progress inside workouts
          select: "note completionRate exerciseId", // Select relevant progress fields
          populate: {
            path: "exerciseId", // Populate exerciseId to get the exercise details
            select: "name exerciseDuration exerciseType", // Select relevant fields from Exercise model
          },
        },
      });

    // If course not found, send a 404 response
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Optionally log the course for debugging purposes
    console.log("Course:", course);

    // Send the course data in the response
    res.status(200).json(course);
  } catch (error) {
    // Handle any unexpected errors and send a 500 response
    console.error("Error fetching course by ID:", error);
    res
      .status(500)
      .json({ message: "Error fetching course", error: error.message });
  }
};

// Thay đổi trạng thái khóa học thành "accepted"
exports.acceptCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { status: "accepted" },
      { new: true }
    );
    res.status(200).json(updatedCourse);
  } catch (error) {
    console.error("Error accepting course:", error);
    res.status(500).json({ message: "Error accepting course." });
  }
};

// Thay đổi trạng thái khóa học thành "rejected"
exports.rejectCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const { rejectionReason } = req.body; // Get the rejection reason from the request body

    // Validate that rejectionReason is provided
    if (!rejectionReason) {
      return res.status(400).json({ message: "Rejection reason is required." });
    }

    // Find and update the course's status and rejectionReason
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        status: "rejected",
        rejectionReason: rejectionReason, // Set the rejection reason
      },
      { new: true } // Return the updated course document
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found." });
    }

    res.status(200).json(updatedCourse);
  } catch (error) {
    console.error("Error rejecting course:", error);
    res.status(500).json({ message: "Error rejecting course." });
  }
};

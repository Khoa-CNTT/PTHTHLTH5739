const { populate } = require("../../models/blog");
const Course = require("../../models/course");
const mongoose = require("mongoose");

// Lấy danh sách các khóa học đã nộp
exports.getSubmittedCourses = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Giá trị mặc định cho trang và số lượng trên trang

  try {
    // Tính toán số lượng khóa học cần bỏ qua dựa trên trang hiện tại
    const skip = (page - 1) * limit;

    // Tìm các khóa học chưa bị xóa (isDeleted: false)
    const courses = await Course.find({ isDeleted: false })
      .skip(skip)
      .limit(limit)
      .populate("coachId", "name email") // Chỉ lấy tên và email của huấn luyện viên
      .populate({
        path: "workout", // Lấy thông tin chi tiết của các buổi tập trong khóa học
        populate: {
          path: "progressId", // Lấy thông tin chi tiết của tiến trình trong các buổi tập
          populate: {
            path: "exerciseId", // Lấy thông tin chi tiết của bài tập trong tiến trình
            select: "name exerciseDuration", // Chỉ lấy tên và thời lượng bài tập
          },
        },
      });

    // Lấy tổng số khóa học để tính tổng số trang
    const totalCourses = await Course.countDocuments({ isDeleted: false });

    // Tính tổng số trang
    const totalPages = Math.ceil(totalCourses / limit);

    res.status(200).json({
      courses, // Danh sách các khóa học trên trang hiện tại
      totalPages, // Tổng số trang
      currentPage: page, // Trang hiện tại
      totalCourses, // Tổng số khóa học
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách khóa học:", error);
    res.status(500).json({ message: "Lỗi khi lấy danh sách khóa học." });
  }
};

// Lấy chi tiết một khóa học theo ID
exports.getCourseDetail = async (req, res) => {
  try {
    const courseId = req.params.id;
    // Kiểm tra courseId có phải là một ObjectId hợp lệ của MongoDB không
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "ID khóa học không hợp lệ" });
    }

    // Lấy khóa học theo ID cùng với thông tin chi tiết của huấn luyện viên, bài tập, buổi tập và tiến trình
    const course = await Course.findById(courseId)
      .populate("coachId", "name email") // Lấy tên và email của huấn luyện viên
      .populate({
        path: "workout", // Lấy thông tin chi tiết của các buổi tập
        populate: {
          path: "progressId", // Lấy thông tin chi tiết của tiến trình trong các buổi tập
          select: "note completionRate exerciseId", // Chọn các trường liên quan của tiến trình
          populate: {
            path: "exerciseId", // Lấy thông tin chi tiết của bài tập từ progressId
            select: "name exerciseDuration exerciseType", // Chọn các trường liên quan từ model Exercise
          },
        },
      });

    // Nếu không tìm thấy khóa học, trả về lỗi 404
    if (!course) {
      return res.status(404).json({ message: "Không tìm thấy khóa học" });
    }

    // Ghi log khóa học để debug (tùy chọn)
    console.log("Khóa học:", course);

    // Trả về dữ liệu khóa học trong response
    res.status(200).json(course);
  } catch (error) {
    // Xử lý mọi lỗi không mong muốn và trả về lỗi 500
    console.error("Lỗi khi lấy khóa học theo ID:", error);
    res
      .status(500)
      .json({ message: "Lỗi khi lấy khóa học", error: error.message });
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
    console.error("Lỗi khi chấp nhận khóa học:", error);
    res.status(500).json({ message: "Lỗi khi chấp nhận khóa học." });
  }
};

// Thay đổi trạng thái khóa học thành "rejected"
exports.rejectCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const { rejectionReason } = req.body; // Lấy lý do từ chối từ body request

    // Kiểm tra xem rejectionReason có được cung cấp không
    if (!rejectionReason) {
      return res.status(400).json({ message: "Cần cung cấp lý do từ chối." });
    }

    // Tìm và cập nhật trạng thái và lý do từ chối của khóa học
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        status: "rejected",
        rejectionReason: rejectionReason, // Thiết lập lý do từ chối
      },
      { new: true } // Trả về document khóa học đã được cập nhật
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: "Không tìm thấy khóa học." });
    }

    res.status(200).json(updatedCourse);
  } catch (error) {
    console.error("Lỗi khi từ chối khóa học:", error);
    res.status(500).json({ message: "Lỗi khi từ chối khóa học." });
  }
};
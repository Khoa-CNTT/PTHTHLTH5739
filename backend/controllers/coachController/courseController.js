const { populate } = require("../../models/blog");
const Course = require("../../models/course");
const Exercise = require("../../models/exercise");
const Workout = require("../../models/workout");
const Progress = require("../../models/progress");
const mongoose = require("mongoose");
const axios = require("axios");

exports.getAllExercises = async (req, res) => {
  try {
    // Lấy các bài tập mà isDelete là false
    const exercises = await Exercise.find({ isDelete: false });

    if (!exercises || exercises.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy bài tập nào." });
    }

    res.status(200).json(exercises);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bài tập:", error);
    res
      .status(500)
      .json({ msg: "Lỗi khi lấy danh sách bài tập", error: error.message });
  }
};

// Tạo một khóa học mới

exports.createCourse = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      image,
      slotNumber,
      discount,
      category,
      listExercise,
      questions
    } = req.body;
    const coachId = req.account.id;
    let workoutNumber = 0;
    const workouts = [];

    // Lặp qua từng slot buổi tập và tạo các buổi tập với tiến trình
    for (workoutNumber; workoutNumber < listExercise.length; workoutNumber++) {
      const workoutDetails = listExercise[workoutNumber];
      const workoutName =
        workoutDetails.name || `Buổi tập ${workoutNumber + 1}`;
      const workoutDescription = workoutDetails.description || "";
      const listVideo = workoutDetails.listVideo || []; // Lấy danh sách video từ workoutDetails

      const progresses = []; // Danh sách lưu trữ tiến trình cho buổi tập hiện tại

      // Lặp qua các bài tập cho buổi tập này và tạo tiến trình cho từng bài
      for (const exerciseId of workoutDetails.exercises) {
        const progress = await createProgress(exerciseId); // Tạo tiến trình cho từng bài tập
        progresses.push(progress._id);
      }

      // Tạo một buổi tập liên kết với các tiến trình này
      const workoutCreated = await createWorkout(
        workoutName,
        workoutDescription,
        new Date(), // Ngày hiện tại
        "", // Placeholder trạng thái
        progresses, // Danh sách ID tiến trình
        "", // Placeholder video
        "", // Placeholder lời khuyên
        listVideo // Truyền listVideo vào hàm createWorkout
      );

      workouts.push(workoutCreated._id);
    }
    const check = 'accepted'
    const videoCheck = true
    // Tạo khóa học
    const newCourse = new Course({
      name,
      description,
      slotNumber,
      price,
      discount: discount || 0,
      image,
      coachId: new mongoose.Types.ObjectId(coachId),
      category,
      workout: workouts,
      isDeleted: false,
      status: 'submit',
      questions
    });

    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (error) {
    console.error("Lỗi khi tạo khóa học:", error);
    res
      .status(500)
      .json({ message: "Lỗi khi tạo khóa học", error: error.message });
  }
};

const createProgress = async (exerciseId) => {
  try {
    const newProgress = new Progress({
      exerciseId: exerciseId,
      note: "Chưa bắt đầu", // Ghi chú mặc định
      completionRate: 0, // Tỷ lệ hoàn thành mặc định
    });

    // Lưu và trả về tiến trình đã tạo
    const savedProgress = await newProgress.save();
    return savedProgress;
  } catch (error) {
    console.error("Lỗi khi tạo tiến trình:", error);
    throw new Error("Lỗi khi tạo tiến trình");
  }
};

const createWorkout = async (
  name,
  description,
  date,
  status,
  progressIds,
  video,
  advice,
  listVideo // Thêm tham số listVideo
) => {
  try {
    const newWorkout = new Workout({
      name,
      description,
      date,
      status,
      progressId: progressIds,
      preview: {
        video: video,
        advice: advice,
      },
      listVideo: listVideo, // Lưu danh sách video
    });

    // Lưu và trả về buổi tập đã tạo
    const savedWorkout = await newWorkout.save();
    return savedWorkout;
  } catch (error) {
    console.error("Lỗi khi tạo buổi tập:", error);
    throw new Error("Lỗi khi tạo buổi tập");
  }
};

// Lấy danh sách các khóa học theo coachId
exports.getCoursesByCoachId = async (req, res) => {
  try {
    const coachId = req.account.id; // Lấy coachId từ tài khoản đã đăng nhập
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Đếm tổng số khóa học của huấn luyện viên mà isDeleted là false
    const totalCourses = await Course.countDocuments({
      coachId,
      isDeleted: false,
    });

    // Lấy các khóa học mà isDeleted là false, populate coachId và workout
    const courses = await Course.find({ coachId: coachId })
      .skip(skip)
      .limit(limit)
      .populate("coachId", "name email") // Chỉ lấy tên và email của huấn luyện viên
      .populate({
        path: "workout", // Lấy thông tin chi tiết của các buổi tập trong khóa học
        populate: {
          path: "progressId", // Lấy thông tin chi tiết của tiến trình trong các buổi tập
          populate: {
            path: "exerciseId", // Lấy thông tin chi tiết của bài tập trong tiến trình
            select: "name exerciseDuration", // Chỉ lấy các trường cần thiết từ bài tập
          },
        },
      });

    if (!courses.length) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy khóa học nào cho huấn luyện viên này" });
    }

    res.status(200).json({
      totalCourses,
      totalPages: Math.ceil(totalCourses / limit),
      currentPage: page,
      courses,
    });
  } catch (error) {
    console.error("Lỗi khi lấy khóa học theo coachId:", error);
    res
      .status(500)
      .json({ message: "Lỗi khi lấy khóa học", error: error.message });
  }
};

// Lấy khóa học theo id
exports.getCourseById = async (req, res) => {
  try {
    const courseId = req.params.courseId;

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

exports.updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const {
      name,
      description,
      slotNumber,
      price,
      discount,
      image,
      category,
      workout,
    } = req.body;

    let updatedWorkouts = [];

    // Xử lý các buổi tập
    if (workout && workout.length > 0) {
      updatedWorkouts = await Promise.all(
        workout.map(async (item) => {
          if (item._id) {
            // Nếu buổi tập đã tồn tại, cập nhật nó
            const updatedWorkout = await Workout.findById(item._id);
            updatedWorkout.name = item.name || updatedWorkout.name;
            updatedWorkout.preview = item.preview || updatedWorkout.preview;

            // 2.1 Cập nhật tiến trình của buổi tập
            if (item.progressId && item.progressId.length > 0) {
              updatedWorkout.progressId = await Promise.all(
                item.progressId.map(async (progress) => {
                  if (progress._id) {
                    // Nếu tiến trình tồn tại, cập nhật nó
                    const updatedProgress = await Progress.findById(
                      progress._id
                    );
                    updatedProgress.note =
                      progress.note || updatedProgress.note;
                    updatedProgress.completionRate =
                      progress.completionRate || updatedProgress.completionRate;
                    await updatedProgress.save();
                    return updatedProgress._id;
                  } else {
                    // Nếu tiến trình không tồn tại, tạo mới
                    const newProgress = await createProgress(
                      progress.exerciseId._id
                    );
                    return newProgress._id;
                  }
                })
              );
            }

            // 2.2 Cập nhật listVideo nếu được cung cấp
            if (item.listVideo && item.listVideo.length > 0) {
              updatedWorkout.listVideo = item.listVideo;
            }

            await updatedWorkout.save();
            return updatedWorkout._id;
          } else {
            // Nếu buổi tập không có _id, tạo một buổi tập mới
            const newProgressIds = [];

            // Tạo các mục tiến trình mới nếu cần
            if (item.progressId && item.progressId.length > 0) {
              for (let progress of item.progressId) {
                const newProgress = await createProgress(
                  progress.exerciseId._id
                );
                newProgressIds.push(newProgress._id);
              }
            }

            // Tạo buổi tập mới với listVideo
            const newWorkout = await createWorkout(
              item.name,
              item.description,
              new Date(),
              item.status || "Chưa bắt đầu",
              newProgressIds,
              item.preview?.video || "",
              item.preview?.advice || "",
              item.listVideo || [] // Thêm listVideo vào việc tạo buổi tập mới
            );

            return newWorkout._id;
          }
        })
      );
    }

    // 3. Cập nhật khóa học với dữ liệu mới
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        name,
        description,
        slotNumber,
        price,
        discount,
        image,
        category,
        workout: updatedWorkouts, // Mảng ID các buổi tập
      },
      { new: true } // Trả về document đã cập nhật
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: "Không tìm thấy khóa học" });
    }

    // Trả về khóa học đã cập nhật
    res.status(200).json(updatedCourse);
  } catch (error) {
    console.error("Lỗi khi cập nhật khóa học:", error);
    res
      .status(500)
      .json({ message: "Lỗi khi cập nhật khóa học", error: error.message });
  }
};

// Xóa khóa học
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { status } = req.query; // Lấy trạng thái từ query parameter

    // Kiểm tra định dạng courseId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Định dạng ID khóa học không hợp lệ." });
    }

    // Tìm khóa học trong database
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Không tìm thấy khóa học." });
    }

    // Nếu trạng thái không phải "accepted", xóa khóa học; ngược lại, thay đổi trạng thái của nó
    if (status !== "accepted") {
      await course.deleteOne(); // Xóa khóa học
      return res.status(200).json({ message: "Đã xóa khóa học thành công." });
    }

    // Thay đổi trạng thái isDeleted cho các khóa học "accepted"
    course.isDeleted = !course.isDeleted; // Đảo ngược giá trị isDeleted
    await course.save(); // Lưu khóa học đã cập nhật

    res.status(200).json({
      message: `Đã đánh dấu khóa học là ${course.isDeleted ? "đã xóa" : "đang hoạt động"
        } thành công.`,
      updatedCourse: course,
    });
  } catch (error) {
    console.log("Lỗi khi thay đổi hoặc xóa khóa học:", error); // Log lỗi
    res.status(500).json({ message: error.message });
  }
};

// Tạo progress
exports.createProgressForExercise = async (req, res) => {
  const { exercises } = req.body;
  const { workoutId } = req.params;

  console.log("Đã nhận bài tập:", exercises); // Dòng debug

  try {
    const workout = await Workout.findById(workoutId);
    if (!workout) {
      return res.status(404).json({ message: "Không tìm thấy buổi tập" });
    }

    if (!Array.isArray(workout.progressId)) {
      workout.progressId = [];
    }

    if (!exercises || !Array.isArray(exercises)) {
      return res.status(400).json({ message: "Dữ liệu bài tập không hợp lệ" });
    }

    const progressEntries = await Promise.all(
      exercises.map(async (exercise) => {
        const newProgress = new Progress({
          exerciseId: exercise.exerciseId,
          note: exercise.note,
          completionRate: "",
        });
        const savedProgress = await newProgress.save();
        workout.progressId.push(savedProgress._id);
        return savedProgress;
      })
    );

    await workout.save();
    res.status(201).json({
      message: "Đã thêm tiến trình vào buổi tập",
      progress: progressEntries,
    });
  } catch (error) {
    console.error("Lỗi khi tạo các mục tiến trình:", error);
    res.status(500).json({
      message: "Không thể tạo các mục tiến trình",
      error: error.message,
    });
  }
};

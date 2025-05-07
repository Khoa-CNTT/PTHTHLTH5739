const Exercise = require("../../models/exercise");
const Course = require("../../models/course");
const Workout = require("../../models/workout");
const Progress = require("../../models/progress");
const Coach = require("../../models/account");
const mongoose = require("mongoose");

// Lấy danh sách bài tập theo coachId (chỉ lấy các bài tập chưa bị xóa)
exports.getExercisesByCoachId = async (req, res) => {
  try {
    const coachId = req.account.id;

    // Tìm các bài tập của coachId và có isDelete là false
    const exercises = await Exercise.find({
      coachId: coachId,
      isDelete: false,
    });

    if (!exercises || exercises.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy bài tập nào cho huấn luyện viên này.",
      });
    }

    res.status(200).json(exercises);
  } catch (error) {
    console.error("Lỗi khi lấy bài tập theo coachId:", error);
    res.status(500).json({
      message: "Lỗi khi lấy bài tập",
      error: error.message,
    });
  }
};

// Kiểm tra xem bài tập có đang được sử dụng trong khóa học nào không
exports.checkExerciseUsage = async (req, res) => {
  try {
    const exerciseId = req.params.id;

    // Tìm tất cả progress có chứa bài tập này
    const progressesWithExercise = await Progress.find({
      exerciseId: exerciseId,
    });

    if (progressesWithExercise.length === 0) {
      return res.status(200).json({
        isUsed: false,
        courses: [],
      });
    }

    // Lấy tất cả progressIds
    const progressIds = progressesWithExercise.map((progress) => progress._id);

    // Tìm các workout có chứa các progress này
    const workoutsWithProgress = await Workout.find({
      progressId: { $in: progressIds },
    });

    if (workoutsWithProgress.length === 0) {
      return res.status(200).json({
        isUsed: false,
        courses: [],
      });
    }

    // Tìm các course có chứa các workout này
    const coursesUsingExercise = await Course.find({
      workout: { $in: workoutsWithProgress.map((w) => w._id) },
    }).select("name");

    const isUsed = coursesUsingExercise.length > 0;

    res.status(200).json({
      isUsed,
      courses: coursesUsingExercise.map((course) => ({
        id: course._id,
        name: course.name,
      })),
    });
  } catch (error) {
    console.error("Lỗi khi kiểm tra việc sử dụng bài tập:", error);
    res.status(500).json({
      message: "Lỗi khi kiểm tra việc sử dụng bài tập",
      error: error.message,
    });
  }
};

// Hàm kiểm tra tính hợp lệ của dữ liệu bài tập
const validateExercise = async (exercise) => {
  const errors = {};

  // Kiểm tra tên
  if (!exercise.name) {
    errors.name = "Tên bài tập không được để trống";
  } else if (exercise.name.length < 3 || exercise.name.length > 100) {
    errors.name = "Tên bài tập phải từ 3 đến 100 ký tự";
  } else {
    // Kiểm tra trùng tên
    const existingExercise = await Exercise.findOne({
      name: exercise.name,
      coachId: exercise.coachId,
      isDelete: false,
    });
    if (existingExercise) {
      errors.name = "Tên bài tập đã tồn tại";
    }
  }

  // Kiểm tra mô tả
  if (!exercise.description) {
    errors.description = "Mô tả không được để trống";
  } else if (
    exercise.description.length < 10 ||
    exercise.description.length > 1000
  ) {
    errors.description = "Mô tả phải từ 10 đến 1000 ký tự";
  }

  // Kiểm tra loại bài tập
  const validTypes = ["Cardio", "Strength", "Flexibility", "Balance"];
  if (!validTypes.includes(exercise.exerciseType)) {
    errors.exerciseType = "Loại bài tập không hợp lệ";
  }

  // Kiểm tra độ khó
  const validDifficulties = ["Dễ", "Trung bình", "Khó"];
  if (!validDifficulties.includes(exercise.difficulty)) {
    errors.difficulty = "Mức độ khó không hợp lệ";
  }

  // Kiểm tra thời lượng video
  if (!exercise.exerciseDuration || exercise.exerciseDuration < 10) {
    errors.exerciseDuration = "Thời lượng video phải ít nhất 10 giây";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Tạo một bài tập mới
exports.createExercise = async (req, res) => {
  try {
    const exerciseData = {
      ...req.body,
      coachId: req.account.id,
    };

    // Kiểm tra tính hợp lệ của dữ liệu bài tập
    const { isValid, errors } = await validateExercise(exerciseData);
    if (!isValid) {
      return res.status(400).json({ errors });
    }

    // Tạo bài tập nếu dữ liệu hợp lệ
    const exercise = new Exercise(exerciseData);
    await exercise.save();

    res.status(201).json(exercise);
  } catch (error) {
    console.error("Lỗi khi tạo bài tập:", error);
    res.status(500).json({ message: "Lỗi khi tạo bài tập" });
  }
};

// Lấy bài tập theo ID
exports.getExerciseById = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id); // Tìm bài tập theo ID
    if (!exercise || exercise.isDelete) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy bài tập hoặc bài tập đã bị xóa" });
    }
    res.status(200).json(exercise); // Trả về chi tiết bài tập
  } catch (error) {
    console.error("Lỗi khi lấy bài tập:", error);
    res
      .status(500)
      .json({ message: "Lỗi khi lấy bài tập", error: error.message });
  }
};

// Cập nhật bài tập
exports.updateExercise = async (req, res) => {
  try {
    const {
      name,
      description,
      exerciseType,
      exerciseDuration,
      video,
      difficulty,
    } = req.body;

    // Tìm bài tập theo ID
    const exercise = await Exercise.findById(req.params.id);
    console.log("Request params ID:", req.params.id);
    console.log("Exercise:", exercise);

    // Kiểm tra xem bài tập có tồn tại hoặc đã bị xóa không
    if (!exercise || exercise.isDelete) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy bài tập hoặc bài tập đã bị xóa" });
    }

    // Cập nhật bài tập với dữ liệu mới
    const updatedExercise = await Exercise.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        exerciseType,
        exerciseDuration,
        video,
        difficulty,
      },
      { new: true } // Trả về bài tập đã cập nhật
    );

    res.status(200).json(updatedExercise); // Trả về bài tập đã cập nhật
  } catch (error) {
    console.error("Lỗi khi cập nhật bài tập:", error);
    res
      .status(500)
      .json({ message: "Lỗi khi cập nhật bài tập", error: error.message });
  }
};

// Xóa mềm một bài tập (đặt isDelete thành true)
exports.deleteExercise = async (req, res) => {
  try {
    console.log("Request params ID:", req.params.id); // Log ID bài tập

    // Tìm bài tập theo ID
    const exercise = await Exercise.findById(req.params.id);

    // Kiểm tra xem bài tập có tồn tại hoặc đã bị xóa chưa
    if (!exercise || exercise.isDelete) {
      console.log("Không tìm thấy bài tập hoặc bài tập đã bị xóa");
      return res
        .status(404)
        .json({ message: "Không tìm thấy bài tập hoặc bài tập đã bị xóa" });
    }

    // Xóa mềm bằng cách đặt isDelete thành true
    exercise.isDelete = true;
    await exercise.save();

    console.log("Đã đánh dấu bài tập là đã xóa thành công");
    res
      .status(200)
      .json({ message: "Bài tập đã được đánh dấu là đã xóa thành công" });
  } catch (error) {
    console.error("Lỗi khi xóa bài tập:", error);
    res
      .status(500)
      .json({ message: "Lỗi khi xóa bài tập", error: error.message });
  }
};
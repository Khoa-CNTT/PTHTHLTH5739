const Exercise = require("../../models/exercise");
const Course = require("../../models/course");
const Workout = require("../../models/workout");
const Progress = require("../../models/progress");
const Coach = require("../../models/account");
const mongoose = require("mongoose");

// Get exercises by coachId (only retrieves exercises where isDelete is false)
exports.getExercisesByCoachId = async (req, res) => {
  try {
    const coachId = req.account.id;

    // Find exercises for the given coachId where isDelete is false
    const exercises = await Exercise.find({
      coachId: coachId,
      isDelete: false,
    });

    if (!exercises || exercises.length === 0) {
      return res.status(404).json({
        message: "No exercises found for this coach.",
      });
    }

    res.status(200).json(exercises);
  } catch (error) {
    console.error("Error while fetching exercises by coachId:", error);
    res.status(500).json({
      message: "Error while fetching exercises",
      error: error.message,
    });
  }
};

exports.checkExerciseUsage = async (req, res) => {
  try {
    const exerciseId = req.params.id;

    // Tìm tất cả progress có chứa exercise này
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
    console.error("Error checking exercise usage:", error);
    res.status(500).json({
      message: "Error checking exercise usage",
      error: error.message,
    });
  }
};

const validateExercise = async (exercise) => {
  const errors = {};

  // Validate name
  if (!exercise.name) {
    errors.name = "Tên bài tập không được để trống";
  } else if (exercise.name.length < 3 || exercise.name.length > 100) {
    errors.name = "Tên bài tập phải từ 3 đến 100 ký tự";
  } else {
    // Check trùng tên
    const existingExercise = await Exercise.findOne({
      name: exercise.name,
      coachId: exercise.coachId,
      isDelete: false,
    });
    if (existingExercise) {
      errors.name = "Tên bài tập đã tồn tại";
    }
  }

  // Validate description
  if (!exercise.description) {
    errors.description = "Mô tả không được để trống";
  } else if (
    exercise.description.length < 10 ||
    exercise.description.length > 1000
  ) {
    errors.description = "Mô tả phải từ 10 đến 1000 ký tự";
  }

  // Validate exerciseType
  const validTypes = ["Cardio", "Strength", "Flexibility", "Balance"];
  if (!validTypes.includes(exercise.exerciseType)) {
    errors.exerciseType = "Loại bài tập không hợp lệ";
  }

  // Validate difficulty
  const validDifficulties = ["Dễ", "Trung bình", "Khó"];
  if (!validDifficulties.includes(exercise.difficulty)) {
    errors.difficulty = "Mức độ khó không hợp lệ";
  }

  // Validate video duration
  if (!exercise.exerciseDuration || exercise.exerciseDuration < 10) {
    errors.exerciseDuration = "Thời lượng video phải ít nhất 10 giây";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Create a new exercise
exports.createExercise = async (req, res) => {
  try {
    const exerciseData = {
      ...req.body,
      coachId: req.account.id,
    };

    // Validate exercise data
    const { isValid, errors } = await validateExercise(exerciseData);
    if (!isValid) {
      return res.status(400).json({ errors });
    }

    // Create exercise if validation passes
    const exercise = new Exercise(exerciseData);
    await exercise.save();

    res.status(201).json(exercise);
  } catch (error) {
    console.error("Error creating exercise:", error);
    res.status(500).json({ message: "Error creating exercise" });
  }
};

// Get exercise by ID
exports.getExerciseById = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id); // Find exercise by ID
    if (!exercise || exercise.isDelete) {
      return res
        .status(404)
        .json({ message: "Exercise not found or has been deleted" });
    }
    res.status(200).json(exercise); // Return exercise details
  } catch (error) {
    console.error("Error while fetching exercise:", error);
    res
      .status(500)
      .json({ message: "Error while fetching exercise", error: error.message });
  }
};

// Update exercise
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

    // Find exercise by ID
    const exercise = await Exercise.findById(req.params.id);
    console.log("Request params ID:", req.params.id);
    console.log("Exercise:", exercise);

    // Check if the exercise exists or has been deleted
    if (!exercise || exercise.isDelete) {
      return res
        .status(404)
        .json({ message: "Exercise not found or has been deleted" });
    }

    // Update the exercise with new data
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
      { new: true } // Return the updated exercise
    );

    res.status(200).json(updatedExercise); // Return the updated exercise
  } catch (error) {
    console.error("Error while updating exercise:", error);
    res
      .status(500)
      .json({ message: "Error while updating exercise", error: error.message });
  }
};

// Soft delete an exercise (set isDelete to true)
exports.deleteExercise = async (req, res) => {
  try {
    console.log("Request params ID:", req.params.id); // Log the exercise ID

    // Find exercise by ID
    const exercise = await Exercise.findById(req.params.id);

    // Check if the exercise exists or has been already deleted
    if (!exercise || exercise.isDelete) {
      console.log("Exercise not found or already deleted");
      return res
        .status(404)
        .json({ message: "Exercise not found or already deleted" });
    }

    // Soft delete by setting isDelete to true
    exercise.isDelete = true;
    await exercise.save();

    console.log("Exercise marked as deleted successfully");
    res
      .status(200)
      .json({ message: "Exercise has been successfully marked as deleted" });
  } catch (error) {
    console.error("Error while deleting exercise:", error);
    res
      .status(500)
      .json({ message: "Error while deleting exercise", error: error.message });
  }
};

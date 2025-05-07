const Survey = require("../../models/survey");
const Subscription = require("../../models/subscription");
const Question = require("../../models/question");
const Option = require("../../models/option");
const Account = require("../../models/account");
const mongoose = require("mongoose");
const Course = require("../../models/course");
const Progress = require("../../models/progress");
const Workout = require("../../models/workout");

// Lấy thông tin khảo sát của người dùng theo ID đăng ký
const getSurveyByUserId = async (req, res) => {
  try {
    const { subscriptionId } = req.params;

    // Tìm subscription và populate survey với các câu hỏi và tùy chọn
    const subscription = await Subscription.findById(subscriptionId).populate({
      path: "surveyId",
      model: "Survey",
      populate: {
        path: "surveyOptions.questionId",
        model: "Question",
        populate: {
          path: "optionId",
          model: "Option",
        },
      },
    });

    // Kiểm tra nếu không có subscription hoặc survey
    if (!subscription || !subscription.surveyId) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy khảo sát cho đăng ký này" });
    }

    // Lấy dữ liệu survey đã populate đầy đủ
    const survey = subscription.surveyId;

    res.status(200).json(survey); // Trả về survey với các câu hỏi và tùy chọn
  } catch (error) {
    console.error("Lỗi khi lấy khảo sát:", error);
    res
      .status(500)
      .json({ message: "Lỗi khi lấy khảo sát", error: error.message });
  }
};

// Cập nhật thông tin khảo sát
const updateSurvey = async (req, res) => {
  const { surveyId } = req.params; // lấy surveyId từ params
  const updateData = req.body; // lấy dữ liệu cập nhật từ body request

  try {
    // Tìm survey theo surveyId
    const survey = await Survey.findById(surveyId);
    if (!survey) {
      return res.status(404).json({ message: "Không tìm thấy khảo sát" });
    }

    // Cập nhật các thông tin cơ bản của survey
    if (updateData.level) survey.level = updateData.level;
    if (updateData.dayPerWeek) survey.dayPerWeek = updateData.dayPerWeek;
    if (updateData.hourPerDay) survey.hourPerDay = updateData.hourPerDay;
    if (updateData.height) survey.height = updateData.height;
    if (updateData.weight) survey.weight = updateData.weight;

    // Cập nhật các câu hỏi và lựa chọn trong survey
    if (updateData.surveyOptions) {
      for (const option of updateData.surveyOptions) {
        const { questionId, optionId, questionText, newOptions } = option;

        // Tìm câu hỏi theo questionId
        let question = await Question.findById(questionId);
        if (!question) {
          return res.status(404).json({ message: "Không tìm thấy câu hỏi" });
        }

        // Nếu có questionText, cập nhật nội dung câu hỏi
        if (questionText) {
          question.question = questionText;
        }

        // Nếu có newOptions, cập nhật hoặc thêm mới các tùy chọn
        if (newOptions) {
          const updatedOptions = [];
          for (const newOption of newOptions) {
            if (newOption._id) {
              // Nếu option đã tồn tại, cập nhật
              const existingOption = await Option.findById(newOption._id);
              if (existingOption) {
                existingOption.option =
                  newOption.option || existingOption.option;
                existingOption.image = newOption.image || existingOption.image;
                await existingOption.save();
                updatedOptions.push(existingOption._id);
              }
            } else {
              // Nếu option chưa tồn tại, tạo mới
              const createdOption = new Option({
                option: newOption.option,
                image: newOption.image,
              });
              await createdOption.save();
              updatedOptions.push(createdOption._id);
            }
          }
          question.optionId = updatedOptions; // Cập nhật danh sách optionId
        }

        // Lưu câu hỏi đã cập nhật
        await question.save();

        // Cập nhật optionId vào surveyOptions
        const existingSurveyOption = survey.surveyOptions.find(
          (opt) => opt.questionId.toString() === questionId.toString()
        );

        if (existingSurveyOption) {
          existingSurveyOption.optionId = optionId;
        } else {
          survey.surveyOptions.push({ questionId, optionId });
        }
      }
    }

    // Lưu lại survey
    await survey.save();

    // Populate lại survey để trả về dữ liệu đầy đủ như khi GET
    const updatedSurvey = await Survey.findById(surveyId).populate({
      path: "surveyOptions.questionId",
      model: "Question",
      populate: {
        path: "optionId",
        model: "Option",
      },
    });

    return res.status(200).json({
      message: "Đã cập nhật khảo sát thành công",
      survey: updatedSurvey,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật khảo sát:", error);
    return res.status(500).json({ message: "Lỗi khi cập nhật khảo sát", error });
  }
};

// Kiểm tra xem người dùng đã hoàn thành khảo sát trước khi xem nội dung khóa học
const checkSurveyBeforeView = async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const userId = req.account.id; // User hiện tại từ middleware xác thực

    console.log("User ID:", userId);
    console.log("Subscription ID:", subscriptionId);

    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      console.log("Không tìm thấy đăng ký.");
      return res.status(404).json({ message: "Không tìm thấy đăng ký" });
    }

    // console.log("Đã tìm thấy đăng ký:", subscription);

    // Kiểm tra quyền truy cập
    if (subscription.userId.toString() !== userId) {
      console.log("Truy cập bị từ chối. ID người dùng không khớp.");
      return res.status(403).json({
        message: "Truy cập bị từ chối. Đăng ký này không thuộc về bạn.",
      });
    }

    // Kiểm tra xem đã hoàn thành khảo sát chưa
    if (!subscription.surveyId) {
      console.log("Khảo sát chưa hoàn thành.");
      return res.status(201).json({
        message: "Khảo sát chưa hoàn thành. Vui lòng hoàn thành khảo sát trước.",
      });
    }

    res.status(200).json({ message: "Khảo sát đã hoàn thành. Đã cấp quyền truy cập." });
  } catch (error) {
    console.error("Lỗi khi kiểm tra khảo sát:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

// Hàm tính toán danh sách ngày tập luyện
const calculateWorkoutDates = (startDate, dayPerWeek, totalSessions) => {
  const workoutDates = [];
  const daysOfWeekMap = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
    Sunday: 0,
  };

  const selectedDays = dayPerWeek.map((day) => daysOfWeekMap[day]);

  let currentDate = new Date(startDate);
  while (workoutDates.length < totalSessions) {
    if (selectedDays.includes(currentDate.getDay())) {
      workoutDates.push(new Date(currentDate));
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return workoutDates;
};

// Lưu thông tin khảo sát và tạo lịch tập luyện ban đầu cho người dùng
const saveSurvey = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { subscriptionId, answers, height, weight, dayPerWeek } = req.body;
    const subWorkout = [];
    const today = new Date(); // Ngày bắt đầu: ngày hiện tại
    console.log("Thông tin yêu cầu:", req.body);

    // Tìm subscription
    const subscription = await Subscription.findById(subscriptionId)
      .session(session)
      .populate({
        path: "courseId",
        populate: {
          path: "workout",
          select: "name description",
          populate: {
            path: "progressId",
            select: "exerciseId",
          },
        },
      });

    if (!subscription) {
      console.error("Không tìm thấy đăng ký:", subscriptionId);
      return res.status(404).json({ message: "Không tìm thấy đăng ký." });
    }
    console.log("Thông tin đăng ký:", subscription);

    // Số buổi tập luyện (dựa vào slotNumber của course)
    const totalSessions = subscription.courseId.slotNumber;

    // Tính toán ngày tập luyện
    const workoutDates = calculateWorkoutDates(
      today,
      dayPerWeek,
      totalSessions
    );
    console.log("Ngày tập luyện:", workoutDates);

    // Kiểm tra nếu số lượng workout ít hơn số buổi tập luyện
    const workouts = subscription.courseId.workout;
    if (workouts.length < workoutDates.length) {
      throw new Error("Số lượng bài tập không đủ để tạo lịch.");
    }

    // Tạo progress và workout theo từng ngày tập luyện (1 workout cho mỗi ngày)
    for (let i = 0; i < workoutDates.length; i++) {
      const date = workoutDates[i];
      const currentWorkout = workouts[i % workouts.length]; // Lặp vòng tròn nếu workout không đủ

      // Lấy danh sách exerciseId từ progress của workout
      const exerciseIds = currentWorkout.progressId.map(
        (progress) => progress.exerciseId
      );

      // Tạo progress mới
      const newProgress = await createProgress(exerciseIds, session);

      // Tạo workout mới
      const newWorkout = await createWorkout(
        currentWorkout.name,
        currentWorkout.description,
        date, // Gán ngày tập luyện
        "", // Status
        newProgress, // Progress
        "", // Video placeholder
        "", // Advice placeholder
        session
      );
      subWorkout.push(newWorkout._id);
    }

    // Thêm workout vào subscription
    subscription.workoutId.push(...subWorkout);

    // Lưu survey
    const surveyOptionsArray = Object.keys(answers).map((questionId) => ({
      questionId,
      optionId: answers[questionId],
    }));

    const survey = new Survey({
      dayPerWeek,
      height,
      weight,
      surveyOptions: surveyOptionsArray,
    });
    await survey.save({ session });

    // Gán surveyId vào subscription
    subscription.surveyId = survey._id;
    await subscription.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ message: "Đã lưu khảo sát thành công!" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Lỗi khi lưu khảo sát:", error.message);
    res
      .status(500)
      .json({ message: "Lỗi máy chủ nội bộ", error: error.message });
  }
};

// Hàm tạo Progress
const createProgress = async (exerciseIds, session) => {
  try {
    // Tạo progress cho mỗi exercise ID
    const progresses = await Progress.insertMany(
      exerciseIds.map((exerciseId) => ({
        exerciseId, // Liên kết với bài tập
        note: "Chưa bắt đầu", // Ghi chú mặc định
        completionRate: 0, // Tỷ lệ hoàn thành mặc định
      })),
      { session }
    );

    // console.log("Progress mới ", progresses);

    return progresses;
  } catch (error) {
    console.error("Lỗi khi tạo progress:", error);
    throw new Error("Lỗi khi tạo progress");
  }
};

// Hàm tạo Workout
const createWorkout = async (
  name,
  description,
  date,
  status,
  progressIds,
  video,
  advice,
  session
) => {
  try {
    const workout = new Workout({
      name,
      description,
      date,
      status,
      progressId: progressIds,
      preview: {
        video,
        advice,
      },
    });

    console.log("Workout: ", workout);

    await workout.save({ session });
    return workout;
  } catch (error) {
    console.error("Lỗi khi tạo workout:", error);
    throw new Error("Lỗi khi tạo workout: " + error.message);
  }
};

module.exports = {
  getSurveyByUserId,
  checkSurveyBeforeView,
  saveSurvey,
  updateSurvey,
};
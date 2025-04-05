const axios = require("axios");
const crypto = require("crypto");
const mongoose = require("mongoose");
const Subscription = require("../../models/subscription");
const Survey = require("../../models/survey");
const Question = require("../../models/question");
const Option = require("../../models/option");
const Course = require("../../models/course");
const Workout = require("../../models/workout");

const moment = require("moment");

const { v4: uuidv4 } = require("uuid");
const { log } = require("console");

// Hàm để lấy tất cả các câu hỏi
exports.getAllQuestions = async (req, res) => {
  const { idCoach } = req.query;
  try {
    const filter = idCoach ? { idCoach } : {};
    const questions = await Question.find(filter).populate('optionId');
    res.status(200).json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: "Error fetching questions" });
  }
};

// Lấy toàn bộ khóa học
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("coachId", "name")
      .populate("exercises");
    res.status(200).json(courses);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách khóa học:", error);
    res.status(500).json({
      message: "Lỗi khi lấy danh sách khóa học",
      error: error.message,
    });
  }
};

// Lấy chi tiết một khóa học theo ID
exports.getCourseDetail = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId)
      .populate("coachId", "name")
      .populate("exercises");

    console.log(">>> course: ", course);

    if (!course) {
      return res.status(404).json({ message: "Khóa học không tồn tại" });
    }

    res.status(200).json(course);
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết khóa học:", error);
    res
      .status(500)
      .json({ message: "Lỗi khi lấy chi tiết khóa học", error: error.message });
  }
};

// API để lấy danh sách category duy nhất
exports.getCategories = async (req, res) => {
  try {
    // Lấy danh sách các category duy nhất từ cơ sở dữ liệu
    const categories = await Course.distinct("category");

    res.status(200).json(categories);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách category:", error);
    res.status(500).json({
      message: "Lỗi khi lấy danh sách category",
      error: error.message,
    });
  }
};

exports.getUserPurchasedCourses = async (req, res) => {
  try {
    const userId = req.account.id; // Lấy userId từ middleware xác thực

    // Truy vấn để lấy cả _id (subscriptionId) và courseId
    const subscriptions = await Subscription.find({ userId }).select(
      "courseId"
    );

    // Tạo một mảng các đối tượng chứa subscriptionId và courseId
    const purchasedCourses = subscriptions.map((sub) => ({
      subscriptionId: sub._id.toString(),
      courseId: sub.courseId.toString(),
    }));

    console.log("Purchased Courses:", purchasedCourses); // Kiểm tra kết quả console

    res.status(200).json({ purchasedCourses });
  } catch (error) {
    console.error("Error fetching purchased courses:", error);
    res.status(500).json({ message: "Error fetching purchased courses" });
  }
};

exports.subscriptionPayment = async (req, res) => {
  const { courseId, price } = req.body;

  const userId = req.account.id;
  console.log("User ID subscriptionPayment:", userId);

  console.log("Request Body:", req.body);

  try {
    // Step 1: Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // MoMo Payment Configuration
    const momoConfig = {
      partnerCode: "MOMO",
      accessKey: "F8BBA842ECF85",
      secretKey: "K951B6PE1waDMi640xX08PD3vg6EkVlz",
      endpoint: "https://test-payment.momo.vn/v2/gateway/api/create",
      orderInfo: "Payment for course subscription",
      redirectUrl: `http://localhost:3000/course/${courseId}`,
      ipnUrl: "https://backend-gym-vazy.onrender.com/api/users/payment-success",
      requestType: "payWithCC",
    };

    // Step 2: Generate MoMo payment request
    const requestId = `${momoConfig.partnerCode}${Date.now()}`;
    const orderId = `${momoConfig.partnerCode}${Date.now()}`;

    // Serialize extra data
    const extraData = Buffer.from(
      JSON.stringify({ courseId, userId })
    ).toString("base64");

    const rawSignature = `accessKey=${momoConfig.accessKey}&amount=${price}&extraData=${extraData}&ipnUrl=${momoConfig.ipnUrl}&orderId=${orderId}&orderInfo=${momoConfig.orderInfo}&partnerCode=${momoConfig.partnerCode}&redirectUrl=${momoConfig.redirectUrl}&requestId=${requestId}&requestType=${momoConfig.requestType}`;
    const signature = crypto
      .createHmac("sha256", momoConfig.secretKey)
      .update(rawSignature)
      .digest("hex");

    const paymentRequest = {
      partnerCode: momoConfig.partnerCode,
      accessKey: momoConfig.accessKey,
      requestId,
      amount: price,
      orderId,
      orderInfo: momoConfig.orderInfo,
      redirectUrl: momoConfig.redirectUrl,
      ipnUrl: momoConfig.ipnUrl,
      extraData, // Pass extra data here
      requestType: momoConfig.requestType,
      signature,
    };

    const momoResponse = await axios.post(momoConfig.endpoint, paymentRequest);

    if (momoResponse.data.resultCode !== 0) {
      console.log("Payment failed:", momoResponse.data.message);
      return res
        .status(400)
        .json({ message: "Payment failed", error: momoResponse.data.message });
    }

    console.log("MoMo Payment Response:", momoResponse.data);

    // Return the payment URL to the client
    res.status(200).json({ payUrl: momoResponse.data.payUrl });
  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.handleMomoIPN = async (req, res) => {
  const { orderId, resultCode, extraData, amount, signature } = req.body;

  console.log("222 Request Body 222:", req.body);

  // Kiểm tra kết quả thanh toán
  if (resultCode !== 0) {
    return res.status(400).json({ message: "Payment unsuccessful" });
  }

  // Kiểm tra extraData
  if (!extraData) {
    return res
      .status(400)
      .json({ message: "Missing extraData in the request" });
  }

  let additionalData;
  try {
    // Giải mã extraData
    additionalData = JSON.parse(
      Buffer.from(extraData, "base64").toString("utf8")
    );
  } catch (err) {
    console.error("Failed to decode extraData:", err);
    return res.status(400).json({ message: "Invalid extraData format" });
  }

  const { courseId, userId } = additionalData;

  // Kiểm tra chữ ký
  const rawSignature = `accessKey=${process.env.MOMO_ACCESS_KEY}&amount=${amount}&extraData=${extraData}&message=${req.body.message}&orderId=${orderId}&orderInfo=${req.body.orderInfo}&orderType=${req.body.orderType}&partnerCode=${req.body.partnerCode}&payType=${req.body.payType}&requestId=${req.body.requestId}&responseTime=${req.body.responseTime}&resultCode=${resultCode}&transId=${req.body.transId}`;
  const generatedSignature = crypto
    .createHmac("sha256", process.env.MOMO_SECRET_KEY)
    .update(rawSignature)
    .digest("hex");

  if (generatedSignature !== signature) {
    return res.status(400).json({ message: "Invalid signature" });
  }

  console.log("Decoded Extra Data:", additionalData);

  // Transaction để đảm bảo tính toàn vẹn dữ liệu
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Step 1: Tìm khóa học
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Step 2: Kiểm tra giá thanh toán
    if (amount !== course.price) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Price mismatch" });
    }

    // Step 3: Tạo bản ghi subscription
    const subscription = new Subscription({
      subscriptionStatus: "active",
      userId,
      courseId,
      price: amount,
    });
    await subscription.save({ session });

    console.log("Subscription created successfully");

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    const surveyUrl = `http://localhost:3000/userSubscription/${subscription._id}/survey`;

    res.status(201).json({
      message: "Payment successful. Subscription and workouts created.",
      subscriptionId: subscription._id,
    });
  } catch (error) {
    console.error("Transaction error:", error);
    await session.abortTransaction();
    session.endSession();
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.subscriptionPaymentSuccess = async (req, res) => {
  const { orderId, resultCode, message } = req.query;
  const subscriptionId = req.query.subscriptionId; // Thêm subscriptionId vào query params

  console.log("Received request for subscription payment success");
  console.log("Order ID:", orderId);
  console.log("Result Code:", resultCode);
  console.log("Message:", message);
  console.log("Subscription ID:", subscriptionId);

  if (resultCode === "0") {
    // Cập nhật trạng thái thanh toán trong database
    try {
      await Subscription.findByIdAndUpdate(subscriptionId, {
        "paymentStatus.status": "paid",
        "paymentStatus.paidAt": new Date(),
      });

      console.log("Payment status updated successfully.");
      // Sau khi cập nhật trạng thái thanh toán thành công
      return res.redirect(
        `http://localhost:3000/subscribe/payment-success?subscriptionId=${subscriptionId}`
      );
    } catch (error) {
      console.error("Error updating payment status:", error);
      return res.redirect("http://localhost:3000/payment-error");
    }
  } else {
    console.log(`Giao dịch thất bại. Thông báo từ MoMo: ${message}`);
    return res.redirect("http://localhost:3000/payment-error");
  }
};

// exports.subscriptionPayment = async (req, res) => {
//   const {
//     courseId,
//     weight,
//     height,
//     dayPerWeek,
//     selectedOptions,
//     price,
//   } = req.body;

//   const userId = req.account.id;
//   console.log("User ID subscriptionPayment:", userId);

//   console.log("Request Body:", req.body);

//   try {
//     // Step 1: Find the course
//     const course = await Course.findById(courseId);
//     if (!course) {
//       return res.status(404).json({ message: "Course not found" });
//     }

//     // MoMo Payment Configuration
//     const momoConfig = {
//       partnerCode: "MOMO",
//       accessKey: "F8BBA842ECF85",
//       secretKey: "K951B6PE1waDMi640xX08PD3vg6EkVlz",
//       endpoint: "https://test-payment.momo.vn/v2/gateway/api/create",
//       orderInfo: "Payment for course subscription",
//       redirectUrl: "http://localhost:3000/userSchedule",
//       redirectUrl: "http://localhost:3000/userSchedule",
//       ipnUrl: "https://eac5-2402-800-61a1-8414-87b-da61-3684-13f2.ngrok-free.app/api/users/payment-success",
//       requestType: "payWithCC",
//     };

//     // Step 2: Generate MoMo payment request
//     const requestId = `${momoConfig.partnerCode}${Date.now()}`;
//     const orderId = `${momoConfig.partnerCode}${Date.now()}`;

//     // Serialize extra data
//     const extraData = Buffer.from(
//       JSON.stringify({ courseId, weight, height, dayPerWeek, selectedOptions, userId })
//     ).toString("base64");

//     const rawSignature = `accessKey=${momoConfig.accessKey}&amount=${price}&extraData=${extraData}&ipnUrl=${momoConfig.ipnUrl}&orderId=${orderId}&orderInfo=${momoConfig.orderInfo}&partnerCode=${momoConfig.partnerCode}&redirectUrl=${momoConfig.redirectUrl}&requestId=${requestId}&requestType=${momoConfig.requestType}`;
//     const signature = crypto.createHmac("sha256", momoConfig.secretKey).update(rawSignature).digest("hex");

//     const paymentRequest = {
//       partnerCode: momoConfig.partnerCode,
//       accessKey: momoConfig.accessKey,
//       requestId,
//       amount: price,
//       orderId,
//       orderInfo: momoConfig.orderInfo,
//       redirectUrl: momoConfig.redirectUrl,
//       ipnUrl: momoConfig.ipnUrl,
//       extraData, // Pass extra data here
//       requestType: momoConfig.requestType,
//       signature,
//     };

//     const momoResponse = await axios.post(momoConfig.endpoint, paymentRequest);

//     if (momoResponse.data.resultCode !== 0) {
//       console.log("Payment failed:", momoResponse.data.message);
//       return res.status(400).json({ message: "Payment failed", error: momoResponse.data.message });
//     }

//     console.log("MoMo Payment Response:", momoResponse.data);

//     // Return the payment URL to the client
//     res.status(200).json({ payUrl: momoResponse.data.payUrl });
//   } catch (error) {
//     console.error("Payment error:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// exports.handleMomoIPN = async (req, res) => {
//   const { orderId, resultCode, extraData, amount, signature } = req.body;

//   console.log("222 Request Body 222:", req.body);

//   // Kiểm tra kết quả thanh toán
//   if (resultCode !== 0) {
//     return res.status(400).json({ message: "Payment unsuccessful" });
//   }

//   // Kiểm tra extraData
//   if (!extraData) {
//     return res.status(400).json({ message: "Missing extraData in the request" });
//   }

//   let additionalData;
//   try {
//     // Giải mã extraData
//     additionalData = JSON.parse(Buffer.from(extraData, "base64").toString("utf8"));
//   } catch (err) {
//     console.error("Failed to decode extraData:", err);
//     return res.status(400).json({ message: "Invalid extraData format" });
//   }

//   const { courseId, weight, height, dayPerWeek, selectedOptions, userId } = additionalData;

//   // Kiểm tra chữ ký
//   const rawSignature = `accessKey=${process.env.MOMO_ACCESS_KEY}&amount=${amount}&extraData=${extraData}&message=${req.body.message}&orderId=${orderId}&orderInfo=${req.body.orderInfo}&orderType=${req.body.orderType}&partnerCode=${req.body.partnerCode}&payType=${req.body.payType}&requestId=${req.body.requestId}&responseTime=${req.body.responseTime}&resultCode=${resultCode}&transId=${req.body.transId}`;
//   const generatedSignature = crypto
//     .createHmac("sha256", process.env.MOMO_SECRET_KEY)
//     .update(rawSignature)
//     .digest("hex");

//   if (generatedSignature !== signature) {
//     return res.status(400).json({ message: "Invalid signature" });
//   }

//   console.log("Decoded Extra Data:", additionalData);

//   // Transaction để đảm bảo tính toàn vẹn dữ liệu
//   const session = await mongoose.startSession();
//   session.startTransaction();
//   try {
//     // Step 1: Tìm khóa học
//     const course = await Course.findById(courseId);
//     if (!course) {
//       return res.status(404).json({ message: "Course not found" });
//     }

//     // Step 2: Kiểm tra giá thanh toán
//     if (amount !== course.price) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({ message: "Price mismatch" });
//     }

//     // Step 3: Tính toán ngày bắt đầu và kết thúc
//     const startDate = moment().add(1, "days").toDate(); // Ngày bắt đầu là ngày mai
//     const totalSessions = course.slotNumber; // Tổng số buổi

//     // Tạo workoutDays
//     const workoutDays = generateWorkoutDays(startDate, dayPerWeek, totalSessions);

//     // const endDate = moment(startDate).add(totalSessions / dayPerWeek, "weeks").toDate();
//     const endDate = workoutDays[workoutDays.length - 1];

//     // Step 4: Tạo bản ghi subscription
//     const subscription = new Subscription({
//       startDate,
//       endDate,
//       subscriptionStatus: "active",
//       userId,
//       courseId,
//       price: amount,
//     });
//     await subscription.save({ session });

//     // Step 5: Chuyển `selectedOptions` thành dạng { questionId, optionId }
//     const surveyOptionsArray = Object.keys(selectedOptions).map((questionId) => ({
//       questionId,
//       optionId: selectedOptions[questionId],
//     }));

//     // Step 6: Tạo survey
//     const survey = new Survey({
//       dayPerWeek,
//       height,
//       weight,
//       surveyOptions: surveyOptionsArray,
//     });
//     await survey.save({ session });

//     // Cập nhật surveyId vào subscription
//     subscription.surveyId = survey._id;
//     await subscription.save({ session });

//     // Step 7: Tạo workout sessions dựa trên thời gian khóa học
//     const workoutRecords = workoutDays.map((date) => ({
//       name: `${course.name} Workout`,
//       date,
//       status: "pending",
//       workout: [],
//       progressId: null,
//       workoutVideo: [],
//     }));

//     const savedWorkouts = await Workout.insertMany(workoutRecords, { session });

//     // Thêm workoutId vào subscription
//     subscription.workoutId = savedWorkouts.map((workout) => workout._id);
//     await subscription.save({ session });

//     console.log("Subscription, survey, and workouts created successfully");

//     // Commit transaction
//     await session.commitTransaction();
//     session.endSession();

//     res.status(201).json({
//       message: "Payment successful. Subscription and workouts created.",
//       subscriptionId: subscription._id,
//       surveyId: survey._id,
//       workoutIds: subscription.workoutId,
//     });
//   } catch (error) {
//     console.error("Transaction error:", error);
//     await session.abortTransaction();
//     session.endSession();
//     res.status(500).json({ message: "Internal server error", error: error.message });
//   }
// };

// exports.subscriptionPayment = async (req, res) => {
//   const {
//     courseId,
//     weight,
//     height,
//     level,
//     dayPerWeek,
//     hourPerDay,
//     selectedOptions,
//     price, // Expecting an object { questionId: optionId }
//   } = req.body;

//   console.log("Request Body:", req.body);

//   try {
//     // Step 1: Find the course
//     const course = await Course.findById(courseId);
//     if (!course) {
//       return res.status(404).json({ message: "Course not found" });
//     }

//     // Step 2: Calculate start and end dates
//     const startDate = moment().add(1, "days").toDate(); // Start date is tomorrow
//     const totalSessions = course.slotNumber; // Total number of sessions in the course
//     const endDate = moment(startDate)
//       .add(totalSessions / dayPerWeek, "weeks")
//       .toDate(); // Calculate end date based on sessions

//     // Step 3: Convert `selectedOptions` to an array of { questionId, optionId }
//     const surveyOptionsArray = Object.keys(selectedOptions).map(
//       (questionId) => ({
//         questionId,
//         optionId: selectedOptions[questionId],
//       })
//     );

//     // Step 4: Create the subscription record
//     const subscription = new Subscription({
//       startDate,
//       endDate,
//       subscriptionStatus: "active",
//       userId: req.account.id,
//       courseId: courseId,
//       price: price,
//     });
//     await subscription.save();

//     // Step 5: Create the survey record with `surveyOptionsArray`
//     const survey = new Survey({
//       level,
//       dayPerWeek,
//       hourPerDay,
//       height,
//       weight,
//       surveyOptions: surveyOptionsArray, // Save as `surveyOptions`
//     });
//     await survey.save();

//     // Step 6: Link the survey with the subscription
//     subscription.surveyId = survey._id;
//     await subscription.save();

//     // Step 7: Generate workout sessions based on the course duration
//     const workoutDays = generateWorkoutDays(
//       startDate,
//       dayPerWeek,
//       totalSessions
//     );

//     const workoutRecords = workoutDays.map((date) => {
//       return new Workout({
//         name: `${course.name} Workout`,
//         date: date,
//         status: "pending",
//         workout: [],
//         progressId: null,
//         workoutVideo: [],
//       });
//     });

//     // Save all the workouts in bulk and get the saved documents back
//     const savedWorkouts = await Workout.insertMany(workoutRecords);

//     // Add the saved workout IDs to the subscription
//     subscription.workoutId = savedWorkouts.map((workout) => workout._id);
//     await subscription.save();

//     // Step 8: Respond with success message
//     res.status(201).json({
//       message: "Payment successful. Subscription and workouts created.",
//       subscriptionId: subscription._id,
//       surveyId: survey._id,
//       workoutIds: subscription.workoutId,
//     });
//   } catch (error) {
//     console.error("Payment error:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// Helper function to generate workout dates
const generateWorkoutDays = (startDate, dayPerWeek, totalSessions) => {
  const daysOfWeekMap = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
    Sunday: 0,
  };

  let workoutDays = [];
  let sessionsCreated = 0;
  let currentDate = moment(startDate);

  while (sessionsCreated < totalSessions) {
    for (let day of dayPerWeek) {
      if (sessionsCreated >= totalSessions) break;

      // Tìm ngày tiếp theo trùng với ngày trong tuần
      let targetDay = daysOfWeekMap[day];
      while (currentDate.day() !== targetDay) {
        currentDate.add(1, "days");
      }

      // Thêm ngày vào danh sách
      workoutDays.push(currentDate.toDate());
      sessionsCreated++;

      // Tiến đến ngày kế tiếp
      currentDate.add(1, "days");
    }
  }

  return workoutDays;
};

// Thanh toán MoMo
// exports.subscriptionPayment = async (req, res) => {
//     var accessKey = 'F8BBA842ECF85';
//     var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
//     var orderInfo = 'pay with MoMo';
//     var partnerCode = 'MOMO';
//     var redirectUrl = 'http://localhost:4000/api/users/payment-success';
//     var redirectUrl = 'http://localhost:4000/api/users/payment-success';
//     var ipnUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
//     // var requestType = "captureWallet";
//     var requestType = "payWithCC";
//     var amount = req.body.price || 0;
//     var orderId = `FitZone-${new Date().getTime()}-${uuidv4()}`;
//     var requestId = orderId;
//     var extraData = '';
//     var autoCapture = true;
//     var lang = 'vi';

//     var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;

//     const crypto = require('crypto');
//     var signature = crypto.createHmac('sha256', secretKey)
//         .update(rawSignature)
//         .digest('hex');

//     const requestBody = {
//         partnerCode: partnerCode,
//         partnerName: "Test",
//         storeId: "MomoTestStore",
//         requestId: requestId,
//         amount: amount,
//         orderId: orderId,
//         orderInfo: orderInfo,
//         redirectUrl: redirectUrl,
//         ipnUrl: ipnUrl,
//         lang: lang,
//         requestType: requestType,
//         autoCapture: autoCapture,
//         extraData: extraData,
//         signature: signature
//     };

//     const options = {
//         method: 'POST',
//         url: 'https://test-payment.momo.vn/v2/gateway/api/create',
//         headers: {
//             'Content-Type': 'application/json',
//             'Content-Length': Buffer.byteLength(JSON.stringify(requestBody))
//         },
//         data: requestBody
//     };

//     try {
//         const result = await axios(options);
//         const payUrl = result.data.payUrl;
//         console.log("--------------------PAY URL----------------")
//         console.log('>>> payUrl: ', payUrl);
//         res.status(200).json({ payUrl });
//     } catch (error) {
//         return res.status(500).json({
//             STATUS_CODES: 500,
//             message: "server error"
//         });
//     }

// };

// exports.subscriptionPaymentSuccess = async (req, res) => {
//     const { orderId, resultCode, message } = req.query;
//     const email = req.session.email;
//     console.log('>>> email 333: ', email);

//     if (resultCode === '0') {
//         console.log(`Giao dịch thành công. Mã đơn hàng: ${orderId}`);
//         // res.send(`Giao dịch thành công. Mã đơn hàng: ${orderId}`);
//         return res.redirect('http://localhost:3000/course');
//         return res.redirect('http://localhost:3000/course');
//     } else {
//         console.log(`Giao dịch thất bại. Thông báo từ MoMo: ${message}`);
//         res.send(`Giao dịch thất bại. Thông báo từ MoMo: ${message}`);
//     }
// };
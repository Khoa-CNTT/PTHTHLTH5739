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
    console.error("Lỗi khi lấy câu hỏi:", error);
    res.status(500).json({ message: "Lỗi khi lấy câu hỏi" });
  }
};

// Lấy toàn bộ khóa học (không bao gồm khóa học đã bị xóa)
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isDeleted: false })
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

// Lấy danh sách các khóa học mà người dùng đã mua
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

    console.log("Khóa học đã mua:", purchasedCourses); // Kiểm tra kết quả console

    res.status(200).json({ purchasedCourses });
  } catch (error) {
    console.error("Lỗi khi lấy các khóa học đã mua:", error);
    res.status(500).json({ message: "Lỗi khi lấy các khóa học đã mua" });
  }
};

// Xử lý thanh toán đăng ký khóa học qua MoMo
exports.subscriptionPayment = async (req, res) => {
  const { courseId, price } = req.body;

  const userId = req.account.id;
  console.log("User ID thanh toán đăng ký:", userId);

  console.log("Thông tin yêu cầu:", req.body);

  try {
    // Bước 1: Tìm khóa học
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Không tìm thấy khóa học" });
    }

    // Cấu hình thanh toán MoMo
    const momoConfig = {
      partnerCode: "MOMO",
      accessKey: "F8BBA842ECF85",
      secretKey: "K951B6PE1waDMi640xX08PD3vg6EkVlz",
      endpoint: "https://test-payment.momo.vn/v2/gateway/api/create",
      orderInfo: "Thanh toán khóa học",
      redirectUrl: `http://localhost:3000/course/${courseId}`,
      //ipnUrl: "https://backend-gym-vazy.onrender.com/api/users/payment-success",
      ipnUrl: "https://welcomed-cat-commonly.ngrok-free.app/api/users/payment-success",
      requestType: "payWithATM",
      lang: "vi",
    };

    // Bước 2: Tạo yêu cầu thanh toán MoMo
    const requestId = `${momoConfig.partnerCode}${Date.now()}`;
    const orderId = `${momoConfig.partnerCode}${Date.now()}`;

    // Serialize dữ liệu bổ sung
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
      extraData, // Truyền dữ liệu bổ sung
      requestType: momoConfig.requestType,
      signature,
    };

    const momoResponse = await axios.post(momoConfig.endpoint, paymentRequest);

    if (momoResponse.data.resultCode !== 0) {
      console.log("Thanh toán thất bại:", momoResponse.data.message);
      return res
        .status(400)
        .json({ message: "Thanh toán thất bại", error: momoResponse.data.message });
    }

    console.log("Phản hồi từ MoMo:", momoResponse.data);

    // Trả về URL thanh toán cho client
    res.status(200).json({ payUrl: momoResponse.data.payUrl });
  } catch (error) {
    console.error("Lỗi thanh toán:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

// Xử lý IPN (Instant Payment Notification) từ MoMo
exports.handleMomoIPN = async (req, res) => {
  const { orderId, resultCode, extraData, amount, signature } = req.body;

  console.log("222 Thông tin nhận được từ MoMo 222:", req.body);

  // Kiểm tra kết quả thanh toán
  if (resultCode !== 0) {
    return res.status(400).json({ message: "Thanh toán không thành công" });
  }

  // Kiểm tra extraData
  if (!extraData) {
    return res
      .status(400)
      .json({ message: "Thiếu extraData trong yêu cầu" });
  }

  let additionalData;
  try {
    // Giải mã extraData
    additionalData = JSON.parse(
      Buffer.from(extraData, "base64").toString("utf8")
    );
  } catch (err) {
    console.error("Lỗi khi giải mã extraData:", err);
    return res.status(400).json({ message: "Định dạng extraData không hợp lệ" });
  }

  const { courseId, userId } = additionalData;

  // Kiểm tra chữ ký
  const rawSignature = `accessKey=${process.env.MOMO_ACCESS_KEY}&amount=${amount}&extraData=${extraData}&message=${req.body.message}&orderId=${orderId}&orderInfo=${req.body.orderInfo}&orderType=${req.body.orderType}&partnerCode=${req.body.partnerCode}&payType=${req.body.payType}&requestId=${req.body.requestId}&responseTime=${req.body.responseTime}&resultCode=${resultCode}&transId=${req.body.transId}`;
  const generatedSignature = crypto
    .createHmac("sha256", process.env.MOMO_SECRET_KEY)
    .update(rawSignature)
    .digest("hex");

  if (generatedSignature !== signature) {
    return res.status(400).json({ message: "Chữ ký không hợp lệ" });
  }

  console.log("Dữ liệu giải mã từ MoMo:", additionalData);

  // Transaction để đảm bảo tính toàn vẹn dữ liệu
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Bước 1: Tìm khóa học
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Không tìm thấy khóa học" });
    }

    // Bước 3: Tạo bản ghi subscription
    const subscription = new Subscription({
      subscriptionStatus: "active",
      userId,
      courseId,
      price: amount,
    });
    await subscription.save({ session });

    console.log("Đã tạo đăng ký thành công");

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    const surveyUrl = `http://localhost:3000/userSubscription/${subscription._id}/survey`;

    res.status(201).json({
      message: "Thanh toán thành công. Đã tạo đăng ký và workouts.",
      subscriptionId: subscription._id,
    });
  } catch (error) {
    console.error("Lỗi transaction:", error);
    await session.abortTransaction();
    session.endSession();
    res
      .status(500)
      .json({ message: "Lỗi máy chủ nội bộ", error: error.message });
  }
};

// Xử lý khi thanh toán đăng ký thành công (redirect từ MoMo)
exports.subscriptionPaymentSuccess = async (req, res) => {
  const { orderId, resultCode, message } = req.query;
  const subscriptionId = req.query.subscriptionId; // Thêm subscriptionId vào query params

  console.log("Yêu cầu nhận được khi thanh toán đăng ký thành công");
  console.log("Mã đơn hàng:", orderId);
  console.log("Mã kết quả:", resultCode);
  console.log("Thông báo:", message);
  console.log("ID đăng ký:", subscriptionId);

  if (resultCode === "0") {
    // Cập nhật trạng thái thanh toán trong database
    try {
      await Subscription.findByIdAndUpdate(subscriptionId, {
        "paymentStatus.status": "paid",
        "paymentStatus.paidAt": new Date(),
      });

      console.log("Đã cập nhật trạng thái thanh toán thành công.");
      // Sau khi cập nhật trạng thái thanh toán thành công
      return res.redirect(
        `http://localhost:3000/subscribe/payment-success?subscriptionId=${subscriptionId}`
      );
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái thanh toán:", error);
      return res.redirect("http://localhost:3000/payment-error");
    }
  } else {
    console.log(`Giao dịch thất bại. Thông báo từ MoMo: ${message}`);
    return res.redirect("http://localhost:3000/payment-error");
  }
};
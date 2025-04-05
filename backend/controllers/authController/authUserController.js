const Account = require("../../models/account");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../../utils/sendEmail");
const { validationResult } = require("express-validator");
const validator = require("validator"); // Sử dụng để kiểm tra email


const otpStore = {}; // Temporary storage for OTPs (Use database in production)

// Gửi OTP
exports.sendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    // Kiểm tra email đã tồn tại chưa
    const existingAccount = await Account.findOne({ email });
    if (existingAccount) {
      return res.status(400).json({ msg: "Email already valid in system!" });
    }

    // Tạo OTP
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
    otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 }; // OTP valid for 5 minutes

    const subject = "Your OTP Code";
    const text = `Your OTP code is ${otp}. It is valid for 5 minutes.`;

    await sendEmail(email, subject, text); // Gửi email
    res
      .status(200)
      .json({ msg: "OTP sent successfully. Please check your email." });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res
      .status(500)
      .json({ msg: "Failed to send OTP. Please try again later." });
  }
};

// Xác thực OTP
exports.verifyOtp = (req, res) => {
  const { email, otp } = req.body;

  const storedOtp = otpStore[email];

  if (!storedOtp) {
    return res.status(400).json({ msg: "No OTP found for this email." });
  }

  if (Date.now() > storedOtp.expiresAt) {
    return res
      .status(400)
      .json({ msg: "OTP has expired. Please request a new one." });
  }

  if (parseInt(otp) !== storedOtp.otp) {
    return res.status(400).json({ msg: "Invalid OTP." });
  }

  delete otpStore[email]; // Clear OTP after successful verification
  res.status(200).json({ msg: "OTP verified successfully." });
};

// Đăng ký người dùng
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    let account = await Account.findOne({ email });

    if (account) {
      return res.status(400).json({ msg: "Account already exists" });
    }

    account = new Account({
      name,
      email,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    account.password = await bcrypt.hash(password, salt);

    await account.save();

    res.json({
      msg: "Account registered successfully, please log in.",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Đăng nhập người dùng
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Tìm account bằng email
    const account = await Account.findOne({ email });

    if (!account) {
      return res.status(400).json({ msg: "Email không đúng" });
    }

    // Kiểm tra trạng thái tài khoản
    if (account.status === "blocked") {
      return res.status(403).json({
        msg: "Tài khoản này đã bị chặn, mọi thắc mắc vui lòng liên hệ với quản trị viên để được hỗ trợ. Xin chân thành cảm ơn!!!",
      });
    }

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, account.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Mật khẩu không đúng" });
    }

    // Tạo payload cho JWT
    const payload = {
      id: account._id,
      email: account.email,
      name: account.name,
      role: account.role,
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "3h" },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          role: account.role,
          id: account._id,
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};



// Forgot Password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  console.log(">>> email: ", email);

  const user = await Account.findOne({ email: email });
  if (!user) {
    return res.send({ Status: "Not Existed" });
  }

  const token = jwt.sign({ id: user._id }, "jwt_secret_key", {
    expiresIn: "5m",
  });

  const to = email;
  const subject = "Reset Password Link";
  const text = `http://localhost:3000/resetpassword/${user._id}/${token}`;

  if (!to || !subject || !text) {
    console.log("Please provide email, subject, and content");
    return res
      .status(400)
      .json({ error: "Please provide email, subject, and content" });
  }

  try {
    await sendEmail(to, subject, text);
    return res.status(200).json({ Status: "Success" });
  } catch (error) {
    return res.status(500).json({ Status: "Error sending email" });
  }
};

exports.resetPassword = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  try {
    // Xác thực token
    jwt.verify(token, "jwt_secret_key", async (err) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res
            .status(401)
            .json({ msg: "Token đã hết hạn. Vui lòng yêu cầu liên kết mới." });
        }
        return res.status(400).json({ msg: "Token không hợp lệ." });
      }

      // Nếu token hợp lệ, tiếp tục xử lý cập nhật mật khẩu
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      await Account.findByIdAndUpdate(id, { password: hashedPassword });

      res.json({ msg: "Password updated successfully." });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Lỗi máy chủ." });
  }
};

const Account = require("../../models/account");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../../utils/sendEmail");
const { validationResult } = require("express-validator");
const validator = require("validator"); // Sử dụng để kiểm tra email


const otpStore = {}; // Lưu trữ tạm thời OTP (Sử dụng database trong môi trường production)

// Gửi OTP
exports.sendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    // Kiểm tra email đã tồn tại chưa
    const existingAccount = await Account.findOne({ email });
    if (existingAccount) {
      return res.status(400).json({ msg: "Email này đã tồn tại trong hệ thống!" });
    }

    // Tạo OTP
    const otp = Math.floor(100000 + Math.random() * 900000); // Tạo OTP gồm 6 chữ số
    otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 }; // OTP có hiệu lực trong 5 phút

    const subject = "Mã OTP của bạn";
    const text = `Mã OTP của bạn là ${otp}. Mã này có hiệu lực trong 5 phút.`;

    await sendEmail(email, subject, text); // Gửi email
    res
      .status(200)
      .json({ msg: "OTP đã được gửi thành công. Vui lòng kiểm tra email của bạn." });
  } catch (error) {
    console.error("Lỗi khi gửi OTP:", error);
    res
      .status(500)
      .json({ msg: "Không thể gửi OTP. Vui lòng thử lại sau." });
  }
};

// Xác thực OTP
exports.verifyOtp = (req, res) => {
  const { email, otp } = req.body;

  const storedOtp = otpStore[email];

  if (!storedOtp) {
    return res.status(400).json({ msg: "Không tìm thấy OTP cho email này." });
  }

  if (Date.now() > storedOtp.expiresAt) {
    return res
      .status(400)
      .json({ msg: "OTP đã hết hạn. Vui lòng yêu cầu mã mới." });
  }

  if (parseInt(otp) !== storedOtp.otp) {
    return res.status(400).json({ msg: "OTP không hợp lệ." });
  }

  delete otpStore[email]; // Xóa OTP sau khi xác thực thành công
  res.status(200).json({ msg: "OTP đã được xác thực thành công." });
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
      return res.status(400).json({ msg: "Tài khoản đã tồn tại" });
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
      msg: "Tài khoản đã được đăng ký thành công, vui lòng đăng nhập.",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Lỗi máy chủ");
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
      return res.status(400).json({ msg: "Email không chính xác" });
    }

    // Kiểm tra trạng thái tài khoản
    if (account.status === "blocked") {
      return res.status(403).json({
        msg: "Tài khoản này đã bị khóa, vui lòng liên hệ với quản trị viên để được hỗ trợ. Xin cảm ơn!",
      });
    }

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, account.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Mật khẩu không chính xác" });
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
    res.status(500).send("Lỗi máy chủ");
  }
};



// Quên mật khẩu
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  console.log(">>> email: ", email);

  const user = await Account.findOne({ email: email });
  if (!user) {
    return res.send({ Status: "Không tồn tại" });
  }

  const token = jwt.sign({ id: user._id }, "jwt_secret_key", {
    expiresIn: "5m",
  });

  const to = email;
  const subject = "Liên kết đặt lại mật khẩu";
  const text = `http://localhost:3000/resetpassword/${user._id}/${token}`;

  if (!to || !subject || !text) {
    console.log("Vui lòng cung cấp email, tiêu đề và nội dung");
    return res
      .status(400)
      .json({ error: "Vui lòng cung cấp email, tiêu đề và nội dung" });
  }

  try {
    await sendEmail(to, subject, text);
    return res.status(200).json({ Status: "Thành công" });
  } catch (error) {
    return res.status(500).json({ Status: "Lỗi khi gửi email" });
  }
};
// thay dổi mật khẩu
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

      res.json({ msg: "Mật khẩu đã được cập nhật thành công." });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Lỗi máy chủ." });
  }
};
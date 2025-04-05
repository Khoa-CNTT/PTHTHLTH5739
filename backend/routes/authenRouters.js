const express = require("express");
const router = express.Router();
const {
  login,
  register,
  forgotPassword,
  resetPassword,
  sendOtp, // Thêm route gửi OTP
  verifyOtp // Thêm route xác minh OTP
} = require("../controllers/authController/authUserController");

// Route đăng nhập
router.post("/login", login);

// Route đăng ký
router.post("/register", register);

// Route gửi OTP
router.post("/sendotp", sendOtp);

// Route xác minh OTP
router.post("/verifyotp", verifyOtp);

// Route quên mật khẩu
router.post("/forgotpassword", forgotPassword);

// Route đặt lại mật khẩu
router.post("/resetpassword/:id/:token", resetPassword);

module.exports = router;

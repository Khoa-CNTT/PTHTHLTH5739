import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignUp() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0); // Thời gian đếm ngược
  const [step, setStep] = useState(1); // Trạng thái bước
  const navigate = useNavigate();

  const validateEmailRegex = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password
    );

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError("");

    if (!validateEmailRegex(value)) {
      setEmailError("Vui lòng nhập địa chỉ email hợp lệ.");
    }
  };

  const handleNameChange = (e) => setName(e.target.value);

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (!validatePassword(value)) {
      setPasswordError("Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường, 1 sổ và 1 ký tự đặc biệt.");
    } else {
      setPasswordError("");
    }
  };

  const handleAction = async () => {
    if (step === 1) {
      // Gửi OTP
      if (!validateEmailRegex(email)) {
        toast.error("Vui lòng cung cấp email hợp lệ.");
        return;
      }
      try {
        const response = await axios.post(
          "http://localhost:4000/api/authenticate/sendotp",
          { email }
        );
        if (response && response.data) {
          toast.success(response.data.msg);
          setOtpTimer(300); // Đếm ngược 5 phút (300 giây)
          setStep(2); // Chuyển sang bước xác minh OTP
        } else {
          toast.error("Lỗi phản hồi từ máy chủ");
        }
      } catch (error) {
        const errorMessage = error.response?.data?.msg || "Không gửi được OTP.";
        toast.error(errorMessage);

        // Nếu email đã tồn tại, chuyển hướng tới forgot password
        if (
          error.response?.status === 400 &&
          errorMessage.includes("Email đã được đăng ký")
        ) {
          setTimeout(() => navigate("/forgotpassword"), 3000); // Chuyển hướng sau 3 giây
        }
      }
    } else if (step === 2) {
      // Xác minh OTP
      if (!otp) {
        toast.error("Vui lòng nhập OTP.");
        return;
      }
      try {
        const response = await axios.post(
          "http://localhost:4000/api/authenticate/verifyotp",
          { email, otp }
        );
        if (response && response.data) {
          toast.success(response.data.msg);
          setOtpVerified(true);
          setStep(3); // Chuyển sang bước đăng ký
        } else {
          toast.error("Lỗi phản hồi từ máy chủ");
        }
      } catch (error) {
        toast.error(error.response?.data?.msg || "OTP không hợp lệ.");
      }
    } else if (step === 3) {
      // Đăng ký
      if (emailError || passwordError) {
        toast.error("Vui lòng sửa lỗi trước khi gửi.");
        return;
      }
      try {
        const response = await axios.post(
          "http://localhost:4000/api/authenticate/register",
          {
            email,
            password,
            name,
          }
        );
        if (response && response.data) {
          toast.success("Tài khoản đã được đăng ký thành công! Đang chuyển hướng đến mục đăng nhập...");
          setTimeout(() => navigate("/signin"), 3000);
        } else {
          toast.error("Lỗi phản hồi máy chủ");
        }
      } catch (error) {
        toast.error(error.response?.data?.msg || "Lỗi đăng ký");
      }
    }
  };

  const handleResendOtp = async () => {
    // Gửi lại OTP
    try {
      const response = await axios.post(
        "http://localhost:4000/api/authenticate/sendotp",
        { email }
      );
      if (response && response.data) {
        toast.success(response.data.msg);
        setOtpTimer(300); // Đặt lại thời gian đếm ngược
      } else {
        toast.error("Lỗi phản hồi từ máy chủ");
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || "Lỗi khi gửi lại OTP.");
    }
  };

  // Đồng hồ đếm ngược
  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const formatTime = (timer) => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <section className="container-signin">
      <div className="container-fluid">
        <div className="row">
          <div className="text-black">
            <div className="d-flex justify-content-center align-items-center">
              <form style={{ width: "23rem" }}>
                <h3 className="fw-normal mb-3 pb-3 title-singin">Đăng ký</h3>

                {/* Email Input */}
                {step === 1 && (
                  <div className="form-outline mb-4">
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      placeholder="Email"
                      value={email}
                      onChange={handleEmailChange}
                      required
                    />
                    {emailError && (
                      <div className="text-danger">{emailError}</div>
                    )}
                  </div>
                )}

                {/* OTP Input */}
                {step === 2 && (
                  <div className="form-outline mb-4">
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Nhập OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                    {otpTimer > 0 ? (
                      <small>Thời gian còn lại: {formatTime(otpTimer)}</small>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-link"
                        onClick={handleResendOtp}
                      >
                        Gửi lại OTP
                      </button>
                    )}
                  </div>
                )}

                {/* Name and Password Inputs */}
                {step === 3 && (
                  <>
                    <div className="form-outline mb-4">
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="Name"
                        value={name}
                        onChange={handleNameChange}
                        required
                      />
                    </div>
                    <div className="form-outline mb-4">
                      <input
                        type="password"
                        className="form-control form-control-lg"
                        placeholder="Password"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                      />
                      {passwordError && (
                        <div className="text-danger">{passwordError}</div>
                      )}
                    </div>
                  </>
                )}

                {/* Dynamic Button */}
                <div className="pt-1 mb-4">
                  <button
                    className="gradient-button"
                    type="button"
                    onClick={handleAction}
                  >
                    {step === 1
                      ? "Gửi OTP"
                      : step === 2
                      ? "Xác minh OTP"
                      : "Đăng ký"}
                  </button>
                </div>

                <p>
                Bạn đã có tài khoản?{" "}
                  <Link to="/signin" className="link-info">
                    Đăng nhập
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover/>
    </section>
  );
}

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./SignIn.css";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isShow, setIsShow] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Role-based navigation function
  const handleNavigation = (role, name, id) => {
    localStorage.setItem("role", role);
    localStorage.setItem("name", name);

    if (role === "admin") {
      navigate("/admin/user");
    } else if (role === "coach") {
      navigate("/coach");
    } else {
      navigate("/");
    }
  };


  // Handle normal email/password login
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4000/api/authenticate/login",
        { email, password }
      );
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("accountId", response.data.id);
      // Gọi hàm điều hướng dựa trên vai trò
      handleNavigation(
        response.data.role,
        response.data.name,
        response.data.id
      );
      toast.success("Đăng nhập thành công")
    } catch (error) {
      const errorMsg =
        error.response && error.response.data && error.response.data.msg
          ? error.response.data.msg
          : "Error logging in";
      setErrorMessage(errorMsg); // Chỉ cập nhật thông báo vào state
      toast.error("Đăng nhập thất bại")
    }
  };

  return (
    <section className="container-signin">
      <div className="container-fluid">
        <div className="row">
          <div className="text-black">
            <div className="d-flex justify-content-center align-items-center">
              <form style={{ width: "20rem" }} onSubmit={handleSubmit}>
                <h3 className="fw-normal mb-3 title-singin">Đăng nhập</h3>
                <div class="crossbar mb-3"></div>
                <div class="login-message">
                  <p class="welcome-text">
                  Chào mừng trở lại! Đăng nhập để vào GYM.
                  </p>
                  <p class="forgot-password">
                    Bạn{" "}
                    <a href="/forgotpassword" class="link">
                      quên mật khẩu?
                    </a>
                  </p>
                </div>

                <div className="form-outline mb-4">
                  <input
                    type="email"
                    className="form-control form-control-lg"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="relative form-outline mb-4">
                  <input
                    type={isShow ? "text" : "password"}
                    className="form-control form-control-lg w-full pr-10"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center px-1 mb-1"
                    onClick={() => setIsShow(!isShow)}
                  >
                    {isShow ? <EyeInvisibleOutlined style={{ fontSize: 20 }} /> : <EyeOutlined style={{ fontSize: 20 }} />}
                  </button>
                </div>

                <div className="pt-1 mb-4">
                  <button type="submit" class="gradient-button">
                    <span class="button-icon">➜</span> Tiếp tục
                  </button>
                </div>

                {errorMessage && (
                  <div className="alert alert-danger mt-2">{errorMessage}</div>
                )}

                <p className="text-black">
                  Bạn không có tài khoản?{" "}
                  <Link to="/signup" className="link-info">
                    Đăng ký ngay
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

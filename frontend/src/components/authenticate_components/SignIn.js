import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./SignIn.css";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  // Handle successful Google login
  const onSuccess = async (response) => {
    const credential = response.credential;
    const decoded = jwtDecode(credential);

    const { email, name, sub: googleId } = decoded;

    try {
      const res = await axios.post(
        "http://localhost:4000/api/authenticate/googleLogin",
        { email, name, googleId }
      );
      toast.success(res.data.msg);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.id);
      localStorage.setItem("accountId", res.data.id);
      console.log("accountId", res.data.id);

      // Call the role-based navigation function
      handleNavigation(res.data.role);
    } catch (error) {
      const errorMsg =
        error.response && error.response.data && error.response.data.msg
          ? error.response.data.msg
          : "Error logging in with Google";
      toast.error(errorMsg);
      setErrorMessage(errorMsg);
    }
  };

  // Handle failed Google login
  const onFailure = (error) => {
    console.log("[Login Failed]", error);
    toast.error("Google login failed.");
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
      localStorage.setItem("userId", response.data.id);
      localStorage.setItem("accountId", response.data.id);
      // Call the role-based navigation function
      handleNavigation(
        response.data.role,
        response.data.name,
        response.data.id
      );
    } catch (error) {
      const errorMsg =
        error.response && error.response.data && error.response.data.msg
          ? error.response.data.msg
          : "Error logging in";
      setErrorMessage(errorMsg); // Chỉ cập nhật thông báo vào state
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
                {/* <p className="small mb-5 pb-lg-2">
                  <Link to="/forgotpassword" className="text-muted">
                    Forgot password?
                  </Link>
                </p> */}

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

                <div className="form-outline mb-4">
                  <input
                    type="password"
                    className="form-control form-control-lg"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="pt-1 mb-4">
                  <button type="submit" class="gradient-button">
                    <span class="button-icon">➜</span> tiếp tục
                  </button>
                </div>

                {errorMessage && (
                  <div className="alert alert-danger mt-2">{errorMessage}</div>
                )}

                {/* {errorMessage && (
                  <div className="alert alert-danger">{errorMessage}</div>
                )} */}

                <p>
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
      <ToastContainer />
    </section>
  );
}

import { Link } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true); // State for email validity

  axios.defaults.withCredentials = true;

  const handleEmailChange = (e) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(inputEmail));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isEmailValid) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    axios
      .post("http://localhost:4000/api/authenticate/forgotpassword", { email })
      .then((res) => {
        setLoading(false);
        if (res.data.Status === "Not Existed") {
          toast.error("Not Existed Email In System.");
        } else if (res.data.Status === "Success") {
          setMessage("Check your email for further instructions.");
          toast.success("Email sent successfully!");
        } else {
          setMessage("An error occurred. Please try again.");
          toast.error("An error occurred. Please try again.");
        }
      })
      .catch((err) => {
        setLoading(false);
        setMessage("An error occurred. Please try again.");
        toast.error("An error occurred. Please try again.");
        console.log(err);
      });
  };

  return (
    <section className="" style={{ margin: "50px" }}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        draggable
        pauseOnHover
      />
      <div className="container-fluid">
        <div className="row">
          <div className="text-black">
            <div className="d-flex justify-content-center align-items-center">
              <form style={{ width: "23rem" }} onSubmit={handleSubmit}>
                <h3
                  className="fw-normal mb-3 pb-3"
                  style={{ letterSpacing: "1px" }}
                >
                  Quên mật khẩu
                </h3>
                {message && <div className="alert alert-info">{message}</div>}

                <div className="form-outline mb-4">
                  <input
                    type="email"
                    placeholder="Email"
                    autoComplete="off"
                    className={`form-control form-control-lg ${
                      !isEmailValid && email ? "is-invalid" : ""
                    }`}
                    onChange={handleEmailChange} // Updated to handleEmailChange
                    value={email}
                    required
                  />
                  {/* Display invalid email message */}
                  {!isEmailValid && email && (
                    <div className="invalid-feedback">
                      Vui lòng nhập địa chỉ email hợp lệ.
                    </div>
                  )}
                </div>

                <div className="pt-1 mb-4">
                  <button
                    className="btn btn-success btn-lg btn-block"
                    type="submit"
                    disabled={loading || !isEmailValid}
                  >
                    {loading ? "Sending..." : "Send"}
                  </button>
                </div>

                <div className="text-center">
                  <Link to="/signin" className="text-decoration-none">
                    Quay lại đăng nhập
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

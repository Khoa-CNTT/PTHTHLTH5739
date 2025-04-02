import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const navigate = useNavigate();
  const { id, token } = useParams();

  axios.defaults.withCredentials = true;

  // Password validation function
  const validatePassword = (password) => {
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordPattern.test(password);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isPasswordValid) {
      setMessage(
        "Password must be at least 8 characters long, include at least one lowercase letter, one uppercase letter, and one special character."
      );
      return;
    }

    setLoading(true);
    axios
      .post(
        `http://localhost:4000/api/authenticate/resetpassword/${id}/${token}`,
        { password }
      )
      .then((res) => {
        setLoading(false);
        toast.success("Password updated successfully. Redirecting to login...");
        setTimeout(() => navigate("/signin"), 3000);
      })
      .catch((err) => {
        setLoading(false);

        if (err.response && err.response.status === 401) {
          // Token hết hạn, chuyển đến trang forgotpassword
          toast.error("Token has expired. Redirecting to forgot password...");
          setTimeout(() => navigate("/forgotpassword"), 3000);
        } else {
          setMessage("An error occurred. Please try again.");
          toast.error("An error occurred. Please try again.");
        }
        console.error(err);
      });
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setIsPasswordValid(validatePassword(newPassword));
  };

  return (
    <section style={{ margin: "50px" }}>
      <div className="container-fluid">
        <div className="row">
          <div className="text-black">
            <div className="d-flex justify-content-center align-items-center">
              <form style={{ width: "23rem" }} onSubmit={handleSubmit}>
                <h3
                  className="fw-normal mb-3 pb-3"
                  style={{ letterSpacing: "1px" }}
                >
                  Reset Password
                </h3>

                {message && <div className="alert alert-info">{message}</div>}

                <div className="form-outline mb-4">
                  <input
                    type="password"
                    placeholder="Enter New Password"
                    autoComplete="off"
                    name="password"
                    className={`form-control form-control-lg ${
                      password
                        ? isPasswordValid
                          ? "is-valid"
                          : "is-invalid"
                        : ""
                    }`}
                    onChange={handlePasswordChange}
                    value={password}
                    required
                  />
                  {!isPasswordValid && password && (
                    <div className="invalid-feedback">
                      Password must be at least 8 characters long, including at
                      least one lowercase letter, one uppercase letter, and one
                      special character.
                    </div>
                  )}
                </div>

                <div className="pt-1 mb-4">
                  <button
                    type="submit"
                    className="btn btn-success btn-lg btn-block"
                    disabled={loading || !isPasswordValid}
                  >
                    {loading ? "Updating..." : "Update"}
                  </button>
                </div>

                <div className="mt-3 text-center">
                  <Link to="/signin" className="text-decoration-none">
                    Back to Login
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        draggable
        pauseOnHover
      />
    </section>
  );
}

export default ResetPassword;

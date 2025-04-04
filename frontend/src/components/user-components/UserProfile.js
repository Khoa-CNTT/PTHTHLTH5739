import React, { useState, useEffect } from "react";
import axios from "axios";
import { fetchUserProfile } from "../../services/userService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./UserProfile.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { colors } from "@mui/material";

const UserProfile = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hasPassword, setHasPassword] = useState(true);
  const [isEditing, setIsEditing] = useState(true);

  const handleEditProfileClick = () => {
    setIsEditing(!isEditing);
  };

  // Get profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await fetchUserProfile();
        setLoading(false);
        setProfile(data);
        setName(data.name);
        setEmail(data.email);
        setGender(data.gender);
        setDob(data.dob);
        setPhone(data.phone);
        setAddress(data.address);
        setHasPassword(data.password);
      } catch (error) {
        setError(error.message);
        setLoading(false);
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  // Edit profile
  const handleEditProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        "http://localhost:4000/api/users/editUserProfile",
        { name, email, gender, dob, phone, address },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  // Change password
  const handleChangePassWord = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:4000/api/users/changePassword",
        {
          currentPassword: hasPassword ? currentPassword : "",
          newPassword: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword(""); // Reset confirm password
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Error: " + error.message);
    }
  };

  if (loading)
    return (
      <div id="preloder">
        <div className="loader"></div>
      </div>
    );
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="main-content">
      <ToastContainer /> {/* Toast container for notifications */}
      <div className="container mt-5">
        <div className="row">
          <div className="col-lg-4 mb-4">
            <div className="card shadow">
              <div className="card-body text-center">
                <div className="profile-info">
                  <img
                    src="https://static.vecteezy.com/system/resources/thumbnails/025/337/669/small_2x/default-male-avatar-profile-icon-social-media-chatting-online-user-free-vector.jpg"
                    className="rounded-circle mb-3"
                    alt="Profile"
                    style={{ width: "150px" }}
                  />
                  <h5 className="card-title">{profile && profile.name}</h5>
                </div>
                <div className="online-indicator">
                  <p className="card-text">
                    <small className="text">
                    <span className="pulsating-dot"></span> <p>Online</p>
                      
                    </small>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="card shadow mt-4">
              <div className="card-body">
                <h5 className="card-title">Thay đổi mật khẩu</h5>
                
                <form >
                  {hasPassword && (
                    <div className="form-group mt-6 password-input">
                      <h6 htmlFor="input-curr-pass">Mật khẩu hiện tại</h6>
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        id="input-curr-pass"
                        className="form-control"
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                      <span
                        className="password-toggle mt-2"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                      <FontAwesomeIcon icon={showCurrentPassword ? faEye : faEyeSlash} />

                      </span>
                    </div>
                  )}
                  <div className="form-group password-input">
                    <h6 htmlFor="input-new-pass">Mật khẩu mới</h6>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      id="input-new-pass"
                      className="form-control"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <span
                      className="password-toggle mt-2"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      <FontAwesomeIcon icon={showNewPassword ? faEye : faEyeSlash} />
                    </span>
                  </div>
                  <div className="form-group password-input">
                    <h6 htmlFor="input-confirm-pass">Nhập lại mật khẩu</h6>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="input-confirm-pass"
                      className="form-control"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <span
                      className="password-toggle mt-2"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                       <FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} />
                    </span>
                  </div>
                  <button type="submit" className="btn btn-info btn-block">
                    Lưu
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="card shadow" style={{ backgroundColor: "#121212" }}>
              <div className="card-header">
                <div className="d-flex justify-content-between align-items-center">
                  <h3 className="mb-0">Hồ sơ cá nhân</h3>
                  <button
                    className={`btn ${isEditing ? "btn-primary" : "btn-danger"
                      }`}
                    onClick={handleEditProfileClick}
                  >
                    {isEditing ? "Chỉnh sửa" : "Hủy"}
                  </button>
                </div>
              </div>
              <div className="card-body">
              {/* onSubmit={handleEditProfile} */}
                <form >
                  <div className="form-group">
                    <h5 htmlFor="input-email">Email</h5>
                    <input
                      type="email"
                      id="input-email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      readOnly={true}
                    />
                  </div>
                  <div className="form-group">
                    <h5 htmlFor="input-fullname">Họ và Tên</h5>
                    <input
                      type="text"
                      id="input-fullname"
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      readOnly={isEditing}
                    />
                  </div>
                  <div className="form-group">
                    <h5 htmlFor="input-gender">Giới tính</h5>
                    <select
                      id="input-gender"
                      className="form-control"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      disabled={isEditing}
                    >
                      <option value="">Lựa chọn giới tính</option>
                      <option value="Male">Nam</option>
                      <option value="Female">Nữ</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <h5 htmlFor="input-dob">Ngày sinh</h5>
                    <input
                      type="date"
                      id="input-dob"
                      className="form-control"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      readOnly={isEditing}
                    />
                  </div>
                  <div className="form-group">
                    <h5 htmlFor="input-phone">SĐT</h5>
                    <input
                      type="text"
                      id="input-phone"
                      className="form-control"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      readOnly={isEditing}
                    />
                  </div>
                  <div className="form-group">
                    <h5 htmlFor="input-address">Địa chỉ</h5>
                    <textarea
                      id="input-address"
                      className="form-control"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      readOnly={isEditing}
                    />
                  </div>

                  {!isEditing && (
                    <button type="submit" className="btn btn-success btn-block">
                      Lưu
                    </button>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

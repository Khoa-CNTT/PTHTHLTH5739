import React, { useState, useEffect } from "react";
import axios from "axios";
import { fetchCoachProfile } from "../../services/coachService";
import { toast, ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import "react-quill/dist/quill.snow.css";
import "react-toastify/dist/ReactToastify.css";
import "./CoachProfile.css";

const CoachProfile = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState(""); // State cho URL ảnh đại diện
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hasPassword, setHasPassword] = useState(true);
  const [isEditing, setIsEditing] = useState(true);
  const [contract, setContract] = useState("");
  const [certificate, setCertificate] = useState([""]);

  const [experience, setExperience] = useState([{ time: "", workplace: "" }]);
  const [introduce, setIntroduce] = useState("");
  const [selfImage, setSelfImage] = useState([""]);

  // State để theo dõi trạng thái hiển thị mật khẩu (dùng cho checkbox)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await fetchCoachProfile();
        setLoading(false);
        setProfile(data);

        setName(data.name);
        setEmail(data.email);
        setGender(data.gender);
        setDob(data.dob);
        setPhone(data.phone);
        setAddress(data.address);
        setAvatar(data.avatar);

        if (data.coachInfo) {
          setExperience(
            data.coachInfo.experience || [{ time: "", workplace: "" }]
          );
          setIntroduce(data.coachInfo.introduce || "");
          setSelfImage(data.coachInfo.selfImage || [""]);
          setContract(data.coachInfo.contract || "");
          setCertificate(data.coachInfo.certificate || [""]);
        }
      } catch (error) {
        setError(error.message);
        setLoading(false);
        console.error("Lỗi khi tải hồ sơ:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleEditProfile = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        "http://localhost:4000/api/coaches/editCoachProfile",
        {
          name,
          email,
          gender,
          dob,
          phone,
          address,
          avatar,
          experience,
          introduce,
          selfImage,
          contract,
          certificate,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Hồ sơ đã được cập nhật thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật hồ sơ:", error);
      toast.error("Lỗi: Không thể cập nhật hồ sơ.");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu mới không khớp.");
      return;
    }

    try {
      await axios.put(
        "http://localhost:4000/api/users/changePassword",
        {
          currentPassword: hasPassword ? currentPassword : "",
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Mật khẩu đã được thay đổi thành công!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Lỗi khi thay đổi mật khẩu:", error);
      toast.error("Lỗi: " + error.message);
    }
  };

  const handleEditExperience = async () => {
    try {
      await axios.put(
        "http://localhost:4000/api/coaches/editCoachProfile",
        {
          experience,
          introduce,
          contract,
          certificate,
          selfImage,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Kinh nghiệm đã được cập nhật thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật kinh nghiệm:", error);
      toast.error("Lỗi: Không thể cập nhật kinh nghiệm.");
    }
  };

  const handleExperienceChange = (index, field, value) => {
    const updatedExperience = [...experience];
    updatedExperience[index][field] = value;
    setExperience(updatedExperience);
  };

  const handleAddExperience = () => {
    setExperience([...experience, { time: "", workplace: "" }]);
  };

  const handleRemoveExperience = (index) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa kinh nghiệm này?")) {
      const updatedExperience = experience.filter((_, i) => i !== index);
      setExperience(updatedExperience);
    }
  };

  const handleSelfImageChange = (index, value) => {
    const updatedSelfImage = [...selfImage];
    updatedSelfImage[index] = value;
    setSelfImage(updatedSelfImage);
  };

  const handleAddSelfImage = () => {
    setSelfImage([...selfImage, ""]);
  };

  const handleRemoveSelfImage = (index) => {
    const updatedSelfImage = selfImage.filter((_, i) => i !== index);
    setSelfImage(updatedSelfImage);
  };

  const handleCertificateChange = (index, value) => {
    const updatedCertificates = [...certificate];
    updatedCertificates[index] = value;
    setCertificate(updatedCertificates);
  };

  const handleAddCertificate = () => {
    setCertificate([...certificate, ""]);
  };

  const handleRemoveCertificate = (index) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa chứng chỉ này?")) {
      const updatedCertificates = certificate.filter((_, i) => i !== index);
      setCertificate(updatedCertificates);
    }
  };

  // Hàm để chuyển đổi trạng thái hiển thị mật khẩu (cho checkbox)
  const toggleShowPassword = (type) => {
    switch (type) {
      case "current":
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case "new":
        setShowNewPassword(!showNewPassword);
        break;
      case "confirm":
        setShowConfirmPassword(!showConfirmPassword);
        break;
      default:
        break;
    }
  };

  if (loading)
    return (
      <div id="preloder">
        <div className="loader"></div>
      </div>
    );
  if (error) return <div>Lỗi: {error}</div>;

  return (
    <div className=" mt-5">
      <div className="row">
        <div className="col-12 col-md-4 mb-4">
          <div className="card shadow">
            <div className="card-body text-center">
              <img
                src={avatar || "https://via.placeholder.com/150"}
                className="rounded-circle mb-3"
                alt="Profile"
                style={{ maxWidth: "100%", height: "auto" }}
              />
              {isEditing && (
                <div className="form-group">
                  <label htmlFor="avatarInput">URL Ảnh Đại Diện</label>
                  <input
                    type="text"
                    id="avatarInput"
                    className="form-control"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                  />
                </div>
              )}
              <h5 className="card-title">{profile && profile.name}</h5>
            </div>
          </div>
          {/* Thay đổi mật khẩu */}
          <div className="card shadow mt-4">
            <div className="card-body">
              <h5 className="card-title">Thay đổi mật khẩu</h5>
              <form onSubmit={handleChangePassword}>
                {hasPassword && (
                  <div className="form-group">
                    <label>Mật khẩu hiện tại</label>
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      className="form-control"
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <div className="form-check mt-2">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="showCurrentPassword"
                        checked={showCurrentPassword}
                        onChange={() => toggleShowPassword("current")}
                      />
                      <label className="form-check-label" htmlFor="showCurrentPassword">Hiển thị mật khẩu</label>
                    </div>
                  </div>
                )}
                <div className="form-group">
                  <label>Mật khẩu mới</label>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    className="form-control"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <div className="form-check mt-2">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="showNewPassword"
                      checked={showNewPassword}
                      onChange={() => toggleShowPassword("new")}
                    />
                    <label className="form-check-label" htmlFor="showNewPassword">Hiển thị mật khẩu</label>
                  </div>
                </div>
                <div className="form-group">
                  <label>Xác nhận mật khẩu mới</label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="form-control"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <div className="form-check mt-2">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="showConfirmPassword"
                      checked={showConfirmPassword}
                      onChange={() => toggleShowPassword("confirm")}
                    />
                    <label className="form-check-label" htmlFor="showConfirmPassword">Hiển thị mật khẩu</label>
                  </div>
                </div>
                <button type="submit" className="btn btn-info btn-block">
                  Lưu
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-8">
          {/* Tabs Navigation */}
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <a
                className={`nav-link ${activeTab === "profile" ? "active" : ""}`}
                href="#profile"
                onClick={() => handleTabClick("profile")}
              >
                Chỉnh sửa hồ sơ
              </a>
            </li>
            <li className="nav-item d-flex align-items-center">
              <a
                className={`nav-link ${activeTab === "experience" ? "active" : ""}`}
                href="#experience"
                onClick={() => handleTabClick("experience")}
              >
                Chỉnh sửa kinh nghiệm
              </a>
            </li>
          </ul>

          <div className="tab-content">
            {/* Edit Profile Tab */}
            {activeTab === "profile" && (
              <div className="tab-pane fade show active" id="profile">
                <div className="card shadow mt-3">
                  <div className="card-body">
                    <form onSubmit={handleEditProfile}>
                      <div className="form-group">
                        <label>Email</label>
                        <input
                          type="email"
                          className="form-control"
                          value={email}
                          readOnly
                        />
                      </div>
                      <div className="form-group">
                        <label>Họ và tên</label>
                        <input
                          type="text"
                          className="form-control"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          readOnly={!isEditing}
                        />
                      </div>
                      <div className="form-group">
                        <label>Giới tính</label>
                        <input
                          type="text"
                          className="form-control"
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          readOnly={!isEditing}
                        />
                      </div>
                      <div className="form-group">
                        <label>Ngày sinh</label>
                        <input
                          type="date"
                          className="form-control"
                          value={dob}
                          onChange={(e) => setDob(e.target.value)}
                          readOnly={!isEditing}
                        />
                      </div>
                      <div className="form-group">
                        <label>SĐT</label>
                        <input
                          type="number"
                          className="form-control"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          readOnly={!isEditing}
                        />
                      </div>
                      <div className="form-group">
                        <label>Địa chỉ</label>
                        <input
                          type="text"
                          className="form-control"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          readOnly={!isEditing}
                        />
                      </div>
                      <button
                        type="submit"
                        className="btn btn-info btn-block"
                      >
                        Lưu
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Experience Tab */}
            {activeTab === "experience" && (
              <div className="tab-pane fade show active" id="experience">
                <div className="card shadow mt-3">
                  <div className="card-body">
                    <div className="form-group">
                      <label>Giới thiệu</label>
                      {isEditing ? (
                        <textarea
                          className="form-control"
                          value={introduce}
                          onChange={(e) => setIntroduce(e.target.value)}
                          rows="5"
                        />
                      ) : (
                        <div
                          className="form-control"
                          style={{ whiteSpace: "pre-wrap" }}
                          dangerouslySetInnerHTML={{ __html: introduce }}
                        />
                      )}
                    </div>
                    <div className="form-group">
                      <label>Kinh nghiệm</label>
                      {experience.map((exp, index) => (
                        <div key={index} className="mb-2">
                          <div className="row">
                            <div className="col-md-5">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Thời gian" value={exp.time}
                                onChange={(e) =>
                                  handleExperienceChange(index, "time", e.target.value)
                                }
                                readOnly={!isEditing}
                              />
                            </div>
                            <div className="col-md-5">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Nơi làm việc"
                                value={exp.workplace}
                                onChange={(e) =>
                                  handleExperienceChange(index, "workplace", e.target.value)
                                }
                                readOnly={!isEditing}
                              />
                            </div>
                            {isEditing && (
                              <div className="col-md-2 d-flex align-items-center justify-content-end">
                                <button
                                  type="button"
                                  className="btn btn-danger btn-sm"
                                  onClick={() => handleRemoveExperience(index)}
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      {isEditing && (
                        <button
                          type="button"
                          className="btn btn-success btn-sm mt-2"
                          onClick={handleAddExperience}
                        >
                          <FontAwesomeIcon icon={faPlus} /> Thêm kinh nghiệm
                        </button>
                      )}
                      <div className="form-group mt-3">
                        <label>Ảnh bản thân</label>
                        {selfImage.map((img, index) => (
                          <div key={index} className="mb-2">
                            <div className="row align-items-center">
                              <div className="col-md-10">
                                <input
                                  type="text"
                                  className="form-control"
                                  value={img}
                                  onChange={(e) => handleSelfImageChange(index, e.target.value)}
                                  readOnly={!isEditing}
                                />
                              </div>
                              {isEditing && (
                                <div className="col-md-2 d-flex align-items-center justify-content-end">
                                  <button
                                    type="button"
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleRemoveSelfImage(index)}
                                  >
                                    <FontAwesomeIcon icon={faTrash} />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                        {isEditing && (
                          <button
                            type="button"
                            className="btn btn-success btn-sm mt-2"
                            onClick={handleAddSelfImage}
                          >
                            <FontAwesomeIcon icon={faPlus} /> Thêm ảnh
                          </button>
                        )}
                        <div className="form-group mt-3">
                          <label>Chứng chỉ</label>
                          {certificate.map((cert, index) => (
                            <div key={index} className="mb-2">
                              <div className="row align-items-center">
                                <div className="col-md-10">
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={cert}
                                    onChange={(e) => handleCertificateChange(index, e.target.value)}
                                    readOnly={!isEditing}
                                  />
                                </div>
                                {isEditing && (
                                  <div className="col-md-2 d-flex align-items-center justify-content-end">
                                    <button
                                      type="button"
                                      className="btn btn-danger btn-sm"
                                      onClick={() => handleRemoveCertificate(index)}
                                    >
                                      <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                          {isEditing && (
                            <button
                              type="button"
                              className="btn btn-success btn-sm mt-2"
                              onClick={handleAddCertificate}
                            >
                              <FontAwesomeIcon icon={faPlus} /> Thêm chứng chỉ
                            </button>
                          )}
                          {isEditing && (
                            <button type="button" className="btn btn-info btn-block mt-3" onClick={handleEditExperience}>
                              Lưu kinh nghiệm
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )};
            </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default CoachProfile;
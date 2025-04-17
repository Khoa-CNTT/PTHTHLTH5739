import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import WcIcon from "@mui/icons-material/Wc";
import DateRangeIcon from "@mui/icons-material/DateRange";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CoachDetailSlideShow from "../user-components/coach/Coach-Slideshow-Image";
import "./CoachesDetail.css";

const CoachDetails = () => {
  const { id } = useParams();
  const [coach, setCoach] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCoach = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/coaches/coachList/${id}`
        );
        setCoach(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCoach();
  }, [id]);

  if (loading) return <p className="loading-text">Đang tải thông tin HLV...</p>;
  if (error) return <p className="error-text">Lỗi: {error}</p>;
  if (!coach) return <p className="not-found-text">Không tìm thấy HLV</p>;

  const { accountId, introduce, experience, certificate, selfImage } = coach || {};
  const { name, gender, dob, address, avatar, phone } = accountId || {};

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleBack = () => {
    navigate("/coach-details");
  };

  const getImageSrc = (imageName) => {
    try {
      return require(`../../assets/avatar/${imageName}`);
    } catch (err) {
      return imageName;
    }
  }; 

  return (
    <div className="coach-detail-page">
      <button className="btn-back" onClick={handleBack}>
        &larr; Trở lại
      </button>

      {accountId ? (
        <div className="coach-detail-wrapper">
          <div className="coach-info-column">
            <div className="coach-image-wrapper text-center">
              <img src={getImageSrc(avatar)} alt={name} className="coach-avatar-detail" />
            </div>
            <div className="personal-info">
              <h3 className="info-title">Thông tin cá nhân</h3>
              <p><AssignmentIndIcon className="info-icon" />{name}</p>
              <p><WcIcon className="info-icon" />{gender ? "Nam" : "Nữ"}</p>
              <p><DateRangeIcon className="info-icon" />{dob ? calculateAge(dob) + " tuổi" : "N/A"}</p>
              <p><LocalPhoneIcon className="info-icon" />{phone || "N/A"}</p>
              <p><LocationOnIcon className="info-icon" />{address || "N/A"}</p>
            </div>
          </div>

          <div className="coach-profile-column">
            <h1 className="profile-title">Hồ sơ của {name}</h1>

            <div className="coach-introduction-section">
              <h3 className="section-title">Giới thiệu</h3>
              <ReactQuill
                className="quill-viewer"
                value={introduce || ""}
                readOnly={true}
                theme="bubble"
              />
            </div>

            <div className="coach-experience-section">
              <h3 className="section-title">Kinh nghiệm</h3>
              {experience?.length ? (
                <ul className="experience-list">
                  {experience.map((exp, index) => (
                    <li key={index} className="experience-item">
                      <span className="time">{exp.time}</span> - <span className="workplace">{exp.workplace}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-info">Chưa có kinh nghiệm làm việc.</p>
              )}
            </div>

            <div className="coach-certificates-section">
              <h3 className="section-title">Chứng chỉ</h3>
              <div className="certificate-image-wrapper">
                {coach.certificate && coach.certificate.length > 0 ? (
                  <img src={coach.certificate} alt="Chứng chỉ" className="certificate-image" />
                ) : (
                  <p className="no-info">Chưa có chứng chỉ.</p>
                )}
              </div>
            </div>

            <div className="coach-self-images-section">
              <h3 className="section-title">Hình ảnh cá nhân</h3>
              <div className="self-images-wrapper">
                {coach.selfImage && coach.selfImage.length > 0 ? (
                  <img src={coach.selfImage} alt="Hình ảnh cá nhân" className="self-image" />
                ) : (
                  <p className="no-info">Chưa có hình ảnh cá nhân.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="no-info">Không có thông tin tài khoản.</p>
      )}
    </div>
  );
};

export default CoachDetails;
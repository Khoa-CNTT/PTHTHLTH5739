import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./CoachesList.css";
import { Col, Row } from "react-bootstrap";
import { color } from "chart.js/helpers";
import { toast, ToastContainer } from "react-toastify";

const CoachesList = () => {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/coaches/coachList"
        );
        setCoaches(response.data);
      } catch (err) {
        setError(err.message);
        toast.error("Lỗi khi tải HLV")
      } finally {
        setLoading(false);
      }
    };

    fetchCoaches();
  }, []);

  if (loading) return <p>Đang tải HLV...</p>;
  if (error) return <p>Lỗi: {error}</p>;

  const getImageSrc = (imageName) => {
    try {
      return require(`../../assets/avatar/${imageName}`);
    } catch (err) {
      return imageName;
    }
  };

  return (
    <div className="container-full trainers-page">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <div className="coaches-list">
        <h1 className="courses-title">Đội ngũ huấn luyện viên</h1>
        <Row className="coaches-container justify-content-center"> {/* Center the rows */}
          {coaches.map((coach) => (
            <Col key={coach._id} md={4} sm={6} xs={12} className="coach-item">
              <div className="coach-card mb-3 mt-3">
                <div className="coach-img-container">
                  <div className="avatar-wrapper"> {/* Wrapper for centering avatar */}
                    <img
                      src={getImageSrc(coach.accountId?.avatar)}
                      alt={`${coach.accountId?.name || "Unknown Coach"}'s profile`}
                      className="rounded-circle shadow-md border-4 border-orange-500"
                      style={{ width: '300px', height: '300px', objectFit: 'cover' }}
                    />
                  </div>
                </div>
                <h2 className=" text-center"> {/* Center the name */}
                  {coach.accountId?.name || "Unknown Coach"}
                </h2>
                <p className="coach-specialization text-center"> {/* Center the specialization */}
                  <h6 className="text-black">HLV Gym</h6>
                </p>
                <div className="details-button-wrapper"> {/* Wrapper for centering button */}
                  <Link to={`/coach/${coach._id}`} className="coach-details-link">
                    <button className="btn view-btn-coach" style={{ color: "black", backgroundColor: "#e67e22" }}>Xem chi tiết</button>
                  </Link>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default CoachesList;
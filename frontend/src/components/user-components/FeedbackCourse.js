import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  faReply,
  faEdit,
  faTrashAlt,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import "./FeedbackCourse.css";

const FeedbackCourse = ({ courseId, purchasedSubscriptions }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [newFeedback, setNewFeedback] = useState("");
  const [visibleFeedbacksCount, setVisibleFeedbacksCount] = useState(0);
  const [replyFeedbackId, setReplyFeedbackId] = useState(null);
  const [rating, setRating] = useState(0);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [editingRating, setEditingRating] = useState(0);
  const [ratings, setRatings] = useState({ totalVotes: 0, averageRating: 0 });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // State cho thông báo thành công
  const [loading, setLoading] = useState(false);
  const [feedbackImages, setFeedbackImages] = useState([]);
  const [feedbackVideos, setFeedbackVideos] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null); // State để lưu ID của người dùng hiện tại

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      fetchFeedbacks();
      fetchCurrentUserId(token); // Lấy ID người dùng khi đăng nhập
    } else {
      setIsLoggedIn(false);
    }
    fetchFeedbacks();
    fetchCourseRatings();
  }, [courseId]);

  // API: Lấy ID của người dùng hiện tại
  const fetchCurrentUserId = async (token) => {
    try {
      const response = await axios.get("http://localhost:4000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Response from /api/users/me:", response.data);
      setCurrentUserId(response.data._id);
    } catch (error) {
      console.error("Lỗi khi lấy ID người dùng hiện tại:", error);
      toast.error("Không thể lấy thông tin người dùng");
      setError("Không thể lấy thông tin người dùng.");
    }
  };

  // API: Lấy danh sách feedback
  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/users/courses/${courseId}/feedbacks`
      );
      setFeedbacks(response.data);
      const visibleFeedbacks = response.data.filter(feedback => !feedback.isHidden);
      setVisibleFeedbacksCount(visibleFeedbacks.length);
    } catch (error) {
      console.error("Lỗi khi lấy phản hồi:", error);
      toast.error("Lỗi khi lấy phản hồi");
      setError("Không thể tải phản hồi.");
    }
  };

  // API: Lấy đánh giá trung bình
  const fetchCourseRatings = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/users/courses/${courseId}/rating`
      );
      setRatings(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy đánh giá:", error);
      toast.error("Không thể tải đánh giá");
      setError("Không thể tải đánh giá.");
    }
  };

  // API: Thêm feedback
  const addFeedback = async () => {
    if (!newFeedback.trim()) {
      toast.error("Vui lòng viết bình luận.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const formData = new FormData();
      formData.append("content", newFeedback);
      formData.append("rating", rating || null);

      feedbackImages.length > 0 && Array.from(feedbackImages).forEach((image) =>
        formData.append("image", image)
      );
      feedbackVideos.length > 0 && Array.from(feedbackVideos).forEach((video) =>
        formData.append("video", video)
      );

      const token = localStorage.getItem("token");

      await axios.post(
        `http://localhost:4000/api/users/courses/${courseId}/feedbacks`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setNewFeedback("");
      setRating(0);
      setFeedbackImages([]);
      setFeedbackVideos([]);
      fetchFeedbacks();
      fetchCourseRatings();
      toast.success("Phản hồi đã được thêm thành công.");
    } catch (error) {
      console.error("Lỗi khi thêm phản hồi:", error);
      toast.error("Không thể thêm phản hồi.");
    } finally {
      setLoading(false);
    }
  };

  // API: Cập nhật feedback
  const updateFeedback = async (feedbackId) => {
    if (!editingFeedback.content.trim()) {
      toast.error("Nội dung là bắt buộc.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccessMessage("");
    try {
      const formData = new FormData();
      formData.append("content", editingFeedback.content);
      if (editingRating !== null && editingRating !== undefined) {
        formData.append("rating", Number(editingRating));
      }

      const token = localStorage.getItem("token");
      Array.from(editingFeedback.images || []).forEach((image) => {
        formData.append("image", image);
      });
      Array.from(editingFeedback.videos || []).forEach((video) => {
        formData.append("video", video);
      });

      await axios.put(
        `http://localhost:4000/api/users/courses/${courseId}/feedbacks/${feedbackId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setEditingFeedback(null);
      fetchFeedbacks();
      fetchCourseRatings();
      toast.success("Phản hồi đã được cập nhật thành công.");
    } catch (error) {
      console.error("Lỗi khi cập nhật phản hồi:", error);
      toast.error("Không thể cập nhật phản hồi.");
    } finally {
      setLoading(false);
    }
  };

  // API: Xóa feedback
  const deleteFeedback = async (feedbackId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa phản hồi này không?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(
          `http://localhost:4000/api/users/courses/${courseId}/feedbacks/${feedbackId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        fetchFeedbacks();
        fetchCourseRatings();
        toast.success("Phản hồi đã được xóa thành công.");
        setError("");
      } catch (error) {
        console.error("Lỗi khi xóa phản hồi:", error);
        toast.error("Không thể xóa phản hồi.");
        setSuccessMessage("");
      }
    }
  };

  const renderStars = (averageRating) => {
    const fullStars = Math.floor(averageRating);
    const halfStar = averageRating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <>
        {Array(fullStars)
          .fill()
          .map((_, index) => (
            <span key={`full-${index}`} className="star full-star">
              ★
            </span>
          ))}
        {halfStar && (
          <span className="star half-star">
            ☆
          </span>
        )}
        {Array(emptyStars)
          .fill()
          .map((_, index) => (
            <span key={`empty-${index}`} className="star empty-star">
              ☆
            </span>
          ))}
      </>
    );
  };

  const cancelFeedbackEditing = () => {
    setEditingFeedback(null);
  };

  const hasPurchasedCourse = purchasedSubscriptions.some(
    (sub) => sub.courseId === courseId
  );

  return (
    <div className="course-feedback">
      <h2>Phản hồi</h2>
      <div className="rating-summary">
        <p>Đánh giá: {ratings.averageRating.toFixed(1)} / 5</p>
        <p>Tổng: {visibleFeedbacksCount}</p>
        <div className="stars">{renderStars(ratings.averageRating)}</div>
      </div>

      {hasPurchasedCourse ? (
        <div className="feedback-form">
          <h3>Thêm phản hồi</h3>
          <textarea
            value={newFeedback}
            onChange={(e) => setNewFeedback(e.target.value)}
            placeholder={"Viết phản hồi của bạn..."}
          />
          <div className="rating-input">
            <span>Đánh giá khóa học này:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className={`star ${rating >= star ? "selected" : ""}`}
                onClick={() => setRating(star)}
              >
                ★
              </button>
            ))}
          </div>
          {error && <p className="error-message">{error}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}
          <button onClick={addFeedback} disabled={loading}>
            {loading ? "Đang thêm..." : "Thêm"}
          </button>
        </div>
      ) : (
        <p>Bạn cần mua khóa học này để thêm phản hồi.</p>
      )}

      <h3>Phản hồi</h3>
      <ul className="feedback-list">
        {feedbacks.filter(feedback => !feedback.isHidden).map((feedback) => (
          <li key={feedback._id} className="feedback-item">
            <div className="feedback-header">
              <strong>{feedback.userId?.name || "Khách"}</strong>
              <span className="feedback-rating">
                {feedback.rating
                  ? Array.from({ length: feedback.rating }).map((_, idx) => (
                    <FontAwesomeIcon key={idx} icon={faStar} />
                  ))
                  : ""}
              </span>
            </div>
            <p>{feedback.content}</p>
            {feedback.imageUrls && feedback.imageUrls.length > 0 && (
              <div className="feedback-images">
                {feedback.imageUrls.map((url, index) => (
                  <img key={index} src={url} alt={`Hình ảnh phản hồi ${index}`} />
                ))}
              </div>
            )}

            {feedback.videos && feedback.videos.length > 0 && (
              <div className="feedback-videos">
                {feedback.videos[0] !== '' ? feedback.videos.map((url, index) => (
                  <video key={index} controls>
                    <source src={url} type="video/mp4" />
                    Trình duyệt của bạn không hỗ trợ thẻ video.
                  </video>
                )) : <></>}
              </div>
            )}
            <div className="feedback-actions">
              {isLoggedIn && currentUserId && feedback.userId?._id === currentUserId && (
                <>
                  <button
                    onClick={() =>
                      setEditingFeedback({
                        id: feedback._id,
                        content: feedback.content,
                        rating: feedback.rating
                      })
                    }
                    className="action-button"
                  >
                    <FontAwesomeIcon icon={faEdit} /> Chỉnh sửa
                  </button>
                  <button
                    onClick={() => deleteFeedback(feedback._id)}
                    className="action-button"
                  >
                    <FontAwesomeIcon icon={faTrashAlt} /> Xóa
                  </button>
                </>
              )}
            </div>
            {editingFeedback?.id === feedback._id && (
              <div className="edit-feedback">
                <textarea
                  value={editingFeedback.content}
                  onChange={(e) =>
                    setEditingFeedback({
                      ...editingFeedback,
                      content: e.target.value,
                    })
                  }
                />
                <div className="rating-input">
                  <span>Đánh giá:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      className={`star ${editingRating >= star ? "selected" : ""}`}
                      onClick={() => setEditingRating(star)}
                    >
                      ★
                    </button>
                  ))}
                </div>
                {error && <p className="error-message">{error}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}
                <button onClick={() => updateFeedback(feedback._id)} disabled={loading}>
                  {loading ? "Đang lưu..." : "Lưu"}
                </button>
                <button
                  onClick={cancelFeedbackEditing}
                  className="cancel-button"
                  disabled={loading}
                >
                  Hủy
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default FeedbackCourse;
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./SubscriptionCheckout.css";

const SubscriptionCheckout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const course = state?.course;

  // Tính toán giá sau khi giảm giá
  const discount = course?.discount || 0;
  const discountedPrice = course?.price - (course?.price * discount) / 100;

  const handlePayment = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Bạn cần đăng nhập trước khi thanh toán.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/api/users/payment",
        {
          courseId: course._id,
          price: discountedPrice, // Gửi giá đã giảm vào database
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.payUrl) {
        // Redirect đến trang thanh toán của MoMo
        window.location.href = response.data.payUrl;
      } else {
        alert("Payment initiation failed. Please try again.");
      }
    } catch (error) {
      console.error("Lỗi thanh toán:", error);
      alert("Thanh toán thất bại. Vui lòng thử lại.");
    }
  };

  if (!course) {
    return <div className="not-found">Không tìm thấy khóa học</div>;
  }

  return (
    <div className="container-full">
    <div className="subscription-page">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover/>
      <div className="step">
        <h1 className="header-title">Thông tin khóa học</h1>

        {/* Course Card */}
        <div className="course-card-checkout">
          <div className="course-images-slider">
            {course?.image && course.image.length > 0 ? (
              <ImageSlider images={course.image} />
            ) : (
              <img
                src="https://via.placeholder.com/400"
                alt="No Course Image"
                className="course-placeholder-image"
              />
            )}
          </div>

          <div className="course-info-checkout">
            <h2 className="course-name-checkout">
              {course?.name || "No Name Available"}
            </h2>

            <p className="course-description-checkout">
              <div
                dangerouslySetInnerHTML={{
                  __html: course?.description || "",
                }}
              />
            </p>

            <p>
              <strong>Số lượng bài tập:</strong> {course?.slotNumber || "N/A"}
            </p>
            <p>
              <strong>Giá:</strong>{" "}
              {discount > 0 ? (
                <>
                  {/* <span className="original-price">
                    {course?.price?.toLocaleString()} VNĐ
                  </span>
                  <br /> */}
                  <span className="discounted-price">
                    {discountedPrice?.toLocaleString()} VNĐ
                  </span>
                </>
              ) : (
                <span>{course?.price?.toLocaleString()} VNĐ</span>
              )}
            </p>
            <p>
              <strong>HLV:</strong>{" "}
              {course?.coachId?.accountId?.name ||
                course?.coachId?.name ||
                "No Coach Assigned"}
            </p>
          </div>
        </div>

        {/* Proceed to Payment Button */}
        <button className="next-btn" onClick={handlePayment}>
          Thanh toán
        </button>
        {/* <button className="next-btn">
          Thanh toán
        </button> */}
      </div>
    </div>
    </div>
  );
};

const ImageSlider = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="image-slider">
      <button className="slider-btn prev" onClick={goToPrevImage}>
        &lt;
      </button>
      <img
        src={images[currentImageIndex]}
        alt={`Slide ${currentImageIndex + 1}`}
        className="slider-image"
      />
      <button className="slider-btn next" onClick={goToNextImage}>
        &gt;
      </button>
    </div>
  );
};

export default SubscriptionCheckout;

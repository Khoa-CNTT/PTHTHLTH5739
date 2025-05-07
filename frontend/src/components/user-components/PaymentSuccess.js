import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./PaymentSuccess.css";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [subscriptionId, setSubscriptionId] = useState(null);

  useEffect(() => {
    // Lấy tham số subscriptionId từ query string trong URL
    const params = new URLSearchParams(location.search);
    const subId = params.get("subscriptionId");
    console.log("subscriptionId đã nhận:", subId);
    if (subId) {
      setSubscriptionId(subId);
    } else {
      // Nếu không tìm thấy subscriptionId,thông báo lỗi ở đây
      console.error("Không tìm thấy subscriptionId trong URL");
    }
  }, [location]);

  const handleStartSurvey = () => {
    if (subscriptionId) {
      navigate(`/userSubscription/${subscriptionId}/survey`);
    } else {
      console.error("Không tim thấy subscription ID");
    }
  };

  return (
    <div className="payment-success-container">
      <div className="success-card">
        <div className="success-icon">
          <i className="fas fa-check-circle"></i>
        </div>
        <h1>Thanh toán thành công!</h1>
        <p>Cảm ơn bạn đã đăng ký khóa học.</p>
        <p>
          Vui lòng hoàn thành khảo sát ngắn để chúng tôi có thể phục vụ bạn tốt
          hơn.
        </p>
        <button className="survey-button" onClick={handleStartSurvey}>
          Bắt đầu khảo sát
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;

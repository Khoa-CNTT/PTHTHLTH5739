import React, { useState, useEffect } from "react";

import "./CoachesDetail.css";

const CoachDetails = () => {

  return (
    <div className="coach-details">
    <div className="coach-details-container">
      <div className="coach-details-container-1">
        <div className="coach-details-account-info">
          <div className="coach-details-img-container">
            <img src="https://fitnessonline.app/vi/img/user6.png" alt="Ảnh huấn luyện viên" />
          </div>
          <div className="coaches-detail-info">
            <h3>Thông tin cá nhân</h3>
            <p>Tên: Nguyễn Thị A</p>
            <p>Giới tính: Nữ</p>
            <p>Tuổi: 28</p>
            <p>Số điện thoại: 0901234567</p>
            <p>Địa chỉ: 123 Đường ABC, Quận XYZ, Thành phố HCM</p>
          </div>
        </div>
      </div>

      <div className="coach-details-container-2">
        <div className="title">
          <h1>Hồ sơ của Nguyễn Thị A</h1>
        </div>

        <div className="coach-info">
          <div className="coach-introduction">
            <h3>Giới thiệu</h3>
            <p>
              Tôi là Nguyễn Thị An, một huấn luyện viên thể hình chuyên nghiệp với hơn 5 năm kinh nghiệm. Tôi đam mê giúp mọi người đạt được mục tiêu sức khỏe và thể hình của mình. Tôi tin rằng tập luyện không chỉ là về việc thay đổi cơ thể mà còn là về việc thay đổi cuộc sống.
            </p>
          </div>
          <div className="coach-experience">
            <h3>Kinh nghiệm</h3>
            <ul>
              <p>2018 - 2020: Huấn luyện viên tại Trung tâm Thể hình A</p>
              <p>2020 - Hiện tại: Huấn luyện viên tự do và tư vấn trực tuyến</p>
            </ul>
          </div>
        </div>

        <div className="coach-certificates">
          <h3>Chứng chỉ</h3>
          <div className="course-images-slider">
            <img src="https://leanhd.com/wp-content/uploads/2023/08/z4621213198439_e2edb68290f6980b9cfe8b45eff80a4f-1024x716.jpg" alt="Chứng chỉ Huấn luyện viên cá nhân" />
          </div>
        </div>

        <div className="coach-self-images">
          <h3>Hình ảnh cá nhân</h3>
          <div className="course-images-slider">
            <img src="https://leanhd.com/wp-content/uploads/2023/08/z4621213198439_e2edb68290f6980b9cfe8b45eff80a4f-1024x716.jpg" alt="Hình ảnh tập luyện" />
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};
export default CoachDetails;

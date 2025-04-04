import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./CoachesList.css";

const CoachesList = () => {


  return (
    <div className="container-full">
      <div className="coaches-list">
        <h1 className="courses-title">Coaches</h1>
        <div className="container">
          <div className="row">
            <div className="col-lg-4">
              <div className="coach-list-card">
                <div className="coach-img">
                  <img
                    style={{ width: '300px', objectFit: 'cover', height: '300px' }}
                    src="https://fitnessonline.app/vi/img/user6.png"
                    alt="" />
                  <h2 className="coach-list-name">
                    Xinh
                  </h2>
                  <Link to={`/coach/1`}>
                    <button className="view-btn-coach">Xem chi tiết</button>
                  </Link>
                </div>
                <div className="course-list-images-slider">
                  <img src="" alt="" style={{ width: '300px', objectFit: 'cover' }} />
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="coach-list-card">
                <div className="coach-img">
                  <img
                    style={{ width: '300px', objectFit: 'cover', height: '300px' }}
                    src="https://fitnessonline.app/vi/img/user6.png"
                    alt="" />
                  <h2 className="coach-list-name center">
                    Xinh
                  </h2>
                  <Link to={`/coach/1`}>
                    <button className="view-btn-coach">Xem chi tiết</button>
                  </Link>
                </div>
                <div className="course-list-images-slider">
                  <img src="" alt="" style={{ width: '300px', objectFit: 'cover' }} />
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="coach-list-card">
                <div className="coach-img">
                  <img
                    style={{ width: '300px', objectFit: 'cover', height: '300px' }}
                    src="https://fitnessonline.app/vi/img/user6.png"
                    alt="" />
                  <h2 className="coach-list-name">
                    Xinh
                  </h2>
                  <Link to={`/coach/1`}>
                    <button className="view-btn-coach">Xem chi tiết</button>
                  </Link>
                </div>
                <div className="course-list-images-slider">
                  <img src="" alt="" style={{ width: '300px', objectFit: 'cover' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CoachesList;

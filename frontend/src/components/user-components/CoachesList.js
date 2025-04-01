import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ImageSlider } from "../user-components/coach/Coach-Slideshow-Image";
import "./CoachesList.css";

const CoachesList = () => {


  const getImageSrc = (imageName) => {
    try {
      return require(`../../assets/avatar/${imageName}`);
    } catch (err) {
      return imageName;
    }
  };

  return (
    <div className="container-full">
      <div className="coaches-list">
        <h1 className="courses-title">Coaches</h1>
        <div className="coaches-container">
          <div className="row">
            
          </div>
            <div className="coach-list-card">
              <div className="coach-img-container">
                <img
                  style={{ width: '300px', objectFit: 'cover', height: '300px' }}
                  src="https://fitnessonline.app/vi/img/user6.png"
                  alt=""/>
                <h2 className="coach-list-name">
                  Xinh
                </h2>
                <Link to={`/coach/1`}>
                  <button className="view-btn-coach">Xem chi tiết</button>
                </Link>
              </div>
              <div className="course-list-images-slider">
                    <img src="" alt="" style={{ width: '300px', objectFit: 'cover'}} />
              </div>
            </div>
        </div>
        <div className="coaches-container">
            <div className="coach-list-card">
              <div className="coach-img-container">
                <img
                  style={{ width: '300px', objectFit: 'cover', height: '300px' }}
                  src="https://fitnessonline.app/vi/img/user6.png"
                  alt=""/>
                <h2 className="coach-list-name">
                  Xinh
                </h2>
                <Link to={`/coach/`}>
                  <button className="view-btn-coach">Xem chi tiết</button>
                </Link>
              </div>
              <div className="course-list-images-slider">
                    <img src="" alt="" style={{ width: '300px', objectFit: 'cover'}} />
              </div>
            </div>
        </div>
        <div className="coaches-container">
            <div className="coach-list-card">
              <div className="coach-img-container">
                <img
                  style={{ width: '300px', objectFit: 'cover', height: '300px' }}
                  src="https://fitnessonline.app/vi/img/user6.png"
                  alt=""/>
                <h2 className="coach-list-name">
                  Xinh
                </h2>
                <Link to={`/coach/`}>
                  <button className="view-btn-coach">Xem chi tiết</button>
                </Link>
              </div>
              <div className="course-list-images-slider">
                    <img src="" alt="" style={{ width: '300px', objectFit: 'cover'}} />
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CoachesList;

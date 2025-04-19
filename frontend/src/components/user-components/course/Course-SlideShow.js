import React from "react";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";

const CourseDetailSlideShow = ({ images }) => {
  if (!images || images.length === 0) {
    return <div className="no-images">Không có hình ảnh nào có sẵn</div>;
  }

  const properties = {
    prevArrow: (
      <button class="slider-nav-button left">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
    ),
    nextArrow: (
      <button class="slider-nav-button right">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    ),
  };

  return (
    <div className="course-slideshow-container">
      <Slide>
        {images.map((img, index) => (
          <div className="each-slide" key={index}>
            <div
              className="slide-image"
              style={{
                backgroundImage: `url(${img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "400px",
              }}
            />
          </div>
        ))}
      </Slide>
    </div>
  );
};

export default CourseDetailSlideShow;

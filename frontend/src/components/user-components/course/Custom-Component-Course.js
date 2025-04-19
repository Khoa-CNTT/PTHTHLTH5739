import { useState } from "react";
// import "./ImageSlider.css";

// Hàm cắt mô tả (optional nếu cần dùng)
export const truncateDescription = (description, length) => {
  if (!description) return "";
  return description.length > length
    ? description.substring(0, length) + "..."
    : description;
};

// Component SlideShow / Carousel
export const ImageSlider = ({ images }) => {
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
      <button className="slider-button prev" onClick={goToPrevImage}>
        &lt;
      </button>
      <div className="slider-wrapper">
        <img
          src={images[currentImageIndex]}
          alt={`Slide ${currentImageIndex + 1}`}
          className="slider-image"
        />
      </div>
      <button className="slider-button next" onClick={goToNextImage}>
        &gt;
      </button>
      <div className="slider-dots">
        {images.map((_, index) => (
          <span
            key={index}
            className={`dot ${currentImageIndex === index ? "active" : ""}`}
            onClick={() => setCurrentImageIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

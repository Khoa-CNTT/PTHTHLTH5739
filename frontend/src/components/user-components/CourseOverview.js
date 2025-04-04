import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CourseOverview.css";
import "bootstrap/dist/css/bootstrap.min.css";

const CourseOverview = () => {
  const [course, setCourse] = useState({});
  const [exercises, setExercises] = useState([]);

  // Lấy dữ liệu từ API khi component mount
  useEffect(() => {
    // Gọi API để lấy thông tin khóa học
    axios
      .get("/api/course/670e8c7dfe153e4285c40d35") // Đổi '1' thành ID của khóa học mà bạn muốn lấy
      .then((response) => {
        console.log(response.data);
        setCourse(response.data);
        setExercises(response.data.surveyOptions || []);
      })
      .catch((error) => {
        console.error("Error fetching course data:", error);
      });
  }, []);

  return (
    <div className="container-fluid course-overview">
      <div className="container">
        {/* Thông tin huấn luyện viên */}
        {course && course.name ? (
          <div className="row trainer-info align-items-center">
            <div className="col-md-3">
              <img
                src="https://cdnv2.tgdd.vn/mwg-static/common/News/1569295/tho-7-mau-1-2-0.jpg"
                alt="Trainer"
              />
            </div>
            <div className="col-md-9">
              <h2>{course.name}</h2>
              <p>{course.description}</p>
              <h3>MUSCLE INCREASE - FAT DECREASE</h3>
              <p>DURATION - {course.duration}</p>
              <p>PRICE: {course.price}$</p>
            </div>
          </div>
        ) : (
          <p>Loading course details...</p>
        )}

        {/* Mục tiêu tuần */}
        <div
          className="week-target text-center"
          style={{ padding: "0px 10px" }}
        >
          <h3>Week target</h3>
          <div className="row">
            <div className="col">
              <button className="btn btn-outline-dark">Monday</button>
            </div>
            <div className="col">
              <button className="btn btn-outline-dark">Tuesday</button>
            </div>
            <div className="col">
              <button className="btn btn-outline-dark">Wednesday</button>
            </div>
            <div className="col">
              <button className="btn btn-outline-dark">Thursday</button>
            </div>
            <div className="col">
              <button className="btn btn-outline-dark">Friday</button>
            </div>
            <div className="col">
              <button className="btn btn-outline-dark">Saturday</button>
            </div>
          </div>
        </div>

        {/* Danh sách bài tập */}
        {exercises.length > 0 ? (
          <div className="exercises text-center mt-5">
            <h3 style={{ marginBottom: "20px" }}>EXERCISES</h3>
            <div className="row justify-content-center">
              {exercises.map((exercise, index) => (
                <div key={index} className="col-md-8 mb-4">
                  <div className="exercise-item">
                    <h4>{exercise.questionId}</h4>
                    <img
                      src={
                        course.image && course.image[index]
                          ? course.image[index]
                          : "https://via.placeholder.com/300"
                      }
                      alt={exercise.questionId}
                      className="img-fluid"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>Loading exercises...</p>
        )}
      </div>
    </div>
  );
};

export default CourseOverview;

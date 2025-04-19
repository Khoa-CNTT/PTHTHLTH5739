import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaLock } from "react-icons/fa"; // Importing the lock icon from react-icons
import AccordionExpandIcon from "../user-components/course/Course-Accordion";
import DividerVariants from "../user-components/course/Course-Divider-Variants";
import FeedbackCourse from "./FeedbackCourse";
import CourseDetailSlideShow from "../user-components/course/Course-SlideShow";
import CourseVideoDialog from "../user-components/course/Course-Video-Popup";
import { toast, ToastContainer } from "react-toastify"; // Importing react-toastify for toast notifications
import "react-toastify/dist/ReactToastify.css";
import "./CourseDetail.css";
import { LeftOutlined } from "@ant-design/icons";
import { Button } from "react-bootstrap";

const CourseDetails = () => {
  const { id } = useParams(); // courseId hiện tại
  const [course, setCourse] = useState(null);
  const [purchasedSubscriptions, setPurchasedSubscriptions] = useState([]); // Danh sách khóa học đã mua
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Trạng thái cho slider
  const [showVideoModal, setShowVideoModal] = useState(false); // Trạng thái modal
  const [selectedVideo, setSelectedVideo] = useState(null); // Video đang chọn
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/users/courses/${id}`
        );
        // console.log("Course Data", response.data);

        const courseData = response.data;

        // Nếu có workout, lấy chi tiết từng workout
        if (courseData.workout.length > 0) {
          const workoutDetails = await Promise.all(
            courseData.workout.map(async (workoutId) => {
              const workoutResponse = await axios.get(
                `http://localhost:4000/api/users/course-detail/workouts/${workoutId}`
              );
              console.log(
                `Workout Details for ID ${workoutId}:`,
                workoutResponse.data
              );
              return workoutResponse.data;
            })
          );
          courseData.workout = workoutDetails;
        }

        setCourse(courseData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchPurchasedSubscriptions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:4000/api/users/purchased-courses",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("Course Buy", response.data.purchasedCourses);

        setPurchasedSubscriptions(response.data.purchasedCourses);
      } catch (err) {
        console.error("Error fetching purchased subscriptions:", err);
      }
    };

    fetchCourse();
    fetchPurchasedSubscriptions();
  }, [id]);

  const handleBack = () => {
    navigate("/course-details");
  };

  const handlePayment = () => {
    const token = localStorage.getItem("token");
    console.log("token", token);
    if (!token) {
      console.log("token .....", token);

      toast.warning("You need to be logged in to purchase the course", {
        autoClose: 3000,
      });
      // alert("You need to be logged in to purchase the course");
      // navigate("/signin");
    } else {
      // Nếu token hợp lệ, tiếp tục thực hiện thanh toán
      navigate("/subscriptionCheckout", { state: { course: course } });
    }
  };

  const purchasedSubscription = purchasedSubscriptions.find(
    (sub) => sub.courseId === id
  );

  const goToCourseSchedule = () => {
    if (purchasedSubscription) {
      navigate(`/userSchedule/${purchasedSubscription.subscriptionId}`);
    }
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === course.image.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? course.image.length - 1 : prevIndex - 1
    );
  };

  // Mở popup video
  const handleOpenVideo = (videoUrl) => {
    setSelectedVideo(videoUrl);
    setShowVideoModal(true);
  };

  // Đóng popup video
  const handleCloseVideo = () => {
    setSelectedVideo(null);
    setShowVideoModal(false);
  };

  if (loading) return <div className="loading">Đang tải thông tin chi tiết về khóa học...</div>;
  if (error) return <div className="error">Lỗi: {error}</div>;
  if (!course) return <div className="not-found">Không tìm thấy khóa học</div>;

  const {
    name,
    description,
    slotNumber,
    price,
    discount,
    workout = [],
    coachId,
    image = [],
    difficulty = "Not specified",
    category = "Not specified",
  } = course;

  // Tính toán giá sau khi giảm giá

  return (
    <div className="course-details">
      <ToastContainer />
      <div className="course-details-container">
        <Button
          icon={<LeftOutlined />}
          onClick={() => navigate(-1)}
          className="mb-2"
          style={{ marginRight: "10px" }} // Thêm một chút khoảng cách
        >
          Quay lại
        </Button>

        <div className="course-header">
          <h1 className="course-title">{name}</h1>
          {purchasedSubscription ? (
            <button className="go-to-course-btn" onClick={goToCourseSchedule}>
              Đi đến Khóa Học
            </button>

          ) : (
            // <button className="enroll-btn" onClick={handlePayment}>
            //   Đăng ký
            // </button>
            <button className="enroll-btn" >
              Đăng ký
            </button>
          )}
        </div>

        <div className="product-course-detail-info">
          <CourseDetailSlideShow images={image} />

          <div className="course-highlights">
            <DividerVariants
              slotNumber={slotNumber}
              difficulty={difficulty}
              price={price}
              category={category}
              discount={discount}
            // purchasedSubscription={purchasedSubscription}
            // goToCourseSchedule={goToCourseSchedule}
            // handlePayment={handlePayment}
            />
          </div>
        </div>

        <div className="highlight description-highlight">
          {/* Hiển thị nội dung mô tả khóa học với HTML */}
          <div dangerouslySetInnerHTML={{ __html: description || "" }} />
        </div>

        <AccordionExpandIcon
          workout={workout}
          handleOpenVideo={handleOpenVideo}
        />

        {/* Modal video */}
        <CourseVideoDialog
          showVideoModal={showVideoModal}
          handleCloseVideo={handleCloseVideo}
          videoSrc={selectedVideo}
        />

        <FeedbackCourse
          courseId={id}
          purchasedSubscriptions={purchasedSubscriptions}
        />
      </div>
    </div>
  );
};

export default CourseDetails;
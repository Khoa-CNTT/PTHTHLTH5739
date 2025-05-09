// Import thư viện
import React, { useState, useEffect } from "react";
import axios from "axios";

import { Link } from "react-router-dom";
import "tailwindcss/tailwind.css";
import "./Home.css";

// Import hình ảnh
import manGymImage from "../img/man-gym.jpg";
// Import icon
import { FaWeight, FaSmileBeam } from "react-icons/fa";
import { GiMuscleUp, GiEnergyArrow } from "react-icons/gi";



// Hero Section
const GymHeroSection = () => (
  <section className="min-h-screen bg-neutral-50 py-12 px-6 sm:py-24 sm:px-12 pb-0 relative">
    <div className="absolute inset-0">
      <img
        src={manGymImage}
        alt="Man working out at gym"
        className="w-full h-full object-cover"
      />
    </div>
    <div className="relative z-10 max-w-7xl mx-auto grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
      <div className="space-y-6 md:space-y-8 text-white order-2 md:order-1">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
          The Best Gym
        </h1>
        <p className="text-lg sm:text-xl lg:text-2xl text-gray-200">
          Chúng tôi phát triển các chương trình cá nhân hóa phù hợp với nhu cầu của bạn.
        </p>
        <Link
          to="/signup"
          className="inline-block bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          BẮT ĐẦU NGAY
        </Link>
      </div>
    </div>
  </section>
);

// Lợi ích Section
const GymBenefitsSection = () => (
  <section className="bg-orange-500 py-20 px-4">
    <div className="max-w-6xl mx-auto text-center">
      <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 drop-shadow-sm">
        Những điểm khác biệt của <span className="text-yellow-200">chúng tôi</span>
      </h2>
      <p className="text-lg md:text-xl max-w-3xl mx-auto mb-12 text-white/90">
        Chúng tôi không chỉ giúp bạn rèn luyện thể chất mà còn thay đổi tư duy tích cực mỗi ngày.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { icon: <FaWeight />, title: "GIẢM CÂN", description: "Các chương trình giảm cân hiệu quả." },
          { icon: <GiMuscleUp />, title: "CƠ BẮP", description: "Chương trình tăng cơ vượt trội." },
          { icon: <GiEnergyArrow />, title: "NĂNG LƯỢNG", description: "Tăng sức bền và thể lực." },
          { icon: <FaSmileBeam />, title: "SỨC KHỎE", description: "Hỗ trợ phục hồi và thư giãn." }
        ].map((benefit, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 text-center"
          >
            <div className="flex justify-center mb-4 text-orange-500 text-5xl">
              {benefit.icon}
            </div>
            <h3 className="text-xl font-semibold text-orange-600 mb-2">{benefit.title}</h3>
            <p className="text-gray-700 text-sm">{benefit.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);



// About Section
const AboutSection = () => (
  <section className="py-16 bg-white text-black">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
        <div className="space-y-8">
          <h2 className="uppercase tracking-widest font-semibold text-lg text-red-600">
            VỀ CHÚNG TÔI
          </h2>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
            CHÀO MỪNG ĐẾN VỚI <br />
            <span className="text-red-600">IGYM</span>
          </h1>
          <p className="text-gray-800 text-lg sm:text-xl leading-relaxed">
            Chúng tôi không chỉ là một phòng tập gym, mà là nơi bạn có thể thay đổi bản thân.
          </p>
          <Link
            to="/blog"
            className="inline-block bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white px-6 py-3 rounded-xl text-lg sm:text-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            ĐỌC THÊM
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-8 lg:gap-12">
          {[
            { number: "500K+", label: "GIỜ TẬP LUYỆN" },
            { number: "2560+", label: "KHÁCH HÀNG" },
            { number: "790+", label: "CHƯƠNG TRÌNH" },
            { number: "830+", label: "CƠ THỂ HOÀN HẢO" }
          ].map((stat, index) => (
            <div key={index} className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md">
              <div className="text-3xl font-bold text-red-600 mb-2">{stat.number}</div>
              <div className="text-gray-600 uppercase text-sm tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);
const TeamSection = () => {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/coaches/coachList"
        );
        setCoaches(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCoaches();
  }, []);
  const firstThreeCoaches = coaches.slice(0, 3);


  return (
    <section className="py-20 bg-orange-500">
      <div className="max-w-6xl mx-auto px-4">
        {/* Thêm phần header mới */}
        <div className="text-center mb-12">
          <h2 className="text-white uppercase tracking-widest font-semibold mb-4">
            ĐỘI NGŨ HUẤN LUYỆN VIÊN      
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {firstThreeCoaches.map((coach) => (
            <div
              key={coach._id}
              className="p-6 transition-transform transform hover:scale-105 hover:shadow-xl"
            >
              <Link to={`/coach/${coach._id}`} className="block">
              <div className="flex justify-center mb-6">
                <img
                  src={coach.accountId?.avatar}
                  alt={`${coach.accountId?.name || "Unknown Coach"}'s profile`}
                  className="w-64 h-64 object-cover rounded-full shadow-md border-4 border-orange-500"
                />
              </div>
              <h3 className="text-2xl font-bold text-white text-center">
              {coach.accountId?.name || "Unknown Coach"}
              </h3>
              <p className="text-white font-medium text-center mt-2">
              HLV Gym
              </p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
const CourseCardHome = ({ course }) => {
  const calculateDiscountedPrice = (price, discount) => {
    if (!price || !discount) return price;
    const discountedPrice = price - (price * discount) / 100;
    return discountedPrice;
  };

  return (
    <div key={course._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 flex flex-col">
      <img
        className="w-full h-48 object-cover rounded-md mb-4"
        src={`${course.image}`}
        alt={course.name}
      />
      <div className="flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{course.name}</h3>
        <div className="mb-2">
          {course.price ? (
            <>
              {course.discount && course.discount > 0 ? (
                <>
                  <span className="text-gray-500 line-through mr-2">
                    {course.price.toLocaleString()} VNĐ
                  </span>
                  <span className="text-orange-500 font-semibold">
                    {calculateDiscountedPrice(
                      course.price,
                      course.discount
                    ).toLocaleString()}{" "}
                    VNĐ
                  </span>
                </>
              ) : (
                <span className="text-orange-500 font-semibold">
                  {course.price.toLocaleString()} VNĐ
                </span>
              )}
            </>
          ) : (
            "Miễn phí"
          )}
          {course.discount && course.discount > 0 && (
            <span className="text-green-600 ml-2">Giảm {course.discount}%</span>
          )}
        </div>
        <p className="text-gray-700 text-sm flex-grow mb-3">
          {course.description ? (
            course.description.length > 80 ? (
              `${course.description.slice(0, 80)}...`
            ) : (
              course.description
            )
          ) : (
            "Không có mô tả"
          )}
        </p>
      </div>
      <Link
        to={`/course/${course._id}`}
        className="inline-block bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md text-center font-semibold transition-colors mt-2"
      >
        Xem chi tiết
      </Link>
    </div>
  );
};

const HomeCoursesSection = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/users/courses?limit=3" // Lấy 3 khóa học đầu tiên
        );
        const acceptedCourses = response.data.filter(
          (course) => course.status === "accepted"
        );
        setCourses(acceptedCourses);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <div className="py-16 text-center">Đang tải khóa học...</div>;
  if (error) return <div className="py-16 text-center text-red-500">Lỗi: {error}</div>;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
            CÁC KHÓA HỌC NỔI BẬT
          </h2>
          <p className="text-lg text-gray-600">
            Khám phá các khóa học hàng đầu của chúng tôi và bắt đầu hành trình rèn luyện của bạn.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <CourseCardHome key={course._id} course={course} />
          ))}
        </div>
        {courses.length > 0 && (
          <div className="text-center mt-8">
            <Link
              to="/course-details"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white py-3 px-8 rounded-full font-semibold transition-colors"
            >
              Xem tất cả khóa học
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};


// Trang chính
const Home = () => (
  <>
    <GymHeroSection />
    <GymBenefitsSection />
    <AboutSection />
    <TeamSection />
    <HomeCoursesSection />
  </>
);

export default Home;

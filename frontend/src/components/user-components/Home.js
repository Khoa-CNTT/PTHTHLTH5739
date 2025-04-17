// Import thư viện
import React, { useState, useEffect } from "react";
import axios from "axios";

import { Link } from "react-router-dom";
import "tailwindcss/tailwind.css";
import "./Home.css";

// Import hình ảnh
import manGymImage from "../img/man-gym.jpg";
import team1 from "../img/team/team-1.jpg";
import team2 from "../img/team/team-2.jpg";
import team3 from "../img/team/team-3.jpg";

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
const PricingSection = () => {
  const plans = [
    {
      title: "GYM CƠ BẢN ONLINE",
      price: 999000, // Giá tiền Việt (VND)
      features: [
        "Truy cập câu lạc bộ trực tuyến không giới hạn",
        "Tham gia nhóm tập online",
        "Vé tham gia các buổi tập trực tuyến",
        "Truy cập các video hướng dẫn tập luyện",
        "Tham gia các lớp học trực tuyến theo chủ đề"
      ]
    },
    {
      title: "GYM TIÊU CHUẨN ONLINE",
      price: 1199000, // Giá tiền Việt (VND)
      features: [
        "Truy cập câu lạc bộ trực tuyến không giới hạn",
        "Tham gia nhóm tập online", 
        "Vé tham gia các buổi tập trực tuyến",
        "Truy cập các video hướng dẫn tập luyện",
        "Tham gia các lớp học trực tuyến theo chủ đề"
      ]
    },
    { 
      title: "GYM CAO CẤP ONLINE",
      price: 1499000, // Giá tiền Việt (VND)
      features: [
        "Truy cập câu lạc bộ trực tuyến không giới hạn",
        "Tham gia nhóm tập online",
        "Vé tham gia các buổi tập trực tuyến",
        "Truy cập các video hướng dẫn tập luyện",
        "Tham gia các lớp học trực tuyến theo chủ đề"
      ]
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            CÁC KHÓA HỌC ĐANG MỞ
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-8"
            >
              <div className="text-center mb-8">
                {/* Giá tiền hiển thị đơn giản */}
                <div className="text-4xl font-bold text-orange-500 mb-2">
                  {plan.price.toLocaleString('vi-VN')} VND
                </div>
                <div className="text-gray-600 font-medium">Tháng</div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 text-center mb-6">
                {plan.title}
              </h3>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li 
                    key={i}
                    className="flex items-center text-gray-600"
                  >
                    <svg 
                      className="w-5 h-5 text-orange-500 mr-2" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M5 13l4 4L19 7" 
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <button className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors transform hover:scale-105">
                Tham gia ngay
              </button>
            </div>
          ))}
        </div>
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
    <PricingSection />
  </>
);

export default Home;

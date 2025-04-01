import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "tailwindcss/tailwind.css";
import "./Home.css";



const slides = [
  {
    image: require("../img/hero/hero-1.jpg"),
    subtitle: "Shape your body",
    link: "#",
  },
  {
    image: require("../img/hero/hero-2.jpg"),
    subtitle: "Shape your body",
    link: "#",
  },
];

function Home() {
  return (
    <div>
      {/* Hero Section Begin */}
      <section>
        <Swiper
          modules={[Pagination, Autoplay, Navigation]}
          pagination={{ clickable: true }}
          navigation
          loop={true}
          autoplay={{ delay: 3000 }}
          className="w-full h-96 md:h-screen custom-swiper"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index} className="relative">
              <img
                className="object-cover w-full h-full"
                src={slide.image}
                alt="Description"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="max-w-xl p-10 text-center text-gray-300">
                  <span className="text-xl tracking-wide uppercase">
                    {slide.subtitle}
                  </span>
                  <h1 className="mt-4 text-5xl font-bold leading-tight uppercase lg:text-7xl md:text-6xl">
                    Be <span className="text-orange-600">strong</span> <br />
                    Training hard
                  </h1>
                  <a href={slide.link} passHref>
                    {/* <span className="inline-block px-6 py-2 mt-6 text-lg text-white transition-all duration-500 bg-orange-500 rounded-lg hover:bg-orange-600 hover:scale-105">
                      Get info
                    </span> */}
                  </a>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
      {/* Hero Section End */}
      <section className="content-section spad bg-white">
        <div className="container">
          <div className="row">
            <div className="col-lg-3">
              <div style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '16px',
                maxWidth: '400px',
                margin: '20px auto',
                fontFamily: 'Arial, sans-serif'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#e0e0e0',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    marginRight: '10px'
                  }}>
                    D
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>Dylan Welby</div>
                    <div style={{ fontSize: '12px', color: '#777' }}>8 months ago</div>
                  </div>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  ★★★★★
                </div>
                <div>
                  Tôi là một người rất bận rộn và không có thời gian đến phòng tập gym.
                  Nhưng nhờ trang web này, tôi có thể tập luyện bất cứ lúc nào, bất cứ nơi nào.
                  Các bài tập được thiết kế khoa học, dễ hiểu và hiệu quả. Tôi đã giảm được 5kg sau 2 tháng tập luyện.
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '16px',
                maxWidth: '400px',
                margin: '20px auto',
                fontFamily: 'Arial, sans-serif'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#e0e0e0',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    marginRight: '10px'
                  }}>
                    X
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>Xinh Lưu</div>
                    <div style={{ fontSize: '12px', color: '#777' }}>2 months ago</div>
                  </div>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  ★★★★★
                </div>
                <div>
                  Tuyệt vời! Trang web này có rất nhiều bài tập khác nhau.
                  Tôi không bao giờ cảm thấy nhàm chán khi tập luyện ở đây.
                  Huấn luyện viên rất chuyên nghiệp và nhiệt tình, luôn sẵn sàng giải đáp thắc mắc của tôi.
                  Cảm ơn trang web rất nhiều!
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '16px',
                maxWidth: '400px',
                margin: '20px auto',
                fontFamily: 'Arial, sans-serif'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#e0e0e0',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    marginRight: '10px'
                  }}>
                    H
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>Hưng Nguyễn</div>
                    <div style={{ fontSize: '12px', color: '#777' }}>1 months ago</div>
                  </div>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  ★★★★★
                </div>
                <div>
                  Tôi rất thích cộng đồng trên trang web này. Mọi người đều rất thân thiện và động viên nhau cùng cố gắng.
                  Tôi cũng nhận được rất nhiều lời khuyên hữu ích từ huấn luyện viên và các thành viên khác.
                  Điều này giúp tôi có thêm động lực để tập luyện.
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '16px',
                maxWidth: '400px',
                margin: '20px auto',
                fontFamily: 'Arial, sans-serif'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#e0e0e0',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    marginRight: '10px'
                  }}>
                    U
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>Uyên Phạm</div>
                    <div style={{ fontSize: '12px', color: '#777' }}>3 months ago</div>
                  </div>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  ★★★★★
                </div>
                <div>
                  Trang web có giao diện đẹp mắt và dễ sử dụng.
                  Tôi có thể dễ dàng tìm kiếm các bài tập phù hợp với mục tiêu của mình.
                  Video hướng dẫn rõ ràng và chi tiết. Tôi rất hài lòng với trải nghiệm tập luyện trên trang web này.
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-3 ms-2">
            <div style={{ fontFamily: 'Arial, sans-serif' }}>
              <h2 style={{ textAlign: 'center', color: '#333' }}>TIN TỨC - SỰ KIỆN</h2>
              <div style={{ display: 'flex', justifyContent: 'space-around', margin: '20px 0' }}>
                {/* Bài viết 1 */}
                <div style={{ width: '45%', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                  <img
                    src="https://levelfyc.com/wp-content/uploads/2024/09/cac-nhom-co-tap-gym-13-460x600.jpg"
                    alt="Các Nhóm Cơ Tập Gym"
                    style={{ width: '100%', display: 'block' }}
                  />
                  <div style={{ padding: '15px' }}>
                    <h3 style={{ color: '#333', marginBottom: '8px' }}>
                      Các Nhóm Cơ Tập Gym: Hướng Dẫn Chi Tiết Cho Người Mới
                    </h3>
                    <p style={{ fontSize: '14px', color: '#666' }}>
                      Bạn đang loay hoay với lịch tập gym mà không thấy hiệu quả như mong muốn? Bí mật nằm ở việc hiểu rõ các nhóm...
                    </p>
                  </div>
                </div>

                {/* Bài viết 2 */}
                <div style={{ width: '45%', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                  <img
                    src="https://levelfyc.com/wp-content/uploads/2024/09/thue-pt-1-1-460x600.jpg"
                    alt="PT Gym Là Gì?"
                    style={{ width: '100%', display: 'block' }}
                  />
                  <div style={{ padding: '15px' }}>
                    <h3 style={{ color: '#333', marginBottom: '8px' }}>PT Gym Là Gì? Giá Thuê PT Gym Bao Nhiêu Tiền?</h3>
                    <p style={{ fontSize: '14px', color: '#666' }}>
                      Chắc hẳn bạn đã từng nghe qua cụm từ "PT Gym" nhưng vẫn chưa thực sự hiểu rõ về nó? Theo thống kê, hơn 70%...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-3 ms-2">
            <div style={{ fontFamily: 'Arial, sans-serif' }}>
              <div style={{ display: 'flex', justifyContent: 'space-around', margin: '20px 0' }}>
                {/* Bài viết 3 */}
                <div style={{ width: '45%', minWidth: '300px', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', marginBottom: '20px' }}>
                  <img
                    src="https://levelfyc.com/wp-content/uploads/2021/09/chen-mizrach-dmwjneu7-e-unsplash-1-2048x1152-1-460x600.jpg"
                    alt="Dinh Dưỡng Cho Người Tập Gym"
                    style={{ width: '100%', display: 'block' }}
                  />
                  <div style={{ padding: '15px' }}>
                    <h3 style={{ color: '#333', marginBottom: '8px' }}>Dinh Dưỡng Cho Người Tập Gym: Thực Đơn Tăng Cơ Giảm Mỡ</h3>
                    <p style={{ fontSize: '14px', color: '#666' }}>
                      Ăn gì trước và sau khi tập gym để đạt hiệu quả tốt nhất? Bài viết này sẽ cung cấp cho bạn thực đơn chi tiết...
                    </p>
                  </div>
                </div>

                {/* Bài viết 4 */}
                <div style={{ width: '45%', minWidth: '300px', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', marginBottom: '20px' }}>
                  <img
                    src="https://levelfyc.com/wp-content/uploads/2025/01/bai-tap-giam-mo-toan-than-8-460x600.jpg"
                    alt="Các Bài Tập Cardio Hiệu Quả"
                    style={{ width: '100%', display: 'block' }}
                  />
                  <div style={{ padding: '15px' }}>
                    <h3 style={{ color: '#333', marginBottom: '8px' }}>Các Bài Tập Cardio Hiệu Quả Giúp Đốt Cháy Calo</h3>
                    <p style={{ fontSize: '14px', color: '#666' }}>
                      Cardio là một phần không thể thiếu trong quá trình tập luyện. Bài viết này sẽ giới thiệu các bài tập cardio...
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
          <div className="row mt-3 ms-2">
            <div style={{ fontFamily: 'Arial, sans-serif' }}>
              <div style={{ display: 'flex', justifyContent: 'space-around', margin: '20px 0' }}>
                {/* Bài viết 5 */}
                <div style={{ width: '45%', minWidth: '300px', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', marginBottom: '20px' }}>
                  <img
                    src="https://levelfyc.com/wp-content/uploads/2024/10/lich-tap-gym-4-ngay-1-tuan-cho-nu-2-460x600.jpg"
                    alt="Kinh Nghiệm Tập Gym Cho Nữ"
                    style={{ width: '100%', display: 'block' }}
                  />
                  <div style={{ padding: '15px' }}>
                    <h3 style={{ color: '#333', marginBottom: '8px' }}>Kinh Nghiệm Tập Gym Cho Nữ: Bắt Đầu Như Thế Nào?</h3>
                    <p style={{ fontSize: '14px', color: '#666' }}>
                      Bạn là nữ và muốn bắt đầu tập gym nhưng chưa biết bắt đầu từ đâu? Bài viết này sẽ cung cấp cho bạn những...
                    </p>
                  </div>
                </div>

                {/* Bài viết 6 */}
                <div style={{ width: '45%', minWidth: '300px', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', marginBottom: '20px' }}>
                  <img
                    src="https://levelfyc.com/wp-content/uploads/2024/10/lich-tap-gym-5-ngay-1-tuan-cho-nam-4-460x600.jpg"
                    alt="Lịch Tập Gym 6 Ngày/Tuần"
                    style={{ width: '100%', display: 'block' }}
                  />
                  <div style={{ padding: '15px' }}>
                    <h3 style={{ color: '#333', marginBottom: '8px' }}>Lịch Tập Gym 6 Ngày/Tuần: Tăng Cơ Toàn Diện</h3>
                    <p style={{ fontSize: '14px', color: '#666' }}>
                      Bạn muốn có một lịch tập gym 6 ngày/tuần hiệu quả? Bài viết này sẽ cung cấp cho bạn một lịch tập chi tiết...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import CategorySelect from "../user-components/course/Select-Category-Course";
import SortBySelect from "../user-components/course/Select-Sort-Course";
import "./CourseList.css";
import { toast, ToastContainer } from "react-toastify";

const CoursesList = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]); // Thêm state cho filteredCourses
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isNavigating, setIsNavigating] = useState(false);
  const navigate = useNavigate();
  // State để lưu từ khóa tìm kiếm
  const coursesPerPage = 6;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/users/courses"
        ); // Chỉ lấy danh sách khóa học, không cần tham số
        const acceptedCourses = response.data.filter(
          (course) => course.status === "accepted"
        );
        setCourses(acceptedCourses); // Lưu danh sách đầy đủ vào courses
        setFilteredCourses(acceptedCourses); // Đặt giá trị ban đầu cho filteredCourses
      } catch (err) {
        setError(err.message);
        toast.error("Lỗi khi lấy danh sách khóa học");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/users/categories"
        );
        const uniqueCategories = [
          ...new Set(response.data.map((category) => category.toLowerCase())),
        ];
        setCategories(uniqueCategories); // Lưu các category duy nhất vào state
      } catch (err) {
        console.error("Lỗi khi tìm kiếm danh mục:", err);
        toast.error("Lỗi khi tìm kiếm danh mục");
      }
    };

    fetchCategories();
  }, []);

  // Lọc và sắp xếp danh sách khóa học dựa trên filterCategory và sortBy
  useEffect(() => {
    let updatedCourses = [...courses];

    // Lọc theo category nếu có
    if (typeof filterCategory === "string" && filterCategory.trim() !== "") {
      updatedCourses = updatedCourses.filter(
        (course) =>
          course.category &&
          course.category.toLowerCase() === filterCategory.toLowerCase()
      );
    }

    if (searchQuery) {
      updatedCourses = updatedCourses.filter(
        (course) =>
          course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (course.category &&
            course.category.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sắp xếp theo sortBy nếu có
    if (sortBy === "gia_tang") {
      updatedCourses.sort((a, b) => a.price - b.price); // Giá tăng dần
    } else if (sortBy === "gia_giam") {
      updatedCourses.sort((a, b) => b.price - a.price); // Giá giảm dần
    } else if (sortBy === "ten_tang") {
      updatedCourses.sort((a, b) => a.name.localeCompare(b.name)); // Tên A -> Z
    } else if (sortBy === "ten_giam") {
      updatedCourses.sort((a, b) => b.name.localeCompare(a.name)); // Tên Z -> A
    }

    setFilteredCourses(updatedCourses); // Cập nhật danh sách khóa học đã lọc và sắp xếp
  }, [filterCategory, sortBy, searchQuery, courses]);

  if (loading) return <div className="loading">Đang tải khóa học...</div>;
  if (error) return <div className="error">Lỗi: {error}</div>;

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(
    indexOfFirstCourse,
    indexOfLastCourse
  ); // Sử dụng filteredCourses
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNavigateToDetail = (courseId) => {
    setIsNavigating(true);
    // Giả lập delay loading 1 giây trước khi chuyển trang
    setTimeout(() => {
      navigate(`/course/${courseId}`);
    }, 500);
  };

  const sortOptions = [
    { value: "", label: "Không" },
    { value: "gia_tang", label: "Giá: Từ thấp đến cao" },
    { value: "gia_giam", label: "Giá: Từ cao đến thấp" },
    { value: "ten_tang", label: "Tên: Từ A đến Z" },
    { value: "ten_giam", label: "Tên: Từ Z đến A" },
  ];

  const calculateDiscountedPrice = (price, discount) => {
    if (!price || !discount) return price;
    const discountedPrice = price - (price * discount) / 100;
    return discountedPrice;
  };

  return (
    <div className="container-full">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      {isNavigating && (
        <div className="navigation-loading-overlay">
          <div className="loading-spinner"></div>
          <p>Đang tải khóa học...</p>
        </div>
      )}
      <div className="courses-list-container">
        <h1 className="courses-title">Các Khóa Học</h1>

        {/* Filter khóa học */}
        <div className="filter-container">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc danh mục"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input search-input-coures"
          />

          <CategorySelect
            categories={categories}
            selectedCategory={filterCategory}
            setSelectedCategory={setFilterCategory}
          />

          <SortBySelect
            sortOptions={sortOptions}
            selectedSort={sortBy}
            setSelectedSort={setSortBy}
          />
        </div>

        <div className="courses-container">
          {/* tesst */}
          <div className="courses-grid">
            {currentCourses.map((course) => (
              <div key={course._id} class="product-card-course">
                <img
                  class="product-image-course"
                  src={`${course.image}`}
                  alt="GYM"
                />
                <div class="product-details-course">
                  <h2 class="product-title-course">{course.name}</h2>
                  <div class="product-price">
                    <span class="current-price-course">
                      <div className="course-category mt-3">
                        {course.price ? (
                          <>
                            {course.discount && course.discount > 0 ? (
                              <>
                                <span className="old-price">
                                  {course.price.toLocaleString()} VNĐ
                                </span>
                                <span className="new-price">
                                  {calculateDiscountedPrice(
                                    course.price,
                                    course.discount
                                  ).toLocaleString()}{" "}
                                  VNĐ
                                </span>
                              </>
                            ) : (
                              <span className="new-price">
                                {course.price.toLocaleString()} VNĐ
                              </span>
                            )}
                          </>
                        ) : (
                          "No price"
                        )}
                      </div>
                      {course.discount && course.discount > 0 ? (
                        <div className="course-discount">
                          <span>Giảm giá {course.discount}%</span>
                        </div>
                      ) : null}
                    </span>
                    <div className="course-coach mt-3">
                      <strong>HLV:</strong>{" "}
                      {course.coachId ? course.coachId.name : "Unknown"}
                    </div>
                    <div className="product-category-course ml-2">
                      {course.category ? course.category : "No category"}
                    </div>
                  </div>
                  <p class="product-description-course ml-2">
                    {course.description ? course.description : "No description"}
                  </p>


                  <button
                    onClick={() => handleNavigateToDetail(course._id)}
                    className="product-btn-course"
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            ))}
          </div>
          {/*  */}
        </div>

        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            Trước
          </button>
          <span className="page-info">
            Trang {currentPage} trong {totalPages}
          </span>
          <button
            className="pagination-btn"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoursesList;

import React, { useState, useEffect, useRef } from "react";
import { fetchUserProfile } from "../../services/userService";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import logo from "../img/logo.png";
import "./Navbar.css";

function Navbar(props) {
  const [activeMenu, setActiveMenu] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const moreRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserProfile()
        .then((data) => {
          setUserName(data.name);
          setIsLoggedIn(data.role === "user");
        })
        .catch((error) => console.error("Lỗi khi tải hồ sơ người dùng:", error));
    }

    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const currentPath = location.pathname.slice(1);
    setActiveMenu(currentPath);
  }, [location.pathname]);

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
    setIsMenuOpen(false);
  };

  const toggleMoreMenu = () => {
    setIsMoreOpen(!isMoreOpen);
    setIsUserMenuOpen(false);
  };
  const handleUserClick = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    setIsSubmenuOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    setIsMoreOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        moreRef.current &&
        !moreRef.current.contains(event.target) &&
        userRef.current &&
        !userRef.current.contains(event.target)
      ) {
        setIsMoreOpen(false);
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  console.log(props.title);
  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 py-4 
        ${
          isScrolled
            ? "bg-[#151515] shadow-lg"
            : `${
                props.title !== "Sign In" && props.title !== "Sign Up"
                  ? "bg-[#151515] md:bg-transparent"
                  : ""
              }`
        }
        ${props.title === "Sign In" ? "bg-[#151515] shadow-lg" : ""}
        ${props.title === "Sign Up" ? "bg-[#151515] shadow-lg" : ""}
      `}
    >
      <div className="container-cus">
        <div className="flex items-center justify-between px-6 mx-auto">
          {/* Logo */}
          <Link to="/" onClick={() => setActiveMenu("")}>
            <img
              src={logo}
              alt="Logo"
              className="block object-cover w-full h-12 md:h-8"
            />
          </Link>

          {/* Mobile Menu Toggle */}
          <div
            className="z-20 text-3xl text-white cursor-pointer md:hidden"
            onClick={toggleMenu}
          >
            {isMenuOpen ? "✖" : "☰"}
          </div>

          {/* Overlay for mobile */}
          {isMenuOpen && (
            <div
              className="fixed inset-0 z-10 bg-black bg-opacity-50 md:hidden"
              onClick={toggleMenu}
            ></div>
          )}

          {/* Navigation */}
          <nav
            className={`${
              isMenuOpen ? "translate-x-0" : "-translate-x-full"
            } md:translate-x-0 fixed md:relative top-0 left-0 md:flex md:items-center w-3/4 md:w-auto h-full md:h-auto bg-gray-800 md:bg-transparent transition-transform duration-300 ease-in-out z-20`}
          >
            <ul className="flex flex-col items-start gap-6 p-6 text-lg md:flex-row md:items-center md:gap-10 md:p-0 font-oswald">
              {/* Main Menu Items */}
              {[
                "trang chủ",
                "HLV",
                "Khóa học",
                "bài viết",
                "liên hệ",
              ].map((menu) => {
                const path =
                  menu === "trang chủ"
                    ? ""
                    : menu === "HLV"
                    ? "coach-details"
                    : menu === "Khóa học"
                    ? "course-details"
                    : menu === "bài viết"
                    ? "blog"
                    : menu ==="liên hệ"
                    ? "contact"
                    : menu;

                const isActive = activeMenu === menu || activeMenu === path;

                return (
                  <Link
                    key={menu}
                    to={`/${path}`}
                    className={`transition-colors duration-300 hover:!text-[#F36100] ${
                      isActive
                        ? "text-[#F36100] border-b-2 border-[#F36100]"
                        : "text-white"
                    }`}
                    onClick={() => handleMenuClick(menu)}
                  >
                    {menu.charAt(0).toUpperCase() + menu.slice(1)}
                  </Link>
                );
              })}

              {/* More Dropdown */}
              <li ref={moreRef} className="relative">
                <button
                  className="px-4 py-2 text-white bg-gray-800 rounded-md transition duration-300 hover:bg-[#EA580C]"
                  onClick={toggleMoreMenu}
                >
                  More
                </button>
                {isMoreOpen && (
                  <ul className="absolute left-0 z-20 py-2 mt-2 bg-gray-900 rounded-lg shadow-2xl">
                    <li>
                      <Link
                        to="/bmi"
                        className="block px-4 py-3 text-white hover:bg-[#F36100] hover:text-gray-900 rounded-lg transition duration-300"
                        onClick={() => {
                          setIsMoreOpen(false);
                          setActiveMenu("bmi");
                        }}
                      >
                        BMI Calculator
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/calo"
                        className="block px-4 py-3 text-white hover:bg-[#F36100] hover:text-gray-900 rounded-lg transition duration-300"
                        onClick={() => {
                          setIsMoreOpen(false);
                          setActiveMenu("calo");
                        }}
                      >
                        Calories Calculator
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          </nav>

          {/* User/Login Button */}
          <div className="items-center hidden gap-4 md:flex">
            
            {!isLoggedIn ? (
              <Link
                to="/signin"
                className="px-4 py-2 text-white bg-orange-600 rounded-md hover:bg-orange-400 skew-x-[-10deg] transform"
              >
                Đăng nhập
              </Link>
            ) : (
              <div className="relative" ref={userRef}>
                <button
                  onClick={toggleUserMenu}
                  className="px-4 py-2 text-white bg-orange-600 rounded-md hover:bg-orange-400 skew-x-[-10deg] transform"
                >
                  {userName || "User"}
                </button>
                {isUserMenuOpen && (
                  <div className="absolute left-0 z-20 w-48 py-2 mt-2 bg-gray-900 rounded-lg shadow-2xl">
                    <Link
                      to="/userProfile"
                      className="block px-4 py-3 text-white hover:bg-[#F36100] hover:text-gray-900 rounded-lg transition duration-300"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Hồ sơ
                    </Link>
                    <Link
                      to="/userSchedule"
                      className="block px-4 py-3 text-white hover:bg-[#F36100] hover:text-gray-900 rounded-lg transition duration-300"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Lịch tập luyện
                    </Link>
                    <Link
                      to="/"
                      onClick={handleLogout}
                      className="block w-full px-4 py-3 text-left text-white hover:bg-[#F36100] hover:text-gray-900 rounded-lg transition duration-300"
                    >
                      Đăng xuất
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;

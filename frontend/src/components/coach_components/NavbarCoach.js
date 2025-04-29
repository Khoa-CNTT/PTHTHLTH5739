import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./NavbarCoach.css";

const NavbarCoach = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Tự động đóng sidebar trên màn hình nhỏ
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize(); // Gọi ngay khi component được mount
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize); // Dọn dẹp sự kiện
  }, []);

  return (
    <div className="navbar-container">
      {/* Nút toggle */}
      <button className="toggle-btn" onClick={toggleSidebar}>
        {isSidebarOpen ? "☰ Close" : "☰ Menu"}
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        <ul>
          <li>
            <Link to="/coach/profile">Dashboard</Link>
          </li>
          <li>
            <Link to="/coach/course">Manage Course</Link>
          </li>
          <li>
            <Link to="/coach/create-course">Create Course</Link>
          </li>
          <li>
            <Link to="/coach/exercise-bank">Manage Exercise</Link>
          </li>
          <li>
            <Link to="/coach/blog">Manage Blog</Link>
          </li>
          <li>
            <Link to="/coach/feedback">Manage feedback</Link>
          </li>
          <li>
            <Link to="/coach/subscription">Manage Subscription</Link>
          </li>
          <li>
            <Link to="/coach/revenue">Manage Revenue</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NavbarCoach;

import React, { useState, useEffect } from "react";
import Sidebar from "./SideBar";
import "./SideBarLayout.css";

const SideBarLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Tự động đóng/mở sidebar khi thay đổi kích thước màn hình
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth > 768);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="dashboard">
      {/* Sidebar và nút toggle */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Nội dung chính */}
      <div className={`content ${isSidebarOpen ? "" : "closed"}`}>
        {children}
      </div>
    </div>
  );
};

export default SideBarLayout;

import React from "react";
import { Link } from "react-router-dom";
import "./SideBar.css";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div className="sidebar-container">
      {/* Nút Toggle */}
      <button className="toggle-btn" onClick={toggleSidebar}>
        {isOpen ? "☰ Close" : "☰ Menu"}
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <h2>{isOpen ? "Dashboard" : "DB"}</h2>
        </div>
        <ul className="sidebar-menu">
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/courses">Courses</Link>
          </li>
          <li>
            <Link to="/exercise-bank">Exercise Bank</Link>
          </li>
          <li>
            <Link to="/create-course">Create New Course</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;

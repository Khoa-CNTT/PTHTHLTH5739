import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";


// Import Authen
import SignIn from "./pages/authenticate_pages/SignInPage";
import SignUp from "./pages/authenticate_pages/SignUpPage";
import ForgotPassword from "./pages/authenticate_pages/ForgotPasswordPage";
import ResetPassword from "./pages/authenticate_pages/ResetPasswordPage";

// Import Home Page
import HomePage from "./pages/user-pages/HomePage";
import AboutPage from "./pages/user-pages/AboutPage";
import BmiCalculatorPage from "./pages/user-pages/BmiCalculatorPage";
import BlogPage from "./pages/user-pages/BlogPage";
import BlogDetailPage from "./pages/user-pages/BlogDetailPage";
import ContactPage from "./pages/user-pages/ContactPage";
import CourseOverview from "./pages/user-pages/CourseOverview";


// Import User Page

import CoachListPage from "./pages/user-pages/CoachListPage";
import CoachDetailPage from "./pages/user-pages/CoachDetailPage";
import CaloriesCalculatorPage from "./pages/user-pages/CaloriesCalculatorPage";
import CourseDetailPage from "./pages/user-pages/CourseDetailPage";
import CourseListPage from "./pages/user-pages/CourseListPage";



function App() {
  return (
    <div className="app">
      <div className="content">
      <Routes>
          {/* Authen Router */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/resetpassword/:id/:token" element={<ResetPassword />} />
          {/* Home Page Router */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/bmi" element={<BmiCalculatorPage />} />
          <Route path="/calo" element={<CaloriesCalculatorPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:blogId" element={<BlogDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />

          <Route path="/coach-details" element={<CoachListPage />} />
          <Route path="/coach/:id" element={<CoachDetailPage />} />
          <Route path="/course-details" element={<CourseListPage />} />
          <Route path="/course/:id" element={<CourseDetailPage />} />

          <Route path="/course-overview" element={<CourseOverview />} />

        </Routes >
      </div>
    </div >
  );
}

export default App;

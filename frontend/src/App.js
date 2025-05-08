import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// Import Authen
import SignIn from "./pages/authenticate_pages/SignInPage";
import SignUp from "./pages/authenticate_pages/SignUpPage";
import ForgotPassword from "./pages/authenticate_pages/ForgotPasswordPage";
import ResetPassword from "./pages/authenticate_pages/ResetPasswordPage";

// Import Home Page
import HomePage from "./pages/user-pages/HomePage";
import BmiCalculatorPage from "./pages/user-pages/BmiCalculatorPage";
import BlogPage from "./pages/user-pages/BlogPage";
import BlogDetailPage from "./pages/user-pages/BlogDetailPage";
import ContactPage from "./pages/user-pages/ContactPage";

// Import User Page
import UserProfilePage from "./pages/user-pages/UserProfilePage";
import ViewSchedulePage from "./pages/user-pages/ViewSchedulePage";

import WorkoutDetailPage from "./pages/user-pages/WorkoutDetailPage";
import ChatRoomPage from "./pages/user-pages/ChatRoomPage";
import CoachListPage from "./pages/user-pages/CoachListPage";
import CoachDetailPage from "./pages/user-pages/CoachDetailPage";
import CaloriesCalculatorPage from "./pages/user-pages/CaloriesCalculatorPage";
import CourseDetailPage from "./pages/user-pages/CourseDetailPage";
import CourseListPage from "./pages/user-pages/CourseListPage";
import SubscriptionCheckoutPage from "./pages/user-pages/SubscriptionCheckoutPage";
import PaymentSuccess from "./pages/user-pages/PaymentSuccessPage";

import SubscriptionListPage from "./pages/user-pages/SubscriptionListPage";
import PreSubscriptionSurveyPage from "./pages/user-pages/PreSubscriptionSurveyPage";
import ViewSurvey from "./pages/user-pages/ViewSurveyPage";


// Import coach page
// import CoachDashboard from './pages/coach-pages/CoachDashboard';
import CoachBlog from "./pages/coach-pages/CoachBlogPage";
import CoachProfilePage from "./pages/coach-pages/CoachProfilePage";
import CoachDashboard from "./pages/coach-pages/CoachDashboard";
import CreateCourseForm from "./pages/coach-pages/CreateCourseForm";
import CourseDetailCoach from "./pages/coach-pages/CourseDetails";
import ExerciseList from "./pages/coach-pages/ExerciseCoachPage";
import ViewSubscriptionSurveyPage from "./pages/coach-pages/CoachSubscriptionSurvey";

import SubscriptionListPageCoach from "./pages/coach-pages/SubscriptionListPage";
import PreviewUserPage from "./pages/coach-pages/PreviewUserPage";

import SubscriptionDetailPageCoach from "./pages/coach-pages/SubscriptionDetailPage";
import Feedback from "./pages/coach-pages/CoachFeedbackPage";


// Import admin page
import ManageUserPage from "./pages/admin-pages/ManageUserPage";

import ManageBlog from "./pages/admin-pages/ManageBlog";
//import ManageBlogDetail from "./pages/admin-pages/ManageBlogDetail";


import ManageQuestionPage from "./pages/admin-pages/ManageQuestionPage";
import SurveyUserPage from "./pages/user-pages/SurveyUserPage";
import ManageCoachAdminPage from "./pages/admin-pages/ManageCoachPage";
import ManageCourseAdminPage from "./pages/admin-pages/ManageCoursePage";
import AdminRevenuePage from "./pages/admin-pages/AdminRevenue";

// import AdminDashboard from './pages/admin-pages/AdminDashboard';
import RevenueManagePage from "./pages/coach-pages/RevenueManagePage";
import ManageCoachQuestionPage from "./pages/coach-pages/ManageCoachQuestionPage";

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
          <Route path="/bmi" element={<BmiCalculatorPage />} />
          <Route path="/calo" element={<CaloriesCalculatorPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:blogId" element={<BlogDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* User Router */}
          <Route path="/userProfile" element={<UserProfilePage />} />
          <Route path="/userSchedule" element={<SubscriptionListPage />} />

          <Route
            path="/subscribe/payment-success"
            element={<PaymentSuccess />}
          />

          <Route
            path="/userSubscription/:subscriptionId/survey"
            element={<PreSubscriptionSurveyPage />}
          />

          <Route path='/userSubscription/:subscriptionId/workout/:workoutId' element={<WorkoutDetailPage />} />
          <Route path='/userSurvey/:subscriptionId' element={<ViewSurvey />} />
          <Route path='/chatRoom/:subscriptionId' element={<ChatRoomPage />} />
          <Route path='/userSurvey/:subscriptionId' element={<ViewSurvey />} />
          <Route path='/workout/:workoutId' element={<WorkoutDetailPage />} />
          <Route
            path="/userSchedule/:subscriptionId"
            element={<ViewSchedulePage />}
          />

          <Route path="/workout/:workoutId" element={<WorkoutDetailPage />} />
          <Route path="/userSurvey/:subscriptionId" element={<ViewSurvey />} />
          <Route path="/chatRoom/:subscriptionId" element={<ChatRoomPage />} />
          <Route path="/userSurvey/:subscriptionId" element={<ViewSurvey />} />
          <Route path="/workout/:workoutId" element={<WorkoutDetailPage />} />

          <Route path="/coach-details" element={<CoachListPage />} />
          <Route path="/coach/:id" element={<CoachDetailPage />} />
          <Route path="/course-details" element={<CourseListPage />} />
          <Route path="/course/:id" element={<CourseDetailPage />} />
          <Route
            path="/subscriptionCheckout"
            element={<SubscriptionCheckoutPage />}
          />

          <Route path="/survey" element={<SurveyUserPage />} />


          {/* Coach Router */}
          <Route path="/coach/profile" element={<CoachProfilePage />} />
          <Route path="/coach/blog" element={<CoachBlog />} />
          <Route path="/coach/feedback" element={<Feedback />} />
          <Route path="/coach" element={<CoachDashboard />} />
          <Route path="/coach/course" element={<CoachDashboard />} />
          <Route path="/coach/question" element={<ManageCoachQuestionPage />} />
          <Route path="/coach/create-course" element={<CreateCourseForm />} />
          <Route
            path="/coach/detail-course/:courseId"
            element={<CourseDetailCoach />}
          />
          <Route path="/coach/exercise-bank/" element={<ExerciseList />} />
          <Route
            path="/coach/subscription/:subscriptionId/userSurvey"
            element={<ViewSubscriptionSurveyPage />}
          />
          <Route
            path="/coach/subscription/:subscriptionId"
            element={<SubscriptionDetailPageCoach />}
          />
          <Route
            path="/preview/:subscriptionId"
            element={<PreviewUserPage />}
          />
          <Route
            path="/coach/subscription"
            element={<SubscriptionListPageCoach />}
          />
          <Route path="/coach/revenue" element={<RevenueManagePage />} />

          {/* Admin Router */}
          <Route path="/admin/blog" element={<ManageBlog />} />
          {/* <Route path="/admin/blog/:id" element={<ManageBlogDetail />} /> */}


          <Route path="/admin/user" element={<ManageUserPage />} />

          <Route path="/admin/coach" element={<ManageCoachAdminPage />} />
          <Route path="/admin/course" element={<ManageCourseAdminPage />} />
          <Route path="/admin/revenue" element={<AdminRevenuePage />} />
          <Route path="/admin/question" element={<ManageQuestionPage />} />
        </Routes >
      </div >
    </div >
  );
}

export default App;

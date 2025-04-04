import React from "react";
import Navbar from "../../components/user-components/Navbar";
import Footer from "../../components/user-components/Footer";
import PageHeader from "../../components/user-components/PageHeader";
import CourseDetail from "../../components/user-components/CourseDetail";

export default function CourseDetailPage() {
  return (
    <>
      <Navbar />
      <PageHeader title="Chi tiết khóa học" readOnly />
      <CourseDetail />
      <Footer />
    </>
  );
}

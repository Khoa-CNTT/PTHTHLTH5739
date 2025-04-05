import React from "react";
import Navbar from "../../components/user-components/Navbar";
import Footer from "../../components/user-components/Footer";
// import PageHeader from "../../components/user-components/PageHeader";
import CourseOverview from "../../components/user-components/CourseOverview";

export default function CourseDetailPage() {
  return (
    <>
      <Navbar />
      {/* <PageHeader title="Course Overview" readOnly /> */}
      <CourseOverview />
      <Footer />
    </>
  );
}

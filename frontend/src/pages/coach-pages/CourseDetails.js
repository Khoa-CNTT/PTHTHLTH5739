import React from "react";
import CourseDetail from "../../components/coach_components/CourseDetails";
import CoachDashboardLayout from '../../components/coach_components/CoachDashboardLayout';

export default function CourseDetailForm() {
  return (
    <>
      <CoachDashboardLayout>
        <CourseDetail />
      </CoachDashboardLayout>
    </>
  );
}

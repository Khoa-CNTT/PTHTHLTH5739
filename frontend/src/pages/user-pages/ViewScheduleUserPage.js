import React from "react";
import ViewSchedules from "../../components/user-components/ViewSchedules";
import Navbar from "../../components/user-components/Navbar";
import PageHeader from "../../components/user-components/PageHeader";
import Footer from "../../components/user-components/Footer";
import HorizontalMenu from "../../components/user-components/HorizontalMenu";

export default function ViewScheduleUserPage() {
  return (
    <>
      <Navbar />
      <PageHeader title="View Schedule" readOnly />
      <HorizontalMenu />
      <ViewSchedules />
      <Footer />
    </>
  );
}

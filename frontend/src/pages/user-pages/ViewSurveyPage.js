import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/user-components/Navbar";
import Footer from "../../components/user-components/Footer";
import PageHeader from "../../components/user-components/PageHeader";
import HorizontalMenu from "../../components/user-components/HorizontalMenu";
import ViewSurveyPage from "../../components/user-components/ViewSurvey";

export default function ViewSurvey() {
  return (
    <>
      <Navbar />
      <PageHeader title="Chi tiết khảo sát" readOnly />
      <HorizontalMenu />
      <ViewSurveyPage />
      <Footer />
    </>
  );
}

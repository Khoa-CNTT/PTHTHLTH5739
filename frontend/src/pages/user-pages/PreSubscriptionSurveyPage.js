import React from "react";
import Navbar from "../../components/user-components/Navbar";
import Footer from "../../components/user-components/Footer";
import PageHeader from "../../components/user-components/PageHeader";
import PreSubscriptionSurvey from "../../components/user-components/PreSubscriptionSurvey";

export default function SubscriptionSurveyUser() {
  return (
    <>
      <Navbar />
      <PageHeader title="Khảo sát đăng ký" readOnly />
      <PreSubscriptionSurvey />
      <Footer />
    </>
  );
}

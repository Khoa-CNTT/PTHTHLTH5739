import React from "react";
import Navbar from "../../components/user-components/Navbar";
import Footer from "../../components/user-components/Footer";
import PageHeader from "../../components/user-components/PageHeader";
import SignUp from "../../components/authenticate_components/SignUp";

export default function SignUpPage() {
  return (
    <> 
      <Navbar title="Sign Up" />
      {/* <PageHeader title="Sign Up" readOnly /> */}
      <SignUp />
      <Footer />
    </>
  );
}

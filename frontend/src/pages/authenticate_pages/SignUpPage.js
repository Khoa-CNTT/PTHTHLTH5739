import React from "react";
import Navbar from "../../components/user-components/Navbar";
import Footer from "../../components/user-components/Footer";
import SignUp from "../../components/authenticate_components/SignUp";

export default function SignUpPage() {
  return (
    <>
      <Navbar title="Sign Up" />
      <SignUp />
      <Footer />
    </>
  );
}

import React from "react";
import Navbar from "../../components/user-components/Navbar";
import Footer from "../../components/user-components/Footer";
import SignIn from "../../components/authenticate_components/SignIn";

export default function SignInPage() {
  return (
    <>
      <Navbar title="Sign In" />
      <SignIn />
      <Footer />
    </>
  );
}

import React from "react";
import Navbar from "../../components/user-components/Navbar";
import Footer from "../../components/user-components/Footer";
import PageHeader from "../../components/user-components/PageHeader";
import SignIn from "../../components/authenticate_components/SignIn";

export default function SignInPage() {
  return (
    <> 
      <Navbar title="Sign In" />
      {/* <PageHeader title="Sign In" readOnly /> */}
      <SignIn />
      <Footer />
    </>
  );
}

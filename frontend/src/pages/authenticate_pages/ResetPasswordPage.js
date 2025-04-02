import React from 'react'
import Navbar from '../../components/user-components/Navbar';
import Footer from '../../components/user-components/Footer';
import PageHeader from "../../components/user-components/PageHeader";
import ResetPassword from '../../components/authenticate_components/ResetPassword';

export default function ResetPasswordPage() {
    return (
        <>
            <Navbar />
            <PageHeader title="Reset Password" readOnly />
            <ResetPassword />
            <Footer />
        </>
    )
}
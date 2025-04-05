import React from 'react'
import Navbar from '../../components/user-components/Navbar';
import Footer from '../../components/user-components/Footer';
import PageHeader from "../../components/user-components/PageHeader";
import Contact from '../../components/user-components/Contact';

export default function ContactPage() {
    return (
        <>
            <Navbar />
            <PageHeader title="Liên hệ" readOnly />
            <Contact />
            <Footer />
        </>
    )
}
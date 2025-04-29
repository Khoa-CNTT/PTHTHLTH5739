import React from 'react'
import Navbar from '../../components/user-components/Navbar';
import Footer from '../../components/user-components/Footer';
import PageHeader from "../../components/user-components/PageHeader";
import ManageCourse from '../../components/coach_components/ManageCourse';

export default function BmiCalculatorPage() {
    return (
        <>
            <Navbar />
            <PageHeader title="Manage Course" readOnly />
            <ManageCourse />
            <Footer />
        </>
    )
}
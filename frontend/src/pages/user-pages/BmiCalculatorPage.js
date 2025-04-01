import React from 'react'
import Navbar from '../../components/user-components/Navbar';
import Footer from '../../components/user-components/Footer';
import PageHeader from "../../components/user-components/PageHeader";
import BmiCalculator from '../../components/user-components/BmiCalculator';

export default function BmiCalculatorPage() {
    return (
        <>
            <Navbar />
            <PageHeader title="BMI Calculator" readOnly />
            <BmiCalculator />
            <Footer />
        </>
    )
}
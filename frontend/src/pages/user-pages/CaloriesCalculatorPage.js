import React from 'react'
import Navbar from '../../components/user-components/Navbar';
import Footer from '../../components/user-components/Footer';
import PageHeader from "../../components/user-components/PageHeader";
import CaloriesCalculator from '../../components/user-components/CaloriesCalculator';

export default function CaloriesCalculatorPage() {
    return (
        <>
            <Navbar />
            <PageHeader title="Calories Calculator" readOnly />
            <CaloriesCalculator />
            <Footer />
        </>
    )
}
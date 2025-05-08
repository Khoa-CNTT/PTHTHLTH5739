import React from 'react'
import Navbar from '../../components/user-components/Navbar';
import Footer from '../../components/user-components/Footer';
import PageHeader from "../../components/user-components/PageHeader";
import WorkoutDetails from '../../components/user-components/WorkoutDetails';
import HorizontalMenu from '../../components/user-components/HorizontalMenu';

export default function ViewSchedulePage() {
    return (
        <>
            <Navbar />
            <PageHeader title="Chi tiết tập luyện" readOnly />
            <HorizontalMenu />
            <WorkoutDetails />
            <Footer />
        </>
    )
}

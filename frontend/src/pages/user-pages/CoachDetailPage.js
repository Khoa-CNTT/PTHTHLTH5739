import React from 'react'
import Navbar from '../../components/user-components/Navbar';
import Footer from '../../components/user-components/Footer';
import PageHeader from "../../components/user-components/PageHeader";
import CoachDetail from '../../components/user-components/CoachesDetail';


export default function BlogPage() {
    return (
        <>
            <Navbar />
            <PageHeader title="Chi tiết HLV" readOnly />
            <CoachDetail />
            <Footer />
        </>
    )
}

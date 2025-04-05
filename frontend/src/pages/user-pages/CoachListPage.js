import React from 'react'
import Navbar from '../../components/user-components/Navbar';
import Footer from '../../components/user-components/Footer';
import PageHeader from "../../components/user-components/PageHeader";
import CoachList from '../../components/user-components/CoachesList';


export default function BlogPage() {
    return (
        <>
            <Navbar />
            <PageHeader title="Danh sách HLV" readOnly />
            <CoachList />
            <Footer />
        </>
    )
}

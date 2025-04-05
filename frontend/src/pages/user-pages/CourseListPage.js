import React from 'react'
import Navbar from '../../components/user-components/Navbar';
import Footer from '../../components/user-components/Footer';
import PageHeader from "../../components/user-components/PageHeader";
import CourseList from '../../components/user-components/CourseList';

export default function CourseDetailPage() {
    return (
        <>
            <Navbar />
            <PageHeader title="Danh sách khóa học" readOnly />
            <CourseList />
            <Footer />
        </>
    )
}
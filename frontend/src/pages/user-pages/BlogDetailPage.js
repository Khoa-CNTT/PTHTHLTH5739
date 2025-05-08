import React from 'react'
import Navbar from '../../components/user-components/Navbar';
import Footer from '../../components/user-components/Footer';
import PageHeader from "../../components/user-components/PageHeader";
import BlogDetail from '../../components/user-components/BlogDetail';


export default function BlogDetailPage() {
    return (
        <>
            <Navbar />
            <PageHeader title="Chi tiết bài viết" readOnly />
            <BlogDetail />
            <Footer /> 
        </>
    )
}

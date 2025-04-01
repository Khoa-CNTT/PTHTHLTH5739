
import React from 'react'
import Navbar from '../../components/user-components/Navbar';
import Footer from '../../components/user-components/Footer';
import PageHeader from "../../components/user-components/PageHeader";
import Blog from '../../components/user-components/Blog';


export default function BlogPage() {
    return (
        <>
            <Navbar />
            <PageHeader title="Blog" readOnly />
            <Blog />
            <Footer />
        </>
    )
}

import React from 'react'
import Navbar from '../../components/user-components/Navbar';
import Footer from '../../components/user-components/Footer';
import PageHeader from "../../components/user-components/PageHeader";
import SubscriptionList from '../../components/user-components/SubscriptionList';

export default function SubscriptionListPage() {
    return (
        <>
            <Navbar />
            <PageHeader title="Danh sách đăng ký" readOnly />
            <SubscriptionList />
            <Footer />
        </>
    )
}
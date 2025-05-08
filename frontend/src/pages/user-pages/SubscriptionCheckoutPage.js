import React from 'react'
import Navbar from '../../components/user-components/Navbar';
import Footer from '../../components/user-components/Footer';
import PageHeader from "../../components/user-components/PageHeader";
import SubscriptionCheckout from '../../components/user-components/SubscriptionCheckout';

export default function SubscriptionCheckoutPage() {
    return (
        <>
            <Navbar />
            <PageHeader title="Thanh toán" readOnly />
            <SubscriptionCheckout />
            <Footer />
        </>
    )
}
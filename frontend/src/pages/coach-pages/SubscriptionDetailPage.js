import React from "react";
import SubscriptionDetail from "../../components/coach_components/SubscriptionDetail";
import NavbarCoach from '../../components/coach_components/NavbarCoach'
import CoachDashboardLayout from '../../components/coach_components/CoachDashboardLayout';

export default function SubscriptionDetailPage() {
    return (
        <>
            <CoachDashboardLayout>
            <SubscriptionDetail />

            </CoachDashboardLayout>
        </>
    );
}

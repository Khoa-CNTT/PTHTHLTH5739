import React from 'react';
import SubscriptionList from '../../components/coach_components/SubscriptionList';
import NavbarCoach from '../../components/coach_components/NavbarCoach';
import CoachDashboardLayout from '../../components/coach_components/CoachDashboardLayout';

export default function SubscriptionListPage() {
	return (
		<CoachDashboardLayout>
			<SubscriptionList />
		</CoachDashboardLayout>
	);
}

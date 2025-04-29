import React from 'react';
import RevenueManage from '../../components/coach_components/RevenueManage';
import NavbarCoach from '../../components/coach_components/NavbarCoach';
import CoachDashboardLayout from '../../components/coach_components/CoachDashboardLayout';

export default function RevenueManagePage() {
	return (
		<CoachDashboardLayout>
			<RevenueManage />
		</CoachDashboardLayout>
	);
}

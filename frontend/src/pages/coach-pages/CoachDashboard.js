import React from 'react';
import Dashboard from '../../components/coach_components/CoachDashboard';
import NavbarCoach from '../../components/coach_components/NavbarCoach';
import CoachDashboardLayout from '../../components/coach_components/CoachDashboardLayout';

export default function CoachDasboard() {
	return (

		<CoachDashboardLayout>
			<Dashboard />
		</CoachDashboardLayout>

	);
}

import React from 'react'
import NavbarCoach from '../../components/coach_components/NavbarCoach';
import CoachProfile from '../../components/coach_components/CoachProfile';
import CoachDashboardLayout from '../../components/coach_components/CoachDashboardLayout';

export default function CoachProfilePage() {
	return (
		<CoachDashboardLayout>
			<CoachProfile />
		</CoachDashboardLayout>

	);
}

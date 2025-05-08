import React from 'react'
import CoachProfile from '../../components/coach_components/CoachProfile';
import CoachDashboardLayout from '../../components/coach_components/CoachDashboardLayout';

export default function CoachProfilePage() {
	return (
		<CoachDashboardLayout>
			<CoachProfile />
		</CoachDashboardLayout>

	);
}

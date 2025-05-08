import React from 'react';
import ExerciseList from '../../components/coach_components/ExerciseList';
import CoachDashboardLayout from '../../components/coach_components/CoachDashboardLayout';

export default function ExerciseCoachPage() {
	return (
		<CoachDashboardLayout>
			<ExerciseList />
		</CoachDashboardLayout>
	);
}

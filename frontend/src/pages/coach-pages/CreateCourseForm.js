import React from 'react';
import Form from '../../components/coach_components/CreateCourseForm';
import NavbarCoach from '../../components/coach_components/NavbarCoach';
import CoachDashboardLayout from '../../components/coach_components/CoachDashboardLayout';
export default function FormCreateCourse() {
	return (
		<CoachDashboardLayout>
			<Form />
		</CoachDashboardLayout>
	);
}

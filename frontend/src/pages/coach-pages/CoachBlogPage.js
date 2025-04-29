import React from 'react';
import CoachBlog from '../../components/coach_components/CoachBlog';
import CoachDashboardLayout from '../../components/coach_components/CoachDashboardLayout';

export default function CoachBlogPage() {
	return (

		<CoachDashboardLayout>
			<CoachBlog />
		</CoachDashboardLayout>
	);
}

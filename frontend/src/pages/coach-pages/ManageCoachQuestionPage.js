import React, { useState } from 'react';
import ManageQuestionCoach from '../../components/coach_components/ManageQuestionCoach';
import CoachDashboardLayout from '../../components/coach_components/CoachDashboardLayout';

const ManageCoachQuestionPage = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	// Toggle sidebar function
	const toggleSidebar = () => setIsSidebarOpen((prevState) => !prevState);
	return (
		// <div className='flex'>
		// 	<Navbar isSidebarOpen={isSidebarOpen} />

		// </div>
		<CoachDashboardLayout>
			{/* Nội dung của trang Manage User */}
			<ManageQuestionCoach toggleSidebar={toggleSidebar} />
		</CoachDashboardLayout>
	);
};

export default ManageCoachQuestionPage;

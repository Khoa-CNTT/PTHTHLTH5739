import React, { useState } from 'react';
import ManagerQuestion from '../../components/admin_components/ManageQuestion';
import AdminDashboardLayout from '../../components/admin_components/AdminDashboardLayout';

const ManageQuestionPage = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	// Toggle sidebar function
	const toggleSidebar = () => setIsSidebarOpen((prevState) => !prevState);
	return (

		<AdminDashboardLayout>
			{/* Nội dung của trang Manage User */}
			<ManagerQuestion toggleSidebar={toggleSidebar} />
		</AdminDashboardLayout>
	);
};

export default ManageQuestionPage;

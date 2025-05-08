import React, { useState } from 'react';
import ManageBlog from '../../components/admin_components/AdminBlog';
import AdminDashboardLayout from '../../components/admin_components/AdminDashboardLayout';

const ManageCoachAdminPage = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	// Toggle sidebar function
	const toggleSidebar = () => setIsSidebarOpen((prevState) => !prevState);
	return (
		<AdminDashboardLayout>
			{/* Nội dung của trang Manage User */}
			<ManageBlog toggleSidebar={toggleSidebar} />
		</AdminDashboardLayout>
	);
};

export default ManageCoachAdminPage;

import React, { useState } from 'react';
import ManageBlog from '../../components/admin_components/AdminBlog';
import AdminDashboardLayout from '../../components/admin_components/AdminDashboardLayout';

const ManageCoachAdminPage = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	// Toggle sidebar function
	const toggleSidebar = () => setIsSidebarOpen((prevState) => !prevState);
	return (
		// <div className='flex'>
		// 	<Navbar isSidebarOpen={isSidebarOpen} />
		// 	<ManageBlog toggleSidebar={toggleSidebar} />
		// </div>
		<AdminDashboardLayout>
			{/* Nội dung của trang Manage User */}
			<ManageBlog toggleSidebar={toggleSidebar} />
		</AdminDashboardLayout>
	);
};

export default ManageCoachAdminPage;

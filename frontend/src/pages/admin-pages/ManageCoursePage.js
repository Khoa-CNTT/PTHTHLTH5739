import React, { useState } from 'react';
import ManageCourseAdmin from '../../components/admin_components/ManageCourseAdmin';
import AdminDashboardLayout from '../../components/admin_components/AdminDashboardLayout';

const ManageCourseAdminPage = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	// Toggle sidebar function
	const toggleSidebar = () => setIsSidebarOpen((prevState) => !prevState);
	return (
		// <div className='flex'>
		// 	<Navbar isSidebarOpen={isSidebarOpen} />
		// 	<ManageCourseAdmin toggleSidebar={toggleSidebar} />
		// </div>
		<AdminDashboardLayout>
			{/* Nội dung của trang Manage User */}
			<ManageCourseAdmin toggleSidebar={toggleSidebar} />
		</AdminDashboardLayout>

	);
};

export default ManageCourseAdminPage;

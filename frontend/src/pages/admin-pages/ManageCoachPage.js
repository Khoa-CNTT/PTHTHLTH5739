import React, { useState } from 'react';
import ManageCoachAdmin from '../../components/admin_components/ManageCoachAdmin';
import AdminDashboardLayout from '../../components/admin_components/AdminDashboardLayout';

const ManageCoachAdminPage = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	// Toggle sidebar function
	const toggleSidebar = () => setIsSidebarOpen((prevState) => !prevState);
	return (
		// <div className='flex'>
		// 	<Navbar isSidebarOpen={isSidebarOpen} />
		// 	<ManageCoachAdmin toggleSidebar={toggleSidebar} />
		// </div>
		<AdminDashboardLayout>
			{/* Nội dung của trang Manage User */}
			<ManageCoachAdmin toggleSidebar={toggleSidebar} />
		</AdminDashboardLayout>
	);
};

export default ManageCoachAdminPage;

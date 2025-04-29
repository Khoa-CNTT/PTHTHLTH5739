import React, { useState } from 'react';
import ManageOrder from '../../components/admin_components/AdminOrders';
import AdminDashboardLayout from '../../components/admin_components/AdminDashboardLayout';

const ManageOrderAdminPage = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	// Toggle sidebar function
	const toggleSidebar = () => setIsSidebarOpen((prevState) => !prevState);
	return (
		// <div className='flex'>
		// 	<Navbar isSidebarOpen={isSidebarOpen} />
		// 	<div className='w-full h-full bg-white orders-page'>
		// 		<ManageOrder toggleSidebar={toggleSidebar} />
		// 	</div>
		// </div>
		<AdminDashboardLayout>
			{/* Nội dung của trang Manage User */}
			<ManageOrder toggleSidebar={toggleSidebar} />
		</AdminDashboardLayout>

	);
};

export default ManageOrderAdminPage;

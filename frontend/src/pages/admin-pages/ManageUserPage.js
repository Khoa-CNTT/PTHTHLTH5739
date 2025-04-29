import React, { useState } from 'react';
import AdminDashboardLayout from '../../components/admin_components/AdminDashboardLayout';  // Đảm bảo import đúng AdminDashboardLayout
import ManagerUser from '../../components/admin_components/ManageUserAdmin';  // Component quản lý người dùng

const ManageUserPage = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	// Toggle sidebar function
	const toggleSidebar = () => setIsSidebarOpen((prevState) => !prevState);

	return (
		<AdminDashboardLayout>
			{/* Nội dung của trang Manage User */}
			<ManagerUser toggleSidebar={toggleSidebar} />
		</AdminDashboardLayout>
	);
};

export default ManageUserPage;

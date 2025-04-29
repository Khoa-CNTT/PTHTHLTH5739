import React, { useState } from 'react';
import ManageBlogDetail from '../../components/admin_components/AdminBlogDetail';
import AdminDashboardLayout from '../../components/admin_components/AdminDashboardLayout';

const ManageCoachAdminPage = () => {
    return (
        <>
            <AdminDashboardLayout>
                {/* Nội dung của trang Manage User */}
                <ManageBlogDetail />
            </AdminDashboardLayout>
        </>
    );
};

export default ManageCoachAdminPage;

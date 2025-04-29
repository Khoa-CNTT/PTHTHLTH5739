import React, { useState } from "react";
import AdminRevenue from "../../components/admin_components/AdminRevenue";
import AdminDashboardLayout from "../../components/admin_components/AdminDashboardLayout";

const AdminRevenuePage = () => {
  return (
    <>
      <AdminDashboardLayout>
        {/* Nội dung của trang Manage User */}
        <AdminRevenue />
      </AdminDashboardLayout>
    </>
  );
};

export default AdminRevenuePage;

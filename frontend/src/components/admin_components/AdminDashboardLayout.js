import React from 'react';
import { Box, Container } from '@mui/material';
import Sidebar from '../admin_components/SideBar';

const AdminDashboardLayout = ({ children }) => {
    return (
        <Box sx={{ display: 'flex', bgcolor: '#E7E8EB', minHeight: '100vh', color: '#fff' }}>
            {/* Sidebar */}
            <Box sx={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: 250 }}>
                <Sidebar />
            </Box>

            <Box sx={{ flex: 1, p: 3, ml: 30 }}>

                {/* Content Section: where you can put child components */}
                <Container >
                    {children}
                </Container>
            </Box>
        </Box>
    );
};

export default AdminDashboardLayout;

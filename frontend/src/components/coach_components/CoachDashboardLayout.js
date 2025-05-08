import React from 'react';
import { Box, Container } from '@mui/material';
import SidebarCoach from './SideBarCoach/SideBarCoach';


const CoachDashboardLayout = ({ children }) => {
    return (
        <Box sx={{ display: 'flex', bgcolor: '#adadad', minHeight: '100vh', color: '#fff' }}>
            {/* Sidebar */}
            <Box sx={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: 250 }}>
                <SidebarCoach />
            </Box>

            <Box sx={{ flex: 1, p: 3, ml: 30 }}>

                {/* Phần Nội dung: nơi đặt các thành phần con */}
                <Container >
                    {children}
                </Container>
            </Box>
        </Box>
    );
};

export default CoachDashboardLayout;

// components/Sidebar.js
import React, { useState } from 'react';
import { Box, List, ListItemButton, ListItemText, Typography, Avatar, Menu, MenuItem, IconButton } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../img/logo.png';

const SidebarCoach = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const location = useLocation(); // Hook to get the current location
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);


    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        setIsMenuOpen(!isMenuOpen); // Thay đổi trạng thái menu khi click
    };
    const handleMenuClose = () => {
        setIsMenuOpen(false); // Đóng menu khi rời khỏi
        setAnchorEl(null);
    };
    const handleClose = () => {
        navigate('/signin');
    };

    const menuItems = {
        'Quản lý khóa học': '/coach/course',
        'Quản lý bài tập': '/coach/exercise-bank',
        'Quản lý blog': '/coach/blog',
        'Quản lý đăng ký': '/coach/subscription',
        'Quản lý doanh thu': '/coach/revenue',
        'Quản lý câu hỏi': '/coach/question',
        'Quản lý phản hồi': '/coach/feedback',

    };

    return (
        <Box
            sx={{
                width: 250,
                bgcolor: '#2a2a3b',
                p: 2,
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100vh',
            }}
        >
            {/* Logo và Tên */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <img
                    src={logo}
                    alt="Logo"
                    className="object-contain"
                    style={{ width: 'auto', height: '32px' }} // Đảm bảo chiều cao ảnh là 32px
                />
            </Box>

            {/* Danh sách Menu */}
            <Box sx={{ flex: 1 }}>
                <List>
                    {Object.entries(menuItems).map(([text, path]) => (
                        <ListItemButton
                            key={text}
                            component={Link}
                            to={path}
                            sx={{
                                color: location.pathname === path ? '#F36100' : 'white', // Text color when active
                                bgcolor: location.pathname === path ? '#1F1F2D' : 'transparent', // Background color when active
                                '&:hover': {
                                    bgcolor: '#1F1F2D', // Keep the same background on hover
                                    color: '#F36100', // Change color to orange on hover
                                },
                            }}
                        >
                            <ListItemText primary={text} />
                        </ListItemButton>
                    ))}
                </List>
            </Box>

            {/* Thông tin người dùng */}
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar alt="User Avatar" src="/path/to/avatar.jpg" /> {/* Thay đường dẫn ảnh */}
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1">Coach</Typography>
                    <Typography variant="body2" color="#566b9b">
                        @coach01
                    </Typography>
                </Box>
                <IconButton onClick={handleClick} sx={{ color: 'white' }}>
                    <ExpandMore />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    // open={Boolean(anchorEl)}
                    // onClose={handleClose}
                    open={isMenuOpen}
                    onClose={handleMenuClose}
                    PaperProps={{
                        style: {
                            backgroundColor: '#b85d02',
                            color: 'white',
                            minWidth: 150,
                        },
                    }}
                >
                    <MenuItem
                        onClick={() => navigate('/coach/profile')}
                        sx={{ color: 'white', '& .MuiMenuItem-root': { color: 'white' } }} // Đảm bảo màu chữ trắng
                    >
                        Hồ sơ
                    </MenuItem>

                    {/* <MenuItem
                        onClick={handleClose}
                        sx={{ color: 'white', '& .MuiMenuItem-root': { color: 'white' } }} // Đảm bảo màu chữ trắng
                    >
                        Settings
                    </MenuItem> */}

                    <MenuItem
                        onClick={() => {
                            handleClose();
                        }}
                        sx={{ color: 'white', '& .MuiMenuItem-root': { color: 'white' } }} // Đảm bảo màu chữ trắng
                    >
                        Đăng xuất
                    </MenuItem>
                </Menu>

            </Box>
        </Box>
    );
};

export default SidebarCoach;

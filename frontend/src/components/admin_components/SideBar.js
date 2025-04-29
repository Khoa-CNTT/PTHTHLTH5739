// components/Sidebar.js
import React, { useState } from 'react';
import { Box, List, ListItemButton, ListItemText, Typography, Avatar, Menu, MenuItem, IconButton } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../img/logo.png';

const Sidebar = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const location = useLocation();
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
        'Quản lý người dùng': '/admin/user',
        'Quản lý HLV': '/admin/coach',
        'Quản lý khóa học': '/admin/course',
        'Quản lý bài viết': '/admin/blog',
        'Quản lý doanh thu': '/admin/revenue',
        //'Quản lý câu hỏi': '/admin/question',
    };

    return (
        <Box
            sx={{
                width: 250,
                bgcolor: '#1B1B2A',
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
                    <Typography variant="subtitle1">Admin</Typography>
                    <Typography variant="body2" color="#566b9b">
                        @admin01
                    </Typography>
                </Box>
                <IconButton onClick={handleClick} sx={{ color: 'white' }}>
                    <ExpandMore />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    //open={Boolean(anchorEl)}
                    open={isMenuOpen}
                    onClose={handleMenuClose}
                    //onClose={handleClose}
                    PaperProps={{
                        style: {
                            backgroundColor: '#b84c04',
                            //color: 'white',
                            minWidth: 150,
                        },
                    }}
                >
                    {/* <MenuItem onClick={handleClose}>Profile</MenuItem>
                    <MenuItem onClick={handleClose}>Settings</MenuItem> */}
                    <MenuItem
                        onClick={() => {
                            handleClose();

                        }}
                    >
                        Đăng xuất
                    </MenuItem>
                </Menu>
            </Box>
        </Box>
    );
};

export default Sidebar;

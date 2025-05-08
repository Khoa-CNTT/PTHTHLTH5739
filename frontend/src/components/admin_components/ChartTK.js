import React from 'react';
import { Box, Typography } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Đăng ký các thành phần biểu đồ cho Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Dữ liệu mẫu cho biểu đồ, đảm bảo đúng kiểu dữ liệu
// const labels = ['Activate User', 'Blocked Users', 'Non-Activate User'];

const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        x: {
            grid: {
                display: false, // Ẩn grid dọc
            },
            ticks: {
                color: 'black', // Màu của chữ
            },
        },
        y: {
            display: false, // Ẩn trục Y
        },
    },
    plugins: {
        legend: {
            display: true, // Ẩn chú thích
        },
        tooltip: {
            enabled: true,
            backgroundColor: '#333', // Màu nền cho tooltip
            titleColor: '#fff',
            bodyColor: '#fff',
        },
    },
};

const ChartTK = ({ title, active, block, non, label1, label2, label3 }) => {
    const dataValues = [active, block, non];
    const labels = [label1, label2, label3]
    // Định nghĩa màu sắc cho từng cột
    const backgroundColors = ['#4CAF50', '#F44336', '#C0C0C0']; // Màu vàng cho "Artist", màu cam cho "User"

    // Định nghĩa dữ liệu biểu đồ để sử dụng đúng kiểu dữ liệu
    const chartData = {
        labels,
        datasets: [
            {
                label: 'Tài khoản',
                data: dataValues,
                backgroundColor: backgroundColors, // Áp dụng màu sắc cho từng cột
                borderRadius: 10, // Làm bo góc trên của các thanh
            },
        ],
    };

    return (
        <Box sx={{ bgcolor: '#fff', p: 3, borderRadius: 2, textAlign: 'center', height: 250, width: 1120 }}>
            <Typography variant="subtitle1" sx={{ color: 'black', fontWeight: 'bold', mb: 1 }}>{title}</Typography>
            <Box sx={{height: 150 }}>
                <Bar data={chartData} options={options} />
            </Box>
            <Typography variant="h6" sx={{ color: 'black', mt: 5 }}>Tổng :</Typography>
            <Typography variant="h4" sx={{ color: 'black', fontWeight: 'bold' }}>{active + block + non}</Typography>
        </Box>
    );
};

export default ChartTK;

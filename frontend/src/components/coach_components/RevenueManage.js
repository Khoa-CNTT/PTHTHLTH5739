import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Modal, Button, Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./RevenueManage.css";
import { Container, Grid, Paper, Typography } from '@mui/material';

const RevenueManage = () => {
    const [revenueData, setRevenueData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalSubscriptions, setTotalSubscriptions] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/coaches/revenue",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setRevenueData(response.data.subscriptions);
        setTotalRevenue(response.data.totalRevenue);
        setTotalSubscriptions(response.data.totalSubscriptions);
        setTotalCourses(response.data.totalCourses);
        setChartData(response.data.chartData);
        setCourses(response.data.courses);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      }
    };

    fetchRevenueData();
  }, []);


  return (
    <Container>
      <h2 className="text-3xl font-bold mb-8" style={{ color: '#000' }}>
        Quản lý doanh thu
      </h2>

      <Grid container spacing={3} sx={{ marginBottom: '30px' }}>
        {/* Total Revenue Card */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ padding: 3, backgroundColor: '#E7E8EB', color: 'black', textAlign: 'center' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Tổng doanh thu
            </Typography>
            <Typography variant="h5">
              {totalRevenue.toLocaleString()} VND
            </Typography>
          </Paper>
        </Grid>

        {/* Total Subscriptions Card */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ padding: 3, backgroundColor: '#E7E8EB', color: 'black', textAlign: 'center' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Tổng số đăng ký
            </Typography>
            <Typography variant="h5">
              {totalSubscriptions}
            </Typography>
          </Paper>
        </Grid>

        {/* Total Courses Card */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ padding: 3, backgroundColor: '#E7E8EB', color: 'black', textAlign: 'center' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Tổng số khóa học
            </Typography>
            <Typography variant="h5">
              {totalCourses}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Paper elevation={3} sx={{ padding: 3, marginBottom: '30px', backgroundColor: '#E7E8EB' }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: '#333' }}>
          Số lượt mua hàng tháng theo khóa học
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="monthYear" style={{ color: '#555' }} />
            <YAxis style={{ color: '#555' }} />
            <Tooltip formatter={(value) => `${value} đơn hàng`} />
            <Legend wrapperStyle={{ color: '#555' }} />
            <Bar dataKey="purchases" fill="#8884d8" name="Mua hàng" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      <Paper elevation={3} sx={{ padding: 3 , backgroundColor: '#E7E8EB'}}>
        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: '#333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Danh sách khóa học đã đăng ký
        </Typography>
        {courses.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <Table responsive striped bordered hover className="mt-3">
            <thead>
              <tr>
                <th>Tên khóa học</th>
                <th>Ngày đăng ký</th>
                <th>Giá</th>
                <th>Email đăng ký</th>
                <th>Tên học viên</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {revenueData.map((subscription) => (
                <tr key={subscription._id}>
                  <td>{subscription.courseId?.name}</td>
                  <td>{new Date(subscription.createdAt).toLocaleString()}</td>
                  <td>{(subscription.courseId?.price).toLocaleString()}</td>
                  <td>{subscription.userId?.email || "N/A"}</td>
                  <td>{subscription.userId?.name || "N/A"}</td>
                  <td>{subscription.subscriptionStatus?.status}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          </div>
        ) : (
          <Typography variant="subtitle1" color="textSecondary">
            Không có khóa học nào.
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default RevenueManage;
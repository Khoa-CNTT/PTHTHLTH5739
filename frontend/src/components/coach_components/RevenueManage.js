import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import axios from "axios";
import "./RevenueManage.css";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { toast, ToastContainer } from "react-toastify";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RevenueManage = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [activeSubscriptions, setActiveSubscriptions] = useState(0);
  const [totalCourses, settotalCourses] = useState(0);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState({
    labels: [],
    datasets: [
      {
        label: "Doanh thu theo tháng (VND)",
        data: [],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:4000/api/coaches/revenue", // Đổi endpoint API
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = response.data;

        setRevenueData(data.subscriptions);
        setTotalRevenue(data.totalRevenue);
        setActiveSubscriptions(data.totalSubscriptions);
        settotalCourses(data.totalCourses);
        processMonthlyRevenue(data.subscriptions);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu doanh thu:", error);
        toast.error("Lỗi khi lấy dữ liệu doanh thu");
      }
    };
    fetchData();
  }, []);

  const formatVND = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const processMonthlyRevenue = (subscriptions) => {
    const monthlyRevenue = {};
    subscriptions.forEach((sub) => {
      const date = new Date(sub.createdAt); // Sử dụng createdAt thay vì startDate
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // Tháng trong JavaScript bắt đầu từ 0 nên + 1
      const key = `${year}-${month.toString().padStart(2, '0')}`;
      const revenue = sub.courseId?.price || 0;
      monthlyRevenue[key] = (monthlyRevenue[key] || 0) + revenue;
    });

    const sortedMonths = Object.keys(monthlyRevenue).sort();
    const labels = sortedMonths.map((key) => key);
    const data = sortedMonths.map((key) => monthlyRevenue[key]);

    setMonthlyRevenueData({
      labels: labels,
      datasets: [
        {
          label: "Doanh thu theo tháng (VND)",
          data: data,
          backgroundColor: "rgba(54, 162, 235, 0.6)",
        },
      ],
    });
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Thống kê doanh thu theo tháng",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return formatVND(value);
          },
        },
      },
    },
  };

  return (
    <Container fluid className="admin-revenue">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <Row>
        <Col className="application-section">
          <h2 className="mb-4">Quản lý doanh thu</h2>

          <Row className="overview-cards text-center mb-4">
            <Col md={4}>
              <Card className="overview-card" style={{ backgroundColor: '#E7E8EB' }}>
                <Card.Body>
                  <Card.Title>Tổng doanh thu</Card.Title>
                  <Card.Text>{formatVND(totalRevenue)}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="overview-card" style={{ backgroundColor: '#E7E8EB' }}>
                <Card.Body>
                  <Card.Title>Tổng các gói đăng ký</Card.Title>
                  <Card.Text>{activeSubscriptions}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="overview-card" style={{ backgroundColor: '#E7E8EB' }}>
                <Card.Body>
                  <Card.Title>Tổng số khóa học</Card.Title>
                  <Card.Text>{totalCourses}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Card className="mb-4">
            <Card.Body>
              <Bar data={monthlyRevenueData} options={chartOptions} />
            </Card.Body>
          </Card>

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
                  <td>{formatVND(subscription.courseId?.price)}</td>
                  <td>{subscription.userId?.email || "N/A"}</td>
                  <td>{subscription.userId?.name || "N/A"}</td>
                  <td>{subscription.subscriptionStatus?.status}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default RevenueManage;
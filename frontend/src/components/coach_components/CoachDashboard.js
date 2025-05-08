import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Pagination, Modal, Tag, Switch } from "antd";
import { useNavigate } from "react-router-dom";
import { Line, Pie } from "react-chartjs-2";
import "react-quill/dist/quill.snow.css";
import "./CoachDashboard.css";
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';
import { toast, ToastContainer } from "react-toastify";

// Import chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CourseTable = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [visibility, setVisibility] = useState({});

  const toggleVisibility = (courseId) => {
    setVisibility((prevVisibility) => ({
      ...prevVisibility,
      [courseId]: !prevVisibility[courseId], // Toggle visibility for the specific course
    }));
  };



  const fetchCourses = async (page) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/coaches/course?page=${page}&limit=20`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setCourses(response.data.courses || []);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Lỗi khi tải khóa học:", error);
      toast.error("Lỗi khi tải khóa học");
    }
  };

  // Call fetchCourses inside useEffect
  useEffect(() => {
    fetchCourses(currentPage);
  }, [currentPage]);

  const handleCreateCourse = () => {
    navigate("/coach/create-course");
  };

  const handleViewCourse = (courseId) => {
    navigate(`/coach/detail-course/${courseId}`);
  };

  const handleDeleteCourse = (courseId, isDeleted, status) => {
    const action = !isDeleted ? "vô hiệu hóa" : "kích hoạt"; // Xác định hành động dựa trên trạng thái hiện tại
    const confirmationTitle =
      status === "accepted"
        ? `Bạn có chắc chắn muốn ${action} khóa học này?`
        : "Bạn có chắc chắn muốn xóa khóa học này?";

    Modal.confirm({
      title: confirmationTitle,
      okText: "Có",
      cancelText: "Không",
      onOk: () => {
        axios
          .delete(
            `http://localhost:4000/api/coaches/course/delete/${courseId}?status=${status}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          )
          .then(() => {
            fetchCourses();
            const successAction = !isDeleted ? "Vô hiệu hóa" : "Kích hoạt"; // Xác định hành động thành công
            Modal.success({
              title: `Đã ${successAction}`,
              content: `Khóa học đã được ${successAction.toLowerCase()} thành công.`,
            });
          })
          .catch((error) => {
            console.error("Lỗi khi cập nhật trạng thái khóa học:", error);
            Modal.error({
              title: "Lỗi",
              content: "Đã có lỗi khi cập nhật trạng thái khóa học.",
            });
          });
      },
    });
  };

  const columns = [
    {
      title: "#",
      render: (_, __, index) => (currentPage - 1) * 10 + index + 1,
    },
    {
      title: "Tên khóa học",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Thể loại",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price.toLocaleString()} VND`,
    },
    {
      title: "Giảm giá",
      dataIndex: "discount",
      key: "discount",
      render: (discount) => `${discount || 0}%`,
    },
    {
      title: "Ảnh",
      render: (text, record) => (
        <img
          src={record.image[0]}
          alt={record.name}
          style={{ width: "100px", height: "auto" }}
        />
      ),
    },
    {
      title: "Bài tập luyện",
      render: (_, record) => {
        const courseId = record._id;
        return (
          <div>
            <button onClick={() => toggleVisibility(courseId)}>
              {visibility[courseId] ? "Ẩn bài tập" : "Hiện bài tập"}
            </button>
            {visibility[courseId] && (
              <ul>
                {record.workout.map((workout) => (
                  <li key={workout._id}>
                    <strong>{workout.name}</strong>
                    <ul>
                      {workout.progressId.map((progress) => (
                        <li key={progress._id}>
                          <strong>{progress.exerciseId.name}</strong> -
                          Khoảng thời gian: {progress.exerciseId.exerciseDuration} phút
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      },
    },
    {
      title: "Status",
      render: (text, record) => {
        let color;
        let statusText = record.status;
        let displayText = statusText;

        // If status is "rejected", display the rejection reason as well
        if (record.status === "rejected") {
          displayText = `${statusText} | ${record.rejectionReason}`; // Append rejection reason
        }

        // Determine the color based on status
        switch (record.status) {
          case "accepted":
            color = "green";
            break;
          case "rejected":
            color = "red";
            break;
          case "submit":
            color = "blue";
            break;
          default:
            color = "default";
            break;
        }

        return <Tag color={color}>{displayText}</Tag>;
      },
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <div>
          <Button
            type="primary"
            onClick={() => handleViewCourse(record._id)}
            style={{ marginRight: "8px" }}
          >
            Xem | Sửa khóa học
          </Button>
          {record.status === "accepted" ? 
          (
            <Switch
            className="mt-3"
              checked={!record.isDeleted}
              onClick={() =>
                handleDeleteCourse(record._id, record.isDeleted, record.status)
              }
              checkedChildren="Hoạt động"
              unCheckedChildren="Không hoạt động"
            />
          ) : (
            <Button
            className="my-custom-button mt-3"
              type="danger"
              onClick={() => handleDeleteCourse(record._id)}
            >
              Xóa
            </Button>
            )
          }
        </div>
      ),
    },
  ];

  return (
    <div>
     <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover/>
      <h2 className="mb-4" style={{ color: "#000" }}>
      Các khóa học
      </h2>
      <Button
        variant="primary"
        onClick={handleCreateCourse}
        className="mb-3"
      >
        Tạo khóa học
      </Button>
      <br />
      <TableContainer component={Paper} style={{ backgroundColor: '#474874' }}>
        <Table aria-label="course table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.key} style={{ fontWeight: 'bold', color: '#fff9a9' }}>
                  {column.title}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map((course, index) => (
              <TableRow
                key={course._id}
                hover
                style={{ cursor: 'pointer' }}
                sx={{
                  '&:hover': {
                    backgroundColor: '#333',
                  },
                  '&:hover .MuiTableCell-root': {
                    color: 'black',
                  },
                }}
              >
                {columns.map((column) => (
                  <TableCell key={column.key} style={{ color: 'white' }}>
                    {column.render ? column.render(course[column.key], course, index) : course[column.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default CourseTable;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Pagination, Chip, Modal, Input, Tooltip } from "@mui/material";
import { Container } from "react-bootstrap";
import { EyeOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import ReactQuill from "react-quill";
import { useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import CourseDetails from "./CourseDetails";
import { toast, ToastContainer  } from "react-toastify";
const ManageCourseAdmin = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [visibility, setVisibility] = useState({});

  const toggleVisibility = (courseId) => {
    setVisibility((prevVisibility) => ({
      ...prevVisibility,
      [courseId]: !prevVisibility[courseId],
    }));
  };

  useEffect(() => {
    axios
      .get(
        `http://localhost:4000/api/admins/courses?page=${currentPage}&limit=5`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setCourses(response.data.courses || []);
        setTotalPages(response.data.totalPages);
      })
      .catch((error) => {
        console.error("Lỗi khi tải khóa học:", error);
        toast.error("Lỗi khi tải khóa học");
      });
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleViewDetails = (course) => {
    setSelectedCourse(course);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedCourse(null);
  };

  const handleAcceptCourse = async (courseId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.patch(
        `http://localhost:4000/api/admins/courses/${courseId}/accept`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchCourses();
      toast.success("Chấp nhận khóa học thành công");
    } catch (error) {
      console.error("Lỗi khi chấp nhận khóa học:", error);
      toast.error("Lỗi khi chấp nhận khóa học");
    }
  };

  const handleRejectCourse = (courseId) => {
    setSelectedCourse(courseId);
    setIsRejectModalVisible(true);
  };

  const handleRejectSubmit = async () => {
    if (!rejectionReason) {
      alert("Vui lòng cung cấp lý do từ chối");
      return;
    }
    const token = localStorage.getItem("token");
    try {
      await axios.patch(
        `http://localhost:4000/api/admins/courses/${selectedCourse}/reject`,
        { rejectionReason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Từ chối khóa học thành công");
      fetchCourses();
      setIsRejectModalVisible(false);
      setRejectionReason("");
    } catch (error) {
      console.error("Lỗi từ chối khóa học:", error);
      toast.error("Lỗi từ chối khóa học");
    }
  };

  const fetchCourses = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `http://localhost:4000/api/admins/courses?page=${currentPage}&limit=5`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
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

  const columns = [
    {
      title: "STT",
      render: (_, __, index) => (currentPage - 1) * 5 + index + 1,
    },
    {
      title: "Tên khóa học",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Tên HLV",
      dataIndex: "coach_name",
      key: "coachId.name",
      render: (text, record) => record.coach_name || (record.coachId && record.coachId.name) || "N/A",
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
      title: "Trạng thái",
      render: (text, record) => {
        let color;
        let statusText = record.status;
        let displayText = statusText;

        if (record.status === "rejected") {
          displayText = `${statusText} | ${record.rejectionReason}`;
        }

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

        return <Chip label={displayText} style={{ color: "white", backgroundColor: color }} />;
      },
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Tooltip title="Xem chi tiết">
            <Button
              onClick={() => handleViewDetails(record)}
              style={{ minWidth: 32 }}
            >
              <EyeOutlined />
            </Button>
          </Tooltip>
          {
            (record.status === "submit" || record.status === "accepted" || record.status === "rejected") && (
              <>
                {record.status === "submit" && (
                  <>
                    <Tooltip title="Chấp nhận khóa học">
                      <Button
                        onClick={() => handleAcceptCourse(record._id)}
                        style={{ color: "green", minWidth: 32 }}
                      >
                        <CheckCircleOutlined />
                      </Button>
                    </Tooltip>
                    <Tooltip title="Từ chối khóa học">
                      <Button
                        onClick={() => handleRejectCourse(record._id)}
                        style={{ color: "red", minWidth: 32 }}
                      >
                        <CloseCircleOutlined />
                      </Button>
                    </Tooltip>
                  </>
                )}
                {record.status === "accepted" && (
                  <>
                    <Tooltip title="Từ chối khóa học">
                      <Button
                        onClick={() => handleRejectCourse(record._id)}
                        style={{ color: "red", minWidth: 32 }}
                      >
                        <CloseCircleOutlined />
                      </Button>
                    </Tooltip>
                  </>
                )}
                {record.status === "rejected" && (
                  <>
                    <Tooltip title="Chấp nhận khóa học">
                      <Button
                        onClick={() => handleAcceptCourse(record._id)}
                        style={{ color: "green", minWidth: 32 }}
                      >
                        <CheckCircleOutlined />
                      </Button>
                    </Tooltip>
                  </>
                )}
              </>
            )
          }
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2 className="mb-4" >
        Quản lý khóa học
      </h2>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover/>
      <TableContainer component={Paper} style={{ backgroundColor: '#F2F2F2' }}>
        <Table aria-label="course table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.key} style={{ fontWeight: 'bold', backgroundColor: '#F2F2F2' }}>
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
                style={{ cursor: 'pointer', color: '#000000' }}
                sx={{
                  '&:hover': {
                    backgroundColor: '#333',
                  },
                  '&:hover .MuiTableCell-root': {
                    color: '#000000',
                  },
                }}
              >
                {columns.map((column) => (
                  <TableCell key={column.key} style={{ color: 'black' }}>
                    {column.render ? column.render(course[column.key], course, index) : course[column.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={(event, value) => handlePageChange(value)}
        sx={{
          marginTop: "16px",
          textAlign: "center",
          '& .MuiPaginationItem-root': {
            color: 'white',  // Đổi màu chữ của số trang thành trắng
            backgroundColor: '#9797ad',  // Đổi màu nền của các nút thành màu #9797ad
            '&:hover': {
              backgroundColor: '#79798a !important',  // Màu nền khi hover
            },
          },
          '& .MuiPaginationItem-ellipsis': {
            color: 'white !important',  // Đảm bảo dấu ba chấm (...) cũng có màu trắng
          }
        }}
      />
      {/* Modal cho chi tiết khóa học */}
      <Modal
        open={isModalVisible}
        onClose={handleModalClose}
        aria-labelledby="course-details-modal"
        aria-describedby="course-details"
        style={{ overflowY: 'auto' }}
      >
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <CourseDetails selectedCourse={selectedCourse} onClose={handleModalClose} />
        </div>
      </Modal>

      {/* Modal cho lý do từ chối */}
      <Modal
        open={isRejectModalVisible}
        onClose={() => setIsRejectModalVisible(false)}
        aria-labelledby="reject-course-modal"
        aria-describedby="reject-course"
        style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "8px", width: "400px" }}>
          <h3 style={{ color: "#F36100" }}>Từ chối khóa học</h3>
          <p style={{ color: 'black' }}>Vui lòng cung cấp lý do từ chối:</p>
          <Input
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Nhập lý do từ chối"
            multiline
            rows={4}
            style={{ width: "100%", marginBottom: "16px" }}
          />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              onClick={handleRejectSubmit}
              variant="contained"
              color="error"
              style={{ marginRight: "8px" }}
            >
              Từ chối
            </Button>
            <Button
              onClick={() => setIsRejectModalVisible(false)}
              variant="contained"
              style={{ backgroundColor: "#8f8f8f" }}
            >
              Hủy
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageCourseAdmin;

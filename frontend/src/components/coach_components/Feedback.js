import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  TablePagination,
  TextField,
  InputAdornment,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch, // Thêm Switch cho trạng thái ẩn/hiện
  Typography,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { Container } from "react-bootstrap";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { toast, ToastContainer } from "react-toastify";

function CoachFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [sortBy, setSortBy] = useState("createdAt"); // Mặc định sắp xếp theo thời gian tạo
  const [sortDirection, setSortDirection] = useState("desc"); // Mặc định giảm dần
  const [showHidden, setShowHidden] = useState(true); // Trạng thái hiển thị phản hồi ẩn

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/coaches/feedbacks", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setFeedbacks(response.data);
    } catch (error) {
      console.error("Có lỗi khi lấy phản hồi!", error);
      console.log(error);
      toast.error("Có lỗi khi lấy phản hồi!");
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleToggleHidden = async (feedbackId) => {
    try {
      const feedbackToUpdate = feedbacks.find((fb) => fb._id === feedbackId);
      if (!feedbackToUpdate) return;

      await axios.put(
        `http://localhost:4000/api/coaches/feedbacks/${feedbackId}`,
        { isHidden: !feedbackToUpdate.isHidden },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      // Cập nhật lại trạng thái trên giao diện
      setFeedbacks((prevFeedbacks) =>
        prevFeedbacks.map((fb) =>
          fb._id === feedbackId ? { ...fb, isHidden: !fb.isHidden } : fb
        )
      );
      toast.success("Chuyển trạng thái thành công");
    } catch (error) {
      console.error("Có lỗi khi chuyển đổi trạng thái ẩn phản hồi!", error);
      toast.error("Có lỗi khi chuyển đổi trạng thái ẩn phản hồi!");
    }
  };

  const handleSort = (property) => {
    if (sortBy === property) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(property);
      setSortDirection("asc");
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleShowHiddenChange = (event) => {
    setShowHidden(event.target.checked);
  };

  const sortedFeedbacks = [...feedbacks].sort((a, b) => {
    let comparison = 0;
    if (sortBy === "createdAt") {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      comparison = dateA - dateB;
    } else if (sortBy === "courseId") {
      //sắp xếp theo ID khóa học
      comparison = a.courseId.localeCompare(b.courseId);
    } else if (sortBy === "rating") {
      comparison = a.rating - b.rating;
    }

    return sortDirection === "asc" ? comparison : comparison * -1;
  });

  const filteredFeedbacks = sortedFeedbacks.filter((feedback) => {
    const searchRegex = new RegExp(searchTerm, "i");
    const contentMatch = searchRegex.test(feedback.content);
    const customerNameMatch = feedback.userId?.name?.match(searchRegex);
    const courseNameMatch = feedback.courseId?.name?.match(searchRegex);
    const hiddenMatch = showHidden || !feedback.isHidden;

    return hiddenMatch && (contentMatch || customerNameMatch || courseNameMatch);
  });

  return (
    <div >
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover/>
      <h1 className="text-black mb-4">Quản Lý Phản Hồi</h1>
      <div style={{ padding: "16px" }}>
        <Grid container spacing={2} alignItems="center" style={{ marginBottom: "16px" }}>
          <Grid item xs={12} sm={8}>
            <TextField
              style={{ background: "white", borderRadius: "9px" }}
              label="Tìm kiếm"
              variant="outlined"
              size="small"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4} style={{ textAlign: isMobile ? "left" : "right" }}>
            <FormControl component="fieldset">
              <Typography className="text-black" component="legend">Hiển thị phản hồi ẩn</Typography>
              <Switch checked={showHidden} onChange={handleShowHiddenChange} color="primary" />
            </FormControl>
          </Grid>
        </Grid>

        <TableContainer  component={Paper}>
          <Table size={isMobile ? "small" : "medium"}>
            <TableHead>
              <TableRow style={{ backgroundColor: "aliceblue", color: "black" }}>
                <TableCell>No.</TableCell>
                <TableCell>Tên khách hàng</TableCell> {/* Cần lấy thông tin từ userId */}
                <TableCell onClick={() => handleSort("content")} style={{ cursor: "pointer" }}>
                  Nội dung phản hồi
                </TableCell>
                <TableCell onClick={() => handleSort("courseId?.name")} style={{ cursor: "pointer" }}>
                  Khóa học
                </TableCell>
                <TableCell onClick={() => handleSort("createdAt")} style={{ cursor: "pointer" }}>
                  Thời gian
                </TableCell>
                <TableCell onClick={() => handleSort("rating")} style={{ cursor: "pointer" }}>
                  Đánh giá
                </TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredFeedbacks
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((feedback, index) => (
                  <TableRow key={feedback._id} style={feedback.isHidden ? { backgroundColor: "#f0f0f0" } : {}}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{feedback.userId?.name}</TableCell> {/* Cần lấy tên từ userId */}
                    <TableCell>{feedback.content}</TableCell>
                    <TableCell>{feedback.courseId?.name}</TableCell> {/* Cần lấy tên khóa học từ courseId */}
                    <TableCell>{new Date(feedback.createdAt).toLocaleString()}</TableCell>
                    <TableCell>{feedback.rating} sao</TableCell>
                    <TableCell>{feedback.isHidden ? "Đã ẩn" : "Hiển thị"}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color={feedback.isHidden ? "primary" : "secondary"}
                        size="small"
                        onClick={() => handleToggleHidden(feedback._id)}
                      >
                        {feedback.isHidden ? "Hiện" : "Ẩn"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredFeedbacks.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </div>
    </div>
  );
}

export default CoachFeedback;
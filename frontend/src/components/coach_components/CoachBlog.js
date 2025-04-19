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
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions,
  IconButton,
  TablePagination,
  InputAdornment,
  useMediaQuery,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Category,
} from "@mui/icons-material";
import { Container } from "react-bootstrap";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles

import { useTheme } from "@mui/material/styles";

function CoachBlog() {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [open, setOpen] = useState(false);
  const [blogCategory, setBlogCategory] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    image: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    fetchAllBlogs();
  }, []);

  // Hàm gọi API để lấy danh sách bài viết
  const fetchAllBlogs = () => {
    axios
      .get("http://localhost:4000/api/coaches/blogs", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => setBlogs(response.data))
      .catch((error) => console.error("Lỗi khi tải danh sách bài viết!", error));

    // Gọi API để lấy danh mục bài viết
    axios
      .get("http://localhost:4000/api/coaches/blogCategory", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setBlogCategory(response.data.blogCategory);
      })
      .catch((error) => {
        console.error("Lỗi khi tải danh mục bài viết!", error);
      });
  };

  // Lọc bài viết dựa trên từ khóa tìm kiếm
  const filteredBlogs = Array.isArray(blogs)
    ? blogs.filter(
        (blog) =>
          blog.title &&
          blog.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Mở dialog để thêm hoặc chỉnh sửa bài viết
  const handleOpenDialog = (blog) => {
    setSelectedBlog(blog);
    setOpen(true);
    setIsAdding(!blog);
    setFormData(
      blog
        ? {
            title: blog.title,
            content: blog.content,
            category: blog.category,
            image: blog.image,
          }
        : { title: "", content: "", image: "", category: "" }
    );
  };

  // Đóng dialog
  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedBlog(null);
    setIsAdding(false);
  };

  // Xử lý thay đổi input trong form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Lưu bài viết (thêm mới hoặc cập nhật)
  const handleSave = () => {
    const request = isAdding
      ? axios.post("http://localhost:4000/api/coaches/blogs", formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
      : axios.put(
          `http://localhost:4000/api/coaches/blogs/${selectedBlog._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

    request
      .then((response) => {
        const updatedBlogs = isAdding
          ? [...blogs, response.data]
          : blogs.map((blog) =>
              blog._id === response.data._id ? response.data : blog
            );
        setBlogs(updatedBlogs);
        handleCloseDialog();
        window.location.reload(); // Tải lại trang để cập nhật giao diện
      })
      .catch((error) => console.error("Lỗi khi lưu bài viết!", error));
  };

  // Hiển thị dialog xác nhận xóa
  const handleDeleteConfirmation = (blog) => {
    setBlogToDelete(blog); // Lưu trữ bài viết cần xóa
    setDeleteDialogOpen(true); // Mở dialog xác nhận
  };

  // Xóa bài viết sau khi xác nhận
  const handleDelete = () => {
    if (blogToDelete) {
      axios
        .delete(`http://localhost:4000/api/coaches/blogs/${blogToDelete._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then(() => {
          // Cập nhật danh sách bài viết sau khi xóa thành công
          setBlogs((prevBlogs) =>
            prevBlogs.filter((blog) => blog._id !== blogToDelete._id)
          );
          setDeleteDialogOpen(false); // Đóng dialog xác nhận
          setBlogToDelete(null); // Reset bài viết cần xóa
        })
        .catch((error) => console.error("Lỗi khi xóa bài viết!", error));
    }
  };

  // Hủy thao tác xóa
  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setBlogToDelete(null); // Reset bài viết cần xóa
  };

  // Gửi bài viết để phê duyệt
  const handleSubmitForApproval = (blogId) => {
    axios
      .put(`http://localhost:4000/api/coaches/blogs/${blogId}/submit`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(() => fetchAllBlogs()) // Tải lại danh sách bài viết sau khi gửi
      .catch((error) =>
        console.error("Lỗi khi gửi bài viết để phê duyệt!", error)
      );
  };

  // Xử lý thay đổi trang trong pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Xử lý thay đổi số hàng hiển thị trên mỗi trang
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="mt-5">
      <h2 className="text-3xl font-bold mb-8" style={{ color: '#000' }}>Quản lý bài viết</h2>
      <div style={{ padding: "16px" }}>
        <Grid
          container
          spacing={isMobile ? 1 : 2}
          alignItems="center"
          style={{ marginBottom: "16px" }}
        >
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
          <Grid
            item
            xs={12}
            sm={4}
            style={{ textAlign: isMobile ? "center" : "right" }}
          >
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog(null)}
              fullWidth={isMobile}
            >
              Thêm bài viết
            </Button>
          </Grid>
        </Grid>

        <TableContainer component={Paper}>
          <Table size={isMobile ? "small" : "medium"}>
            <TableHead>
              <TableRow style={{ backgroundColor: "aliceblue" }}>
                <TableCell>#.</TableCell>
                <TableCell>Tiêu đề</TableCell>
                {!isMobile && <TableCell>Nội dung</TableCell>}
                <TableCell>Ngày xuất bản</TableCell>
                <TableCell>Hình ảnh</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Thể loại</TableCell>
                <TableCell>Lý do từ chối</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBlogs
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((blog, index) => (
                  <TableRow key={blog._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{blog.title}</TableCell>
                    {!isMobile && (
                      <TableCell>{blog.content?.substring(0, 50)}...</TableCell>
                    )}
                    <TableCell>
                      {new Date(blog.date).toLocaleDateString()}
                    </TableCell>

                    <TableCell>
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="blog-image"
                        style={{
                          width: "100px",
                          height: "auto",
                          objectFit: "contain",
                          maxHeight: "50px",
                        }}
                      />
                    </TableCell>
                    <TableCell>{blog.status}</TableCell>
                    <TableCell>{blog.category?.catName}</TableCell>
                    <TableCell>{blog.reasonReject}</TableCell>

                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(blog)}
                        size={isMobile ? "small" : "medium"}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteConfirmation(blog)}
                        size={isMobile ? "small" : "medium"}
                      >
                        <DeleteIcon />
                      </IconButton>
                      {blog.status === "pending" && (
                        <Button
                          color="secondary"
                          size="small"
                          onClick={() => handleSubmitForApproval(blog._id)}
                          style={{
                            minWidth: isMobile ? "fit-content" : "auto",
                          }}
                        >
                          Gửi duyệt
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogContent>
              Bạn có chắc chắn muốn xóa bài viết này không?
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancelDelete} color="primary">
                Hủy
              </Button>
              <Button
                onClick={handleDelete}
                color="secondary"
              >
                Xóa
              </Button>
            </DialogActions>
          </Dialog>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredBlogs.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Số hàng mỗi trang:"
            labelDisplayedRows={({ from, to, count }) => `Từ ${from}-${to} của ${count}`}
          />
        </TableContainer>

        <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="md">
          <DialogTitle>{isAdding ? "Thêm bài viết" : "Chỉnh sửa bài viết"}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              {/* Input Fields */}
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  name="title"
                  label="Tiêu đề"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.title}
                  onChange={handleInputChange}
                />
                <TextField
                  margin="dense"
                  name="content"
                  label="Nội dung"
                  type="text"
                  fullWidth
                  multiline
                  rows={10}
                  variant="outlined"
                  value={formData.content}
                  onChange={handleInputChange}
                />
                <TextField
                  margin="dense"
                  name="image"
                  label="URL hình ảnh"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.image}
                  onChange={handleInputChange}
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel id="blog-category-label">
                    Thể loại bài viết
                  </InputLabel>
                  <Select
                    labelId="blog-category-label"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    label="Thể loại bài viết"
                  >
                    {blogCategory.map((category) => (
                      <MenuItem key={category._id} value={category._id}>
                        {category.catName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {/* Live Preview */}
              <Grid item xs={12} sm={6}>
                <div
                  style={{
                    padding: "16px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    minHeight: "200px",
                    overflow: "auto",
                    backgroundColor: "#f9f9f9",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  <div style={{ marginBottom: "8px" }}>
                    <h4>
                      {formData.title || (
                        <span style={{ color: "#777" }}>
                          Tiêu đề xem trước sẽ hiển thị ở đây...
                        </span>
                      )}
                    </h4>
                  </div>

                  <div style={{ marginBottom: "8px" }}>
                    {formData.content ? (
                      <ReactQuill
                        style={{ color: "#333", fontWeight: 'normal' }}
                        value={formData.content}
                        readOnly={true}
                        theme="bubble"
                      />
                    ) : (
                      <span style={{ color: "#777" }}>
                        Nội dung xem trước sẽ hiển thị ở đây...
                      </span>
                    )}
                  </div>
                  <div>
                    {formData.image ? (
                      <img
                        src={formData.image}
                        alt="Preview"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "200px",
                          objectFit: "contain",
                        }}
                      />
                    ) : (
                      <span style={{ color: "#777" }}>
                        Hình ảnh xem trước sẽ hiển thị ở đây...
                      </span>
                    )}
                  </div>
                  <div style={{ marginBottom: "8px" }}>
                    <span>
                      {blogCategory.find(cat => cat._id === formData.category)?.catName || (
                        <span style={{ color: "#777" }}>
                          Thể loại xem trước sẽ hiển thị ở đây...
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Hủy
            </Button>
            <Button
              onClick={handleSave}
              color="primary"
            >
              {isAdding ? "Thêm" : "Lưu"}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default CoachBlog;
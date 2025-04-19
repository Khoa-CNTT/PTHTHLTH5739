import React, { useState, useEffect, useCallback } from "react";
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Table,
  Row,
  Col,
} from "reactstrap";
import axios from "axios";
import classnames from "classnames";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS của Toastify
import "./AdminBlog.css"; // Đảm bảo bạn đã thêm file CSS này vào
import Swal from 'sweetalert2';

function AdminBlog() {
  const [blogs, setBlogs] = useState([]);
  const [submittedBlogs, setSubmittedBlogs] = useState([]);
  const [acceptedBlogs, setAcceptedBlogs] = useState([]);
  const [rejectedBlogs, setRejectedBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);

  const [blogCategory, setBlogCategory] = useState([]);

  const [activeTab, setActiveTab] = useState("1");

  const [modalOpen, setModalOpen] = useState(false);

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const token = localStorage.getItem("token");

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/admins/manageBlog",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const allBlogs = response.data;

      // Lọc và hiển thị các blog đang chờ xử lý
      const submitted = allBlogs.filter((blog) => {
        return blog.status === "pending";
      });
      setSubmittedBlogs(submitted);

      // Lọc và hiển thị các blog đã được chấp nhận
      const accepted = allBlogs.filter((blog) => {
        return blog.status === "approved";
      });
      setAcceptedBlogs(accepted);

      // Lọc và hiển thị các blog đã bị từ chối
      const rejected = allBlogs.filter((blog) => {
        return blog.status === "rejected";
      });
      setRejectedBlogs(rejected);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách blog:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/admins/blogCategory",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setBlogCategory(response.data.blogCategory);
    } catch (error) {
      console.error("Lỗi khi lấy danh mục:", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, []);

  const handleAcceptBlog = async (blogId) => {
    try {
      await axios.put(
        `http://localhost:4000/api/admins/manageBlog/${blogId}/accept`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchBlogs(); // Cập nhật lại danh sách blog
      toast.success("Blog đã được chấp nhận!", {
        autoClose: 5000, // Tự động đóng sau 5 giây
      });
    } catch (error) {
      console.error("Lỗi khi chấp nhận blog:", error);
      toast.error("Lỗi khi chấp nhận blog.", {
        autoClose: 5000,
      });
    }
  };

  const handleRejectBlog = async (blogId) => {
    try {
      // Hiển thị hộp thoại xác nhận
      const result = await Swal.fire({
        title: 'Từ chối Blog',
        text: 'Vui lòng cung cấp lý do từ chối:',
        input: 'textarea',
        inputPlaceholder: 'Nhập lý do từ chối tại đây...',
        showCancelButton: true,
        confirmButtonText: 'Từ chối',
        cancelButtonText: 'Hủy',
        inputValidator: (value) => {
          if (!value) {
            return 'Bạn cần phải cung cấp một lý do!';
          }
        }
      });

      // Nếu được xác nhận và cung cấp lý do
      if (result.isConfirmed) {
        await axios.put(
          `http://localhost:4000/api/admins/manageBlog/${blogId}/reject`,
          {
            reasonReject: result.value
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        fetchBlogs();
        toast.error("Blog đã bị từ chối.", {
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.error("Lỗi khi từ chối blog.", error);
      toast.error("Lỗi khi từ chối blog.", {
        autoClose: 5000,
      });
    }
  };

  const handleViewDetails = async (blogId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `http://localhost:4000/api/admins/blogs/${blogId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setSelectedBlog(response.data);
      setModalOpen(true);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết blog:", error);
    }
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN'); // Định dạng theo chuẩn Việt Nam (DD/MM/YYYY)
  };
  const BlogTable = ({ blogs, onAccept, onReject, onViewDetails }) => {
    const shouldShowReasonRejectColumn = blogs.some(blog => blog.status === "rejected" && blog.reasonReject);

    return (
      <Table hover responsive className="table-bordered">
        <thead>
          <tr>
            <th className="text-center text-nowrap">#</th>
            <th className="text-center text-nowrap">Tiêu đề</th>
            <th className="text-center text-nowrap">Nội dung</th>
            <th className="text-center text-nowrap">Ngày xuất bản</th>
            <th className="text-center text-nowrap">Ảnh</th>
            <th className="text-center text-nowrap">Thể loại</th>
            <th className="text-center text-nowrap">Tác giả</th>
            {shouldShowReasonRejectColumn && <th className="text-center text-nowrap">Lý do từ chối</th>}
            <th className="text-center text-nowrap">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog, index) => (
            <tr key={blog._id}>
              <th scope="row">{index + 1}</th>
              <td >{blog.title}</td>
              <td className="blog-content text-wrap"  style={{
                maxWidth: "250px", // Hoặc giá trị bạn muốn
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: '3',
                WebkitBoxOrient: 'vertical',
                textOverflow: 'ellipsis',
                height: 'calc(1.7em * 3)', // Chiều cao tương đương 3 dòng (line-height mặc định là 1.5)
                  }}>{blog.content}</td>
              <td className="text-center">{new Date(blog.date).toLocaleString()}</td>
              <td>
                {blog.image && (
                  <img
                    src={blog.image}
                    alt="Xem trước"
                    style={{ maxWidth: "150px", maxHeight: "150px", objectFit: "contain" }}
                  />
                )}
                {!blog.image && <p>Không có ảnh</p>}
              </td>
              <td className="text-center text-nowrap">{blog.category?.catName}</td>
              <td className="text-center text-nowrap">{blog.author?.name}</td>
              {shouldShowReasonRejectColumn && (
                <td className="text-center text-nowrap" style={{ color: 'red' }}>{blog.status === "rejected" && blog.reasonReject}</td>
              )}
              <td className="text-center text-nowrap">
                <Button color="info" size="sm" onClick={() => onViewDetails(blog._id)} className="mr-1">
                  Xem chi tiết
                </Button>
                {onAccept && (
                  <Button color="success" size="sm" onClick={() => onAccept(blog._id)} className="mr-1">
                    Chấp nhận
                  </Button>
                )}
                {onReject && (
                  <Button color="danger" size="sm" onClick={() => onReject(blog._id)}>
                    Từ chối
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  return (
    <div
      style={{
        backgroundColor: "#f9f9f9",
        padding: "20px",
        borderRadius: "8px",
      }}
    >
      <h2 className="mb-4">Quản lý bài viết</h2>
      <ToastContainer />

      <Nav tabs className="mb-3">
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "1" })}
            onClick={() => toggle("1")}
          >
            Bài viết đang chờ xử lý
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "2" })}
            onClick={() => toggle("2")}
          >
            Bài viết đã được chấp nhận
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "3" })}
            onClick={() => toggle("3")}
          >
            Bài viết đã bị từ chối
          </NavLink>
        </NavItem>
      </Nav>

      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <BlogTable
            blogs={submittedBlogs}
            onAccept={handleAcceptBlog}
            onReject={handleRejectBlog}
            onViewDetails={handleViewDetails}
          />
        </TabPane>
        <TabPane tabId="2">
          <BlogTable
            blogs={acceptedBlogs}
            onReject={handleRejectBlog}
            onViewDetails={handleViewDetails}
          />
        </TabPane>
        <TabPane tabId="3">
          <BlogTable
            blogs={rejectedBlogs}
            onAccept={handleAcceptBlog}
            onViewDetails={handleViewDetails}
          />
        </TabPane>
      </TabContent>

      {selectedBlog && (
        <Modal isOpen={modalOpen} toggle={toggleModal}>
          <ModalHeader toggle={toggleModal}>Chi tiết bài viết</ModalHeader>
          <ModalBody>
            <Row className="mb-2">
              <Col md="3"><strong>Tiêu đề:</strong></Col>
              <Col md="9">{selectedBlog.title}</Col>
            </Row>
            <Row className="mb-2">
              <Col md="3"><strong>Nội dung:</strong></Col>
              <Col md="9">{selectedBlog.content}</Col>
            </Row>
            <Row className="mb-2">
              <Col md="3"><strong>Thể loại:</strong></Col>
              <Col md="9">{selectedBlog.category?.catName}</Col>
            </Row>
            <Row className="mb-2">
              <Col md="3"><strong>Tác giả:</strong></Col>
              <Col md="9">{selectedBlog.author?.name}</Col>
            </Row>
            <Row className="mb-2">
              <Col md="3"><strong>Ngày:</strong></Col>
              <Col md="9">{new Date(selectedBlog.date).toLocaleString()}</Col>
            </Row>
            <Row className="mb-2">
              <Col md="3"><strong>Lý do từ chối:</strong></Col>
              <Col md="9">{selectedBlog.reasonReject}</Col>
            </Row>
            <Row className="mb-3">
              <Col md="3"><strong>Ảnh:</strong></Col>
              <Col md="9">
                {selectedBlog.image && (
                  <img
                    src={selectedBlog.image}
                    alt="Xem trước"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "200px",
                      objectFit: "contain",
                    }}
                  />
                )}
                {!selectedBlog.image && <p>Không có ảnh</p>}
              </Col>
            </Row>
            
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggleModal}>
              Đóng
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
}

export default AdminBlog;
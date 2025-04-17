import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal, Button, Form, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faEye,
  faEdit,
  faBan,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import ChartTK from "./ChartTK";
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, TextField, IconButton, Tooltip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CreateUserForm from "./CreateUserForm";
const ManagerUser = (onUserCreated) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    email: "",
    name: "",
    role: "user",
    status: "activate",
    avatar: "",
    gender: "",
    dob: "",
    phone: "",
    address: ""
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showConfirmBlockModal, setShowConfirmBlockModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [usersCreatedToday, setUsersCreatedToday] = useState(0);
  const [activateUsers, setActivateUsers] = useState(0);
  const [blockedUsers, setBlockedUsers] = useState(0);
  const [nonActivateUsers, setNonActivateUsers] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/admins/accounts", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUsers(res.data.accounts);
      setFilteredUsers(res.data.accounts);
      setTotalUsers(res.data.totalUsers);
      setUsersCreatedToday(res.data.usersCreatedToday);
      setActivateUsers(res.data.activateUsers);
      setBlockedUsers(res.data.blockedUsers);
      setNonActivateUsers(res.data.nonActivateUsers);
    } catch (err) {
      toast.error("Lỗi khi lấy tất cả người dùng");
    }
  };
  // Xác định các thay đổi của input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (showEditModal) {
      setSelectedUser({ ...selectedUser, [name]: value });
    } else {
      setNewUser({ ...newUser, [name]: value });
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filtered = users.filter(
      (user) =>
        (user.email &&
          user.email.toLowerCase().includes(e.target.value.toLowerCase())) ||
        (user.name &&
          user.name.toLowerCase().includes(e.target.value.toLowerCase()))
    );
    setFilteredUsers(filtered);
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `http://localhost:4000/api/admins/accounts/${selectedUser._id}`,
        selectedUser,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success(res.data.msg);
      fetchUsers();
      setShowEditModal(false);
    } catch (err) {
      toast.error("Không cập nhật được người dùng");
    }
  };

  const handleBlockUnblockUser = async () => {
    try {
      const res = await axios.patch(
        `http://localhost:4000/api/admins/accounts/${selectedUser._id}/status`,
        { status: selectedUser.status === "activate" ? "blocked" : "activate" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success(res.data.msg);
      fetchUsers();
      setShowConfirmBlockModal(false);
    } catch (err) {
      toast.error("Không thể thay đổi trạng thái người dùng");
    }
  };

  const handleShowViewModal = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };
  const handleCloseViewModal = () => setShowViewModal(false);

  const handleShowEditModal = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };
  const handleCloseEditModal = () => setShowEditModal(false);

  const handleShowConfirmBlockModal = (user) => {
    setSelectedUser(user);
    setShowConfirmBlockModal(true);
  };
  const handleCloseConfirmBlockModal = () => setShowConfirmBlockModal(false);

  const [showConfirmUpgradeModal, setShowConfirmUpgradeModal] = useState(false); // Modal trạng thái
  const [userToUpgrade, setUserToUpgrade] = useState(null); // Người dùng cần nâng cấp

  // Hiển thị modal xác nhận
  const handleShowConfirmUpgradeModal = (user) => {
    setUserToUpgrade(user);
    setShowConfirmUpgradeModal(true);
  };

  // Đóng modal xác nhận
  const handleCloseConfirmUpgradeModal = () => {
    setShowConfirmUpgradeModal(false);
    setUserToUpgrade(null);
  };

  // Xử lý xác nhận nâng cấp
  const handleConfirmUpgrade = async () => {
    if (!userToUpgrade) return;

    setLoading(true);
    try {
      // Nâng cấp người dùng
      await handleUpgradeToCoach(userToUpgrade._id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      handleCloseConfirmUpgradeModal();
    }
  };

  const handleUpgradeToCoach = async (userId) => {
    // Nhận userId
    setLoading(true); // Đặt trạng thái loading
    try {
      console.log("Selected User ID for Upgrade:", userId);

      if (!userId) {
        toast.error("No user selected for upgrade");
        return;
      }

      // Gọi API để cập nhật vai trò
      const res = await axios.put(
        `http://localhost:4000/api/admins/accounts/role/${userId}`,
        { role: "coach" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log(res.data);

      // Tạo một mục coach tương ứng
      await axios.post(
        `http://localhost:4000/api/admins/createCoach`,
        {
          accountId: userId, // Sử dụng userId từ tham số
          introduce: "",
          selfImage: [],
          contract: "",
          certificate: [],
          experience: [],
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success(res.data.msg);
      fetchUsers();
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      toast.error("Failed to upgrade user to coach");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container ml-40">
      <h2>Quản lý người dùng</h2>
      <ToastContainer />
      <ChartTK title={'Trạng thái người dùng'} active={activateUsers} block={blockedUsers} non={nonActivateUsers}
        label1={'Người dùng được kích hoạt'}
        label2={'Người dùng bị chặn'}
        label3={'Người dùng không kích hoạt'}
      />
      <br></br>

      <div className="mb-4">
        <h4 style={{ color: 'black' }}>Người dùng được tạo hôm nay: {usersCreatedToday}</h4>
      </div>
      <div className="d-flex justify-content-between mb-4">
        <Button className="btn btn-primary" onClick={handleOpenModal}>
          Tạo mới
        </Button>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            variant="outlined"
            placeholder="Tìm kiếm theo email hoặc tên"
            value={searchTerm}
            onChange={handleSearch}
            sx={{
              backgroundColor: 'white',
              width: 250,
              borderRadius: 1,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#000',  // viền màu đen
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#000',  // màu đen khi click vào
                },
              },
              '& .MuiInputBase-input': {
                color: '#000',  //chữ màu đen
              },
            }}
          />
          <IconButton sx={{ color: '#000' }}>
            <SearchIcon />
          </IconButton>
        </div>
      </div>

      <TableContainer
        component={Paper}
        style={{
          marginTop: "0",
          marginBottom: "30px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <Table aria-label=" table" sx={{ minWidth: 650 }}>
          <TableHead sx={{ fontWeight: "bold", backgroundColor: "#F2F2F2" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>
                Ảnh
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                Email
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                Tên
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                Vai trò
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                Trạng thái
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                Hành động
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentUsers.map((user) => (
              <TableRow
                key={user._id}
                sx={{
                  "&:hover": {
                    backgroundColor:
                      user.status === "activate" ? "#b8e1b8" : "#f99a9a", // Đậm hơn một chút khi hover
                    cursor: "pointer",
                  },
                  backgroundColor:
                    user.status === "activate" ? "#d5f5dc" : "#fcc5c5", // Màu nền mặc định
                }}
              >
                <TableCell>
                  <img
                    src={
                      user.avatar ||
                      "https://chiemtaimobile.vn/images/companies/1/%E1%BA%A2nh%20Blog/avatar-facebook-dep/Anh-avatar-hoat-hinh-de-thuong-xinh-xan.jpg?1704788263223"
                    }
                    alt="avatar"
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.status}</TableCell>
                <TableCell>
                  <Tooltip title="View Details" arrow>
                    <FontAwesomeIcon
                      icon={faEye}
                      className="mx-2"
                      onClick={() => handleShowViewModal(user)}
                      style={{ cursor: "pointer", color: "#F36100" }}
                    />
                  </Tooltip>
                  <Tooltip title="Edit Details" arrow>
                    <FontAwesomeIcon
                      icon={faEdit}
                      className="mx-2"
                      onClick={() => handleShowEditModal(user)}
                      style={{ cursor: "pointer", color: "#F36100" }}
                    />
                  </Tooltip>
                  <Tooltip
                    title={
                      user.status === "activate"
                        ? "Block User"
                        : "Activate User"
                    }
                    arrow
                  >
                    <FontAwesomeIcon
                      icon={user.status === "activate" ? faBan : faCheck}
                      className="mx-2"
                      onClick={() => handleShowConfirmBlockModal(user)}
                      style={{ cursor: "pointer", color: "#F36100" }}
                    />
                  </Tooltip>
                  <Tooltip title="Upgrade to Admin" arrow>
                    <Button
                      variant="contained"
                      onClick={() => handleShowConfirmUpgradeModal(user)}
                      className="mx-2"
                      sx={{
                        backgroundColor: "#F36100",
                        color: "white",
                        "&:hover": { backgroundColor: "#4fad79", opacity: 0.8 },
                      }}
                    >
                      Nâng cấp
                    </Button>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <nav>
        <ul className="pagination justify-content-center">
          {Array.from({
            length: Math.ceil(filteredUsers.length / usersPerPage),
          }).map((_, index) => (
            <li key={index} className="page-item">
              <button onClick={() => paginate(index + 1)} className="page-link">
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <Modal
        show={showConfirmUpgradeModal}
        onHide={handleCloseConfirmUpgradeModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn nâng cấp
          {" "}
          {/* <strong>{userToUpgrade?.name}</strong>  */}
          lên làm huấn luyện viên không?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseConfirmUpgradeModal}>
            Hủy
          </Button>
          <Button
            variant="success"
            onClick={handleConfirmUpgrade}
            disabled={loading}
          >
            {loading ? "Processing..." : "Xác nhận"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* View User Modal */}
      <Modal show={showViewModal} onHide={handleCloseViewModal}>
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết người dùng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <>
              <img src={selectedUser.avatar} />
              <p>
                <strong>ID:</strong> {selectedUser._id}
              </p>
              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p>
                <strong>Tên:</strong> {selectedUser.name}
              </p>
              <p>
                <strong>Giới tính:</strong> {selectedUser.gender}
              </p>
              <p>
                <strong>Ngày sinh:</strong> {selectedUser.dob}
              </p>
              <p>
                <strong>SĐT:</strong> {selectedUser.phone}
              </p>
              <p>
                <strong>Địa chỉ:</strong> {selectedUser.address}
              </p>
              <p>
                <strong>Vai trò:</strong> {selectedUser.role}
              </p>
              <p>
                <strong>Trạng thái:</strong> {selectedUser.status}
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseViewModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit User Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa người dùng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <Form onSubmit={handleUpdateUser}>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={selectedUser.email}
                  readOnly
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Tên</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={selectedUser.name}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, name: e.target.value })
                  }
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Link Avatar</Form.Label>
                <Form.Control
                  type="url"
                  name="avatar"
                  placeholder="Enter avatar image URL"
                  value={selectedUser.avatar}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, avatar: e.target.value })
                  }
                  required
                />
                <Form.Text className="text-muted">
                  Cung cấp URL hình ảnh hợp lệ (ví dụ:
                  https://example.com/avatar.jpg).
                </Form.Text>
                {selectedUser.avatar && (
                  <div className="mt-3">
                    <img
                      src={selectedUser.avatar}
                      alt="Avatar Preview"
                      style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                      }}
                    />
                  </div>
                )}
              </Form.Group>
              <Form.Group>
                <Form.Label>Giới tính</Form.Label>
                <Form.Control
                  as="select"
                  name="gender"
                  value={selectedUser.gender}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, gender: e.target.value })
                  }
                >
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Ngày sinh</Form.Label>
                <Form.Control
                  type="date"
                  name="dob"
                  value={selectedUser.dob}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, dob: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>SĐT</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={selectedUser.phone}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, phone: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Địa chỉ</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={selectedUser.address}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      address: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseEditModal}>
                  Đóng
                </Button>
                <Button type="submit" variant="primary">
                  Lưu
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Modal.Body>
      </Modal>

      {/* Confirm Block/Unblock User Modal */}
      <Modal show={showConfirmBlockModal} onHide={handleCloseConfirmBlockModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedUser?.status === "activate" ? "Block User" : "Unblock User"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn {selectedUser?.status === "activate" ? "block" : "unblock"} người dùng này ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseConfirmBlockModal}>
            Hủy
          </Button>
          <Button variant="danger"
            onClick={handleBlockUnblockUser}
          >
            {selectedUser?.status === "activate" ? "Block" : "Unblock"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Tạo mới người dùng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CreateUserForm
            onUserCreated={() => {
              onUserCreated();
              handleCloseModal(); // Đóng modal sau khi user được tạo
            }}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ManagerUser;

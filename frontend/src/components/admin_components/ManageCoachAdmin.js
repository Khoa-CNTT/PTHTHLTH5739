import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal, Form, Row, Col } from "react-bootstrap";
import { Pie } from "react-chartjs-2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TextField, InputAdornment } from "@mui/material";

import {
  faSearch,
  faEye,
  faEdit,
  faBan,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import ChartTK from "./ChartTK";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
} from "@mui/material";

const ManagerCoach = () => {
  const [coaches, setCoaches] = useState([]);
  const [filteredCoaches, setFilteredCoaches] = useState([]);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showConfirmBlockModal, setShowConfirmBlockModal] = useState(false);
  const [showConfirmChangeRoleModel, setShowConfirmChangeRoleModel] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [coachesPerPage] = useState(10);
  const [totalCoaches, setTotalCoaches] = useState(0);
  const [todayCoachesCount, setTodayCoachesCount] = useState(0);
  const [activateCoaches, setActivateCoaches] = useState(0);
  const [blockedCoaches, setBlockedCoaches] = useState(0);
  const [nonActivateCoaches, setNonActivateCoaches] = useState(0);
  const { formatGender } = require("../../utils/formatGender");
  useEffect(() => {
    fetchCoaches();
  }, []);

  const fetchCoaches = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/admins/coaches", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data && res.data.coaches) {
        console.log(res.data.coaches);

        setCoaches(res.data.coaches);
        setFilteredCoaches(res.data.coaches);
        setTotalCoaches(res.data.totalCoaches);
        setTodayCoachesCount(res.data.todayCoachesCount);
        setActivateCoaches(res.data.activateCoaches);
        setBlockedCoaches(res.data.blockedCoaches);
        setNonActivateCoaches(res.data.nonActivateCoaches);
      } else {
        throw new Error("Dữ liệu không phải là mảng");
      }
    } catch (err) {
      toast.error("Lỗi khi tải HLV");
      console.error("Lỗi khi tải HLV:", err);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filtered = coaches.filter(
      (coach) =>
        (coach.email &&
          coach.email.toLowerCase().includes(e.target.value.toLowerCase())) ||
        (coach.name &&
          coach.name.toLowerCase().includes(e.target.value.toLowerCase()))
    );
    setFilteredCoaches(Array.isArray(filtered) ? filtered : []);
  };

  const indexOfLastCoach = currentPage * coachesPerPage;
  const indexOfFirstCoach = indexOfLastCoach - coachesPerPage;
  const currentCoaches = filteredCoaches.slice(
    indexOfFirstCoach,
    indexOfLastCoach
  );
  const columns = [
    { key: "avatar", title: "Avatar" },
    { key: "email", title: "Email" },
    { key: "name", title: "Name" },
    { key: "role", title: "Role" },
    { key: "status", title: "Status" },
    { key: "actions", title: "Actions" },
  ];

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleShowViewModal = (coach) => {
    setSelectedCoach(coach);
    setShowViewModal(true);
  };
  const handleCloseViewModal = () => setShowViewModal(false);

  const handleShowEditModal = (coach) => {
    setSelectedCoach(coach);
    setShowEditModal(true);
  };
  const handleCloseEditModal = () => setShowEditModal(false);

  const handleShowConfirmBlockModal = (coach) => {
    setSelectedCoach(coach);
    setShowConfirmBlockModal(true);
  };
  const handleCloseConfirmBlockModal = () => setShowConfirmBlockModal(false);

  const handleShowConfirmChangeToUser = (coach) => {
    setSelectedCoach(coach);
    setShowConfirmChangeRoleModel(true);
  };
  const handleCloseConfirmChangeRoleModal = () =>
    setShowConfirmChangeRoleModel(false);

  const handleUpdateCoach = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `http://localhost:4000/api/admins/coaches/edit`,
        selectedCoach,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success(res.data.msg);
      fetchCoaches();
      handleCloseEditModal();
    } catch (err) {
      toast.error("Không cập nhật được HLV");
    }
  };

  const handleBlockUnblockCoach = async () => {
    if (!selectedCoach) {
      toast.error("Không có hlv nào được chọn");
      return;
    }

    try {
      const newStatus =
        selectedCoach.status === "activate" ? "blocked" : "activate";

      console.log("Đang cập nhật trạng thái HLV:", {
        coachId: selectedCoach.accountId,
        newStatus,
      });

      const res = await axios.patch(
        `http://localhost:4000/api/admins/coaches/${selectedCoach.accountId}/status`,
        {
          status: newStatus,
          coachId: selectedCoach.accountId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success(res.data.msg);
      fetchCoaches();
      handleCloseConfirmBlockModal();
    } catch (err) {
      console.error(
        "Lỗi khi chặn/bỏ chặn HLV:",
        err.response?.data || err.message
      );
      toast.error(err.response?.data?.msg || "Không thể thay đổi trạng thái HLV");
    }
  };

  const handleChangeToUser = async () => {
    if (!selectedCoach) {
      toast.error("Không có hlv nào được chọn");
      return;
    }
    console.log("selectedCoach.accountId", selectedCoach.accountId);

    try {
      const res = await axios.patch(
        `http://localhost:4000/api/admins/coaches/${selectedCoach.accountId}/changeRole`,
        {
          coachId: selectedCoach.accountId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success(res.data.msg);
      fetchCoaches();
      handleCloseConfirmChangeRoleModal();
    } catch (err) {
      console.error(
        "Lỗi khi cập nhật vai trò HLV:",
        err.response?.data || err.message
      );
      toast.error(err.response?.data?.msg || "Không thể thay đổi vai trò HLV");
    }
  };

  const pieData = {
    labels: ["Activate Coaches", "Blocked Coaches", "Non-activate Coaches"],
    datasets: [
      {
        data: [activateCoaches, blockedCoaches, nonActivateCoaches], // Dữ liệu từ state
        backgroundColor: ["#4caf50", "#f44336", "#C0C0C0"], // Màu sắc cho từng trạng thái
        hoverBackgroundColor: ["#45a049", "#e53935", "#808080"], // Màu khi hover
      },
    ],
  };

  return (

    <div style={{ padding: "20px" }}>
      <h2 className="mb-4" >
        Quản lý HLV
      </h2>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <ChartTK
        title={"Trạng thái HLV"}
        active={activateCoaches}
        block={blockedCoaches}
        non={nonActivateCoaches}
        label1={"Huấn luyện viên được kích hoạt"}
        label2={"Huấn luyện viên bị chặn"}
        label3={"Huấn luyện viên không kích hoạt"}
      />

      <br></br>
      <div className="mb-4">
        <h4 style={{ color: 'black' }}>
          HLV được tạo hôm nay: {todayCoachesCount}
        </h4>
      </div>

      <div className=" justify-content-between mb-4">
        <div>
          <TextField
            variant="outlined"
            placeholder="Tìm kiếm theo email hoặc tên"
            value={searchTerm}
            onChange={handleSearch}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton edge="start">
                    <FontAwesomeIcon
                      icon={faSearch}
                      style={{ color: "#000" }}
                    />
                  </IconButton>
                </InputAdornment>
              ),
              style: {
                backgroundColor: "#F2F2F2",
                color: "#000",
              },
            }}
            sx={{ maxWidth: 300 }} // chiều rộng tối đa
          />
        </div>
      </div>

      {/* Coaches List */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="coaches table">
          <TableHead style={{ fontWeight: 'bold', backgroundColor: '#F2F2F2' }}>
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
                Trạng thái
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                Hành động
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentCoaches.map((coach) => (
              <TableRow
                key={coach._id}
                sx={{
                  backgroundColor:
                    coach.status === "activate" ? "#d5f5dc" : "#FCC5C5",
                  "&:hover": {
                    backgroundColor:
                      coach.status === "activate" ? "#a3d9a3" : "#F88D8D", // hover khi di chuột
                  },
                }}
              >
                <TableCell>
                  <img
                    src={coach.avatar || "https://via.placeholder.com/50"}
                    alt="avatar"
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                    }}
                  />
                </TableCell>
                <TableCell>{coach.email}</TableCell>
                <TableCell>{coach.name}</TableCell>
                <TableCell>{coach.status}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleShowViewModal(coach)}>
                    <FontAwesomeIcon icon={faEye} />
                  </IconButton>
                  <IconButton onClick={() => handleShowEditModal(coach)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </IconButton>
                  <IconButton
                    onClick={() => handleShowConfirmBlockModal(coach)}
                  >
                    <FontAwesomeIcon
                      icon={coach.status === "activate" ? faBan : faCheck}
                    />
                  </IconButton>
                  <Button onClick={() => handleShowConfirmChangeToUser(coach)}>
                    Quay lại vai trò cũ
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Phân trang */}
      <nav>
        <ul className="pagination justify-content-center">
          {Array.from({
            length: Math.ceil(filteredCoaches.length / coachesPerPage),
          }).map((_, index) => (
            <li key={index} className="page-item">
              <button onClick={() => paginate(index + 1)} className="page-link">
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Modal xem chi tiêt HLV */}
      <Modal show={showViewModal} onHide={handleCloseViewModal}>
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết HLV</Modal.Title>
        </Modal.Header>
        <Modal.Body >
          {selectedCoach && (
            <>
              <div className="d-flex justify-content-center mb-3">
                <img src={selectedCoach.avatar} alt="Avatar" style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }} />
              </div>
              <Row className="mb-2">
                <Col md={4}><strong>Email:</strong></Col>
                <Col md={8}>{selectedCoach.email}</Col>
              </Row>
              <Row className="mb-2">
                <Col md={4}><strong>Tên:</strong></Col>
                <Col md={8}>{selectedCoach.name}</Col>
              </Row>
              <Row className="mb-2">
                <Col md={4}><strong >Giới tính:</strong></Col>
                <Col md={8} >{formatGender(selectedCoach.gender)}</Col>
              </Row>
              <Row className="mb-2">
                <Col md={4}><strong>Ngày sinh:</strong></Col>
                <Col md={8}>{selectedCoach.dob}</Col>
              </Row>
              <Row className="mb-2">
                <Col md={4}><strong>SĐT:</strong></Col>
                <Col md={8}>{selectedCoach.phone}</Col>
              </Row>
              <Row className="mb-2">
                <Col md={4}><strong>Địa chỉ:</strong></Col>
                <Col md={8}>{selectedCoach.address}</Col>
              </Row>
              <Row className="mb-2">
                <Col md={4}><strong>Trạng thái:</strong></Col>
                <Col md={8}>{selectedCoach.status}</Col>
              </Row>
              <Row className="mb-3">
                <Col md={4}><strong>Giới thiệu:</strong></Col>
                <Col md={8}>{selectedCoach.introduce}</Col>
              </Row>

              {selectedCoach.selfImage && selectedCoach.selfImage.length > 0 && (
                <div className="mb-3">
                  <strong>Hình ảnh bản thân:</strong>
                  <div className="d-flex flex-wrap">
                    {selectedCoach.selfImage.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Hình ảnh bản thân ${index + 1}`}
                        style={{ width: '100px', height: '100px', marginRight: '10px', marginBottom: '10px', objectFit: 'cover', borderRadius: '5px' }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {selectedCoach.certificate && selectedCoach.certificate.length > 0 && (
                <div className="mb-3">
                  <strong>Giấy chứng nhận:</strong>
                  <div className="d-flex flex-wrap">
                    {selectedCoach.certificate.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Giấy chứng nhận ${index + 1}`}
                        style={{ width: '100px', height: '100px', marginRight: '10px', marginBottom: '10px', objectFit: 'cover', borderRadius: '5px' }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-3">
                <strong>Kinh nghiệm:</strong>
                {selectedCoach.experience.map((exp, index) => (
                  <div key={index} className="mb-2">
                    <div><strong>Thời gian:</strong> {exp.time}</div>
                    <div><strong>Nơi làm việc:</strong> {exp.workplace}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseViewModal}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Chỉnh sửa HLV Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa HLV</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCoach && (
            <Form>
              {/* Email - Read-only */}
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={selectedCoach.email}
                  readOnly
                />
              </Form.Group>

              {/* Avatar URL - Chỉnh sửa URL và xem trước */}
              <Form.Group>
                <Form.Label>URL ảnh đại diện</Form.Label>
                <Form.Control
                  type="text"
                  name="avatar"
                  value={selectedCoach.avatar}
                  onChange={(e) =>
                    setSelectedCoach({
                      ...selectedCoach,
                      avatar: e.target.value,
                    })
                  }
                />
                {/* Xem trước ảnh khi người dùng nhập URL */}
                {selectedCoach.avatar && (
                  <div>
                    <img
                      src={selectedCoach.avatar}
                      alt="Xem trước Avatar"
                      style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                        marginTop: "10px",
                      }}
                    />
                  </div>
                )}
              </Form.Group>

              {/* Tên */}
              <Form.Group>
                <Form.Label>Tên</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={selectedCoach.name}
                  onChange={(e) =>
                    setSelectedCoach({ ...selectedCoach, name: e.target.value })
                  }
                />
              </Form.Group>

              {/* Giới tính */}
              <Form.Group>
                <Form.Label>Giới tính</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedCoach.gender}
                  onChange={(e) =>
                    setSelectedCoach({
                      ...selectedCoach,
                      gender: e.target.value,
                    })
                  }
                >
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                </Form.Control>
              </Form.Group>

              {/* Ngày sinh */}
              <Form.Group>
                <Form.Label>Ngày sinh</Form.Label>
                <Form.Control
                  type="date"
                  name="dob"
                  value={selectedCoach.dob}
                  onChange={(e) =>
                    setSelectedCoach({ ...selectedCoach, dob: e.target.value })
                  }
                />
              </Form.Group>

              {/* SĐT */}
              <Form.Group>
                <Form.Label>SĐT</Form.Label>
                <Form.Control
                  type="tel"
                  name="phone"
                  value={selectedCoach.phone}
                  onChange={(e) =>
                    setSelectedCoach({
                      ...selectedCoach,
                      phone: e.target.value,
                    })
                  }
                />
              </Form.Group>

              {/* Địa chỉ */}
              <Form.Group>
                <Form.Label>Địa chỉ</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={selectedCoach.address}
                  onChange={(e) =>
                    setSelectedCoach({
                      ...selectedCoach,
                      address: e.target.value,
                    })
                  }
                />
              </Form.Group>

              {/* Trạng thái */}
              <Form.Group>
                <Form.Label>Trạng thái</Form.Label>
                <Form.Control
                  type="text"
                  name="status"
                  value={selectedCoach.status}
                  onChange={(e) =>
                    setSelectedCoach({
                      ...selectedCoach,
                      status: e.target.value,
                    })
                  }
                  readOnly
                />
              </Form.Group>

              {/* Giới thiệu */}
              <Form.Group>
                <Form.Label>Giới thiệu</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="introduce"
                  value={selectedCoach.introduce}
                  onChange={(e) =>
                    setSelectedCoach({
                      ...selectedCoach,
                      introduce: e.target.value,
                    })
                  }
                />
              </Form.Group>

              {/* URL hình ảnh tự chụp */}
              <Form.Group>
                <Form.Label>URL hình ảnh tự chụp</Form.Label>
                <Form.Control
                  type="text"
                  name="selfImage"
                  value={selectedCoach.selfImage.join(", ")}
                  onChange={(e) => {
                    const updatedSelfImage = e.target.value.split(", ");
                    setSelectedCoach({
                      ...selectedCoach,
                      selfImage: updatedSelfImage,
                    });
                  }}
                />
                {/* Xem trước các ảnh từ URL */}
                {selectedCoach.selfImage &&
                  selectedCoach.selfImage.length > 0 && (
                    <div>
                      {selectedCoach.selfImage.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`URL hình ảnh tự chụp ${index + 1}`}
                          style={{
                            width: "100px",
                            height: "100px",
                            marginRight: "10px",
                            marginTop: "10px",
                          }}
                        />
                      ))}
                    </div>
                  )}
              </Form.Group>

              {/* Hợp đồng URL */}
              <Form.Group>
                <Form.Label>Hợp đồng URL</Form.Label>
                <Form.Control
                  type="text"
                  name="contract"
                  value={selectedCoach.contract}
                  onChange={(e) =>
                    setSelectedCoach({
                      ...selectedCoach,
                      contract: e.target.value,
                    })
                  }
                />
              </Form.Group>

              {/* Chứng chỉ URL */}
              <Form.Group>
                <Form.Label>URL chứng chỉ</Form.Label>
                <Form.Control
                  type="text"
                  name="certificate"
                  value={selectedCoach.certificate.join(", ")}
                  onChange={(e) => {
                    const updatedCertificates = e.target.value.split(", ");
                    setSelectedCoach({
                      ...selectedCoach,
                      certificate: updatedCertificates,
                    });
                  }}
                />
                {/* Xem trước các ảnh chứng chỉ từ URL */}
                {selectedCoach.certificate &&
                  selectedCoach.certificate.length > 0 && (
                    <div>
                      {selectedCoach.certificate.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Certificate ${index + 1}`}
                          style={{
                            width: "100px",
                            height: "100px",
                            marginRight: "10px",
                            marginTop: "10px",
                          }}
                        />
                      ))}
                    </div>
                  )}
              </Form.Group>


            </Form>

          )}
        </Modal.Body>
        <Modal.Footer>
          {/* Button lưu */}
          <Button variant="primary"
            onClick={handleUpdateCoach}
          >
            Lưu
          </Button>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Đóng
          </Button>


        </Modal.Footer>
      </Modal>

      {/* Modal xác nhận block */}
      <Modal show={showConfirmBlockModal} onHide={handleCloseConfirmBlockModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedCoach?.status === "activate"
              ? "Block HLV"
              : "Unblock HLV"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn{" "}
          {selectedCoach?.status === "activate" ? "block" : "unblock"}{" "}
          HLV này?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseConfirmBlockModal}>
            Hủy
          </Button>
          <Button variant="danger" color="danger"
            onClick={handleBlockUnblockCoach}
          >
            {selectedCoach?.status === "activate" ? "Block" : "Unblock"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal thay đổi vai trò */}
      <Modal
        show={showConfirmChangeRoleModel}
        onHide={handleCloseConfirmChangeRoleModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Xác nhận thay đổi
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn thay đổi vai trò huấn luyện viên này không?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleCloseConfirmChangeRoleModal}
          >
            Hủy
          </Button>
          <Button variant="primary"
            onClick={handleChangeToUser}
          >
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManagerCoach;

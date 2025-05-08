import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Card,
  Button,
  List,
  Spin,
  Form,
  Input,
  message,
  Row,
  Col,
  Tabs,
  Typography,
  Modal,
  Popconfirm,
} from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined, LeftOutlined } from "@ant-design/icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import EditWorkoutModal from "./EditWorkoutModal"; // Import modal
import { toast, ToastContainer } from "react-toastify";

const { TabPane } = Tabs;
const { Title } = Typography;

const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    slotNumber: "",
    category: "",
    discount: 0,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [isNewWorkout, setIsNewWorkout] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [workoutToDelete, setWorkoutToDelete] = useState(null);

  //Lấy dữ liệu khóa học
  const fetchCourseData = async () => {
    if (!courseId) return;

    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:4000/api/coaches/course/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setCourse(response.data);
      setFormData({
        name: response.data.name,
        description: response.data.description,
        price: response.data.price,
        slotNumber: response.data.slotNumber,
        category: response.data.category,
        discount: response.data.discount,
      });
    } catch (error) {
      message.error("Lỗi khi tải dữ liệu khóa học");
      toast.error("Lỗi khi tải dữ liệu khóa học");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  // Xóa bài tập
  const handleDeleteWorkout = (workoutId) => {
    const updatedCourse = {
      ...course,
      workout: course.workout.filter((workout) => workout._id !== workoutId),
    };
    setCourse(updatedCourse);
  };
  // hiện modal xác nhân xóa bài tập
  const showDeleteConfirmModal = (workoutId) => {
    setWorkoutToDelete(workoutId);
    setDeleteModalVisible(true);
  };
  // xác nhận xóa
  const handleConfirmDelete = () => {
    handleDeleteWorkout(workoutToDelete);
    setDeleteModalVisible(false);
    setWorkoutToDelete(null);
  };
  // hủy xóa
  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
    setWorkoutToDelete(null);
  };

  // Lưu các thay đổi của khóa học
  const handleSaveChanges = () => {
    const updatedCourse = {
      ...course,
      name: formData.name,
      description: formData.description,
      price: formData.price,
      slotNumber: formData.slotNumber,
      category: formData.category,
      discount: formData.discount,
    };

    axios
      .put(
        `http://localhost:4000/api/coaches/course/update/${courseId}`,
        updatedCourse,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(() => {
        fetchCourseData();
        message.success("Khóa học đã được cập nhật thành công!");
        toast.success("Khóa học đã được cập nhật thành công!");
      })
      .catch(() => {
        message.error("Lỗi khi cập nhật khóa học");
        toast.error("Lỗi khi cập nhật khóa học");
      });
  };

  // Chỉnh sửa bài tập
  const handleEditWorkout = (workout) => {
    setCurrentWorkout(workout);
    setIsNewWorkout(false); // Đặt thành false khi chỉnh sửa bài tập đã có
    setIsModalVisible(true);
  };

  // Lưu bài tập mới hoặc đã chỉnh sửa
  const handleSaveWorkout = () => {
    const updatedCourse = {
      ...course,
      workout: course.workout.map((workout) =>
        workout._id === currentWorkout._id ? currentWorkout : workout
      ),
    };
    setCourse(updatedCourse);
    setIsModalVisible(false);
  };

  if (loading) {
    return (
      <div className="text-center">
        <Spin size="large" /> Đang tải ...
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "20px" }}>
      <Row gutter={[16, 16]} style={{ width: "100%" }}>
        <Col span={16}>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            <Button
              icon={<LeftOutlined />}
              onClick={() => navigate(-1)}
              style={{ marginRight: "10px" }} // Thêm một chút khoảng cách
            >
              Quay lại
            </Button>
            <Button
              type="default"
              icon={<EditOutlined />}
              onClick={handleSaveChanges}
              disabled={course.isDeleted || course.status === "accepted"} // Disable nếu khóa học bị xóa hoặc trạng thái là 'accepted'
            >
              Lưu
            </Button>
          </div>

          <Card
            style={{
              borderRadius: "12px",
              boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
              padding: "20px",
              width: "100%",
              maxWidth: "1000px",
              margin: "0 auto",
              display: "flex",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            {/* Hình ảnh bên trái */}
            <div style={{ flex: "1", minWidth: "250px" }}>
              <img
                alt={course.name}
                src={course.image[0] || "default-image-url"}
                style={{ width: "100%", borderRadius: "10px" }}
              />
            </div>

            {/* Thông tin khóa học và Tab bài tập */}
            <div style={{ flex: "2", paddingLeft: "20px", maxWidth: "650px" }}>
              <h2
                style={{ fontSize: "2rem", fontWeight: "700", color: "#333" }}
              >
                Chỉnh sửa khóa học
              </h2>
              <div>
                <label>Tên</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  style={{ marginBottom: "10px" }}
                />
              </div>
              <div>
                <label>Mô tả</label>
                <ReactQuill
                  theme="snow"
                  value={formData.description}
                  onChange={(value) =>
                    setFormData({ ...formData, description: value })
                  }
                  style={{ marginBottom: "10px" }}
                />
              </div>
              <Tabs defaultActiveKey="1">
                <TabPane tab="Thông tin khóa học" key="1">
                  <div>
                    <label>Giá tiền</label>
                    <Input
                      name="price"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      style={{ marginBottom: "10px" }}
                    />
                  </div>
                  <div>
                    <label>Giảm giá</label>
                    <Input
                      name="discount"
                      value={formData.discount}
                      onChange={(e) =>
                        setFormData({ ...formData, discount: e.target.value })
                      }
                      style={{ marginBottom: "10px" }}
                    />
                  </div>
                  <div>
                    <label>Loại</label>
                    <Input
                      name="category"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      style={{ marginBottom: "10px" }}
                    />
                  </div>

                  <div>
                    <label>Số bài tập</label>
                    <Input
                      name="slotNumber"
                      value={formData.slotNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, slotNumber: e.target.value })
                      }
                      style={{ marginBottom: "10px" }}
                    />
                  </div>
                </TabPane>
                <TabPane tab="Bài tập" key="2">
                  <List
                    itemLayout="horizontal"
                    dataSource={course.workout}
                    renderItem={(item) => (
                      <List.Item
                        actions={[
                          <Button
                            icon={<EditOutlined />}
                            onClick={() => handleEditWorkout(item)}
                          />,
                          <Button
                            icon={<DeleteOutlined />}
                            onClick={() => showDeleteConfirmModal(item._id)}
                          />,
                        ]}
                      >
                        {/* Modal xác nhận xóa */}
                        <Modal
                          title="Xác nhận xóa"
                          visible={deleteModalVisible}
                          onOk={handleConfirmDelete}
                          onCancel={handleCancelDelete}
                          okText="Xóa"
                          cancelText="Hủy"
                        >
                          <p>Bạn có chắc chắn muốn xóa bài tập này không?</p>
                        </Modal>
                        <List.Item.Meta
                          title={item.name}
                          description={`Date: ${new Date(
                            item.date
                          ).toLocaleDateString()}`}
                        />
                      </List.Item>
                    )}
                  />
                </TabPane>
              </Tabs>
            </div>
          </Card>
        </Col>
      </Row>

      <EditWorkoutModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        currentWorkout={currentWorkout}
        setCurrentWorkout={setCurrentWorkout}
        handleSaveWorkout={handleSaveWorkout}
        isNewWorkout={isNewWorkout} // Pass isNewWorkout to the modal
      />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover/>
    </div>
  );
};

export default CourseDetails;

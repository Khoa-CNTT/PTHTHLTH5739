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
import EditWorkoutModal from "./EditWorkoutModal"; // Import component modal chỉnh sửa workout

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
  const [isNewWorkout, setIsNewWorkout] = useState(false); // State cho biết có phải là workout mới hay không

  // Lấy dữ liệu khóa học
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  // Xóa workout
  const handleDeleteWorkout = (workoutId) => {
    const updatedCourse = {
      ...course,
      workout: course.workout.filter((workout) => workout._id !== workoutId),
    };
    setCourse(updatedCourse);
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
      })
      .catch(() => {
        message.error("Lỗi khi cập nhật dữ liệu khóa học");
      });
  };

  // Chỉnh sửa workout
  const handleEditWorkout = (workout) => {
    setCurrentWorkout(workout);
    setIsNewWorkout(false); // Đặt thành false khi chỉnh sửa workout hiện có
    setIsModalVisible(true);
  };

  // Thêm workout mới
  const handleAddWorkout = () => {
    const newWorkout = {
      _id: null, // Tạo id ngẫu nhiên
      name: "Workout Mới",
      preview: { video: "", advice: "" },
      progressId: [],
      listVideo: [],
    };
    setCourse({ ...course, workout: [...course.workout, newWorkout] });
    setCurrentWorkout(newWorkout); // Đặt workout hiện tại thành workout vừa tạo
    setIsNewWorkout(true);
  };

  // Lưu workout mới hoặc đã chỉnh sửa
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
              Trở lại
            </Button>
            <Button
              type="default"
              icon={<EditOutlined />}
              onClick={handleSaveChanges}
              disabled={course.isDeleted || course.status === "accepted"} // Vô hiệu hóa nếu khóa học đã bị xóa hoặc trạng thái là 'đã chấp nhận'
            >
              Lưu thay đổi
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

            {/* Thông tin khóa học và Tabs Workout */}
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
                  <div><label>Giá khóa học</label>
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
                    <label>Danh mục</label>
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
                    <label>Số lượng slot</label>
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
                <TabPane tab="Workouts" key="2">
                  <Button
                    icon={<PlusOutlined />}
                    type="primary"
                    onClick={handleAddWorkout}
                    style={{ marginBottom: "20px" }}
                  >
                    Thêm Workout mới
                  </Button>

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
                            onClick={() => handleDeleteWorkout(item._id)}
                          />,
                        ]}
                      >
                        <List.Item.Meta
                          title={item.name}
                          description={`Ngày: ${new Date(
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
        isNewWorkout={isNewWorkout} // Truyền isNewWorkout vào modal
      />
    </div>
  );
};

export default CourseDetails;
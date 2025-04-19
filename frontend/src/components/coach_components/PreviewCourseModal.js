import React from "react";
import { Modal } from "react-bootstrap";
import {
  Card,
  List,
  Row,
  Col,
  Tabs,
  Typography,
  Button as AntButton,
} from "antd";
import { ClockCircleOutlined } from "@ant-design/icons"; // Nhập icon

const { TabPane } = Tabs;
const { Title, Text } = Typography;

const PreviewCourseModal = ({
  show,
  onClose,
  courseData,
  workoutDetails,
  fileList, // Thêm fileList như một prop
}) => {
  // Lấy danh sách bài tập từ tất cả các buổi tập
  console.log(workoutDetails);
  // Lấy ảnh đầu tiên từ fileList (nếu có)
  const imageUrl =
    fileList && fileList.length > 0
      ? fileList[0].thumbUrl
      : "https://via.placeholder.com/250"; // Mặc định là placeholder nếu không có ảnh

  return (
    <Modal show={show} onHide={onClose} centered size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Xem Trước Khóa Học</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Card
          style={{
            borderRadius: "12px",
            boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
            padding: "20px",
          }}
        >
          {/* Tên khóa học */}
          <Title
            level={3}
            style={{ marginBottom: "20px", textAlign: "center" }}
          >
            {courseData.name}
          </Title>

          <Row gutter={[16, 16]}>
            {/* Phần hình ảnh */}
            <Col span={8}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                  borderRadius: "10px",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <img
                  alt={courseData.name}
                  src={imageUrl} // Sử dụng imageUrl từ fileList
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                  }}
                />
              </div>
            </Col>

            {/* Thông tin khóa học */}
            <Col span={16}>
              <Tabs defaultActiveKey="1">
                {/* Tab Thông tin khóa học */}
                <TabPane tab="Thông Tin Khóa Học" key="1">
                  <List
                    bordered
                    dataSource={[
                      { label: "Mô tả", value: courseData.description },
                      {
                        label: "Giá",
                        value: `${courseData.price.toLocaleString()} VND`,
                      },
                      { label: "Giảm giá", value: `${courseData.discount}%` },
                      { label: "Số lượng bài tập", value: courseData.slotNumber },
                      { label: "Thể loại", value: courseData.category },
                    ]}
                    renderItem={(item) => (
                      <List.Item>
                        <Text strong>{item.label}:</Text>{" "}
                        {item.label === "Mô tả" ? (
                          <div
                            style={{
                              fontSize: "1rem",
                              color: "#333",
                              lineHeight: "1.6",
                            }}
                            dangerouslySetInnerHTML={{
                              __html: item.value,
                            }}
                          />
                        ) : (
                          <Text>{item.value}</Text>
                        )}
                      </List.Item>
                    )}
                  />
                </TabPane>

                {/* Tab Buổi tập */}
                <TabPane tab="Buổi Tập" key="2">
                  {/* Lặp qua thông tin chi tiết của từng buổi tập */}
                  {workoutDetails && workoutDetails.length > 0 ? (
                    workoutDetails.map((workout) => (
                      <Card
                        key={workout._id}
                        style={{
                          marginBottom: "20px",
                          borderRadius: "8px",
                          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <Title level={4}>{workout.name}</Title>
                        <List
                          bordered
                          dataSource={workout.exercises}
                          renderItem={(exercises) => (
                            <List.Item>
                              <div>
                                <Text strong>{exercises.name}</Text> - Thời lượng:{" "}
                                {exercises.exerciseDuration} phút - Độ khó:{" "}
                                <Text>{exercises.difficulty}</Text> - Loại:{" "}
                                {exercises.exerciseType}
                              </div>
                            </List.Item>)}
                        />
                      </Card>
                    ))
                  ) : (
                    <Text>Chưa có thông tin chi tiết về buổi tập</Text>
                  )}
                </TabPane>
              </Tabs>
            </Col>
          </Row>
        </Card>
      </Modal.Body>
      <Modal.Footer>
        <AntButton onClick={onClose} style={{ marginRight: "10px" }}>
          Đóng
        </AntButton>
        <AntButton type="primary" onClick={onClose}>
          Xác nhận & Gửi
        </AntButton>
      </Modal.Footer>
    </Modal>
  );
};

export default PreviewCourseModal;
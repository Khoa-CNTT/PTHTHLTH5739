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

const { TabPane } = Tabs;
const { Title, Text } = Typography;

const PreviewCourseModal = ({
  show,
  onClose,
  courseData,
  workoutDetails,
  fileList, // Add fileList as a prop
}) => {
  // Flattening exercises from all workouts
  console.log(workoutDetails);
  // Get the first image from the fileList (if available)
  const imageUrl =
    fileList && fileList.length > 0
      ? fileList[0].thumbUrl
      : "https://via.placeholder.com/250"; // Default to placeholder if no image

  return (
    <Modal show={show} onHide={onClose} centered size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Xem trước khóa học</Modal.Title>
      </Modal.Header>
      <Modal.Body>
          {/* Course Name */}
          <Title
            level={3}
            style={{ marginBottom: "20px", textAlign: "center" }}
          >
            {courseData.name}
          </Title>

          <Row gutter={[16, 16]}>
            {/* Image Section */}
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
                  src={imageUrl} // Use imageUrl from fileList
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                  }}
                />
              </div>
            </Col>

            {/* Course Info */}
            <Col span={16}>
              <Tabs defaultActiveKey="1">
                {/* Course Information Tab */}
                <TabPane tab="Thông tin khóa học" key="1">
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
                      { label: "Loại", value: courseData.category },
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

                {/* Workouts Tab */}
                <TabPane tab="Bài tập" key="2">
                  {/* Iterate over workout details */}
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
                                {exercises.exerciseDuration}phút - Độ khó:{" "}
                                <Text>{exercises.difficulty}</Text>- Kiểu:{" "}
                                {exercises.exerciseType}
                              </div>
                            </List.Item>
                          )}
                        />
                      </Card>
                    ))
                  ) : (
                    <Text>Không có thông tin chi tiết về bài tập</Text>
                  )}
                </TabPane>
              </Tabs>
            </Col>
          </Row>
        
      </Modal.Body>
      <Modal.Footer>
        <AntButton onClick={onClose} style={{ marginRight: "10px" }}>
          Đóng
        </AntButton>
        
      </Modal.Footer>
    </Modal>
  );
};

export default PreviewCourseModal;

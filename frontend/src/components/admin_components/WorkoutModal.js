import React from "react";
import { Modal, Input, List, Button, Tag } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import ReactPlayer from "react-player";

const WorkoutModal = ({
  isModalVisible,
  setIsModalVisible,
  currentWorkout,
}) => {
  const renderVideo = (videoUrl) => {
    if (
      videoUrl.includes("youtube.com") ||
      videoUrl.includes("youtube.com/shorts")
    ) {
      return (
        <ReactPlayer url={videoUrl} width="100%" height="300px" controls />
      );
    } else if (videoUrl.includes("cloudinary.com")) {
      return (
        <ReactPlayer url={videoUrl} width="100%" height="300px" controls />
      );
    } else {
      return (
        <ReactPlayer url={videoUrl} width="100%" height="300px" controls />
      );
    }
  };

  console.log(currentWorkout);

  return (
    <Modal
      //title="Thông tin tập luyện"
      visible={isModalVisible}
      onCancel={() => setIsModalVisible(false)}
      footer={null}
      width={800}
      style={{ zIndex: 9999 }} // Increased zIndex value
      getContainer={false} // Render the modal inside the current container (prevents conflicts with other elements)
    >
      <div>
        <h1>Thông tin tập luyện</h1>
        <h3>Tên bài tập</h3>
        <Input
          value={currentWorkout?.name}
          style={{ marginBottom: "20px" }}
          disabled
        />
        <h3>Bài tập</h3>
        <List
          itemLayout="horizontal"
          dataSource={currentWorkout?.progressId}
          renderItem={(item) => {
            const exercise = item.exerciseId;
            if (!exercise?.name) {
              return null;
            }
            return (
              <List.Item>
                <List.Item.Meta
                  title={exercise?.name}
                  description={`Loại: ${exercise?.exerciseType}`}
                />
                {/* <Tag color="blue">{`Completion: ${item?.completionRate}%`}</Tag> */}
              </List.Item>
            );
          }}
        />

        <h3>Videos</h3>
        <div style={{ marginBottom: "20px" }}>
          {currentWorkout?.listVideo?.length > 0 ? (
            currentWorkout.listVideo.map((videoUrl, index) => (
              <div key={index} style={{ marginBottom: "10px" }}>
                {renderVideo(videoUrl)}
              </div>
            ))
          ) : (
            <p>Không có video nào có sẵn</p>
          )}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "10px",
            marginTop: "20px",
          }}
        >
          <Button
            icon={<CloseOutlined />}
            onClick={() => setIsModalVisible(false)}
            type="default"
          >
            Đóng
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default WorkoutModal;

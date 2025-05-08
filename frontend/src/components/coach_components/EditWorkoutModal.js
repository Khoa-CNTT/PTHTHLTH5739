import React, { useState, useEffect } from "react";
import { Modal, Input, List, Checkbox, Button, Tag, Row, Col } from "antd";
import { CloseOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import ReactPlayer from "react-player";
import { toast, ToastContainer } from "react-toastify";


const EditWorkoutModal = ({
  isModalVisible,
  setIsModalVisible,
  currentWorkout,
  setCurrentWorkout,
  handleSaveWorkout,
  isNewWorkout,
}) => {
  const [exercises, setExercises] = useState([]);

  // Lấy tất cả các bài tập khi modal hiển thị
  useEffect(() => {
    if (isModalVisible) {
      axios
        .get("http://localhost:4000/api/coaches/exercises", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          setExercises(response.data);
        })
        .catch((error) => {
          console.error("Lỗi khi lấy danh sách bài tập:", error);
          toast.error("Lỗi khi lấy danh sách bài tập");
        });
    }
  }, [isModalVisible]);

  // Reset trạng thái currentWorkout nếu đang tạo workout mới
  useEffect(() => {
    if (isNewWorkout) {
      setCurrentWorkout({
        name: "",
        progressId: [],
        listVideo: [], // Khởi tạo listVideo là một mảng trống khi tạo workout mới
      });
    }
  }, [isNewWorkout, setCurrentWorkout]);

  // Cập nhật tên workout
  const handleWorkoutNameChange = (e) => {
    setCurrentWorkout({
      ...currentWorkout,
      name: e.target.value,
    });
  };

  // Xử lý thay đổi checkbox bài tập
  const handleExerciseCheckboxChange = (exerciseId, checked) => {
    const newProgress = [...(currentWorkout.progressId || [])];
    if (checked) {
      if (
        !newProgress.some((exercise) => exercise.exerciseId._id === exerciseId)
      ) {
        const exerciseData = exercises.find(
          (exercise) => exercise._id === exerciseId
        );
        const newProgressItem = {
          _id: null,
          exerciseId: {
            _id: exerciseData._id,
            name: exerciseData.name,
            exerciseType: exerciseData.exerciseType,
            exerciseDuration: exerciseData.exerciseDuration,
          },
          note: "Chưa bắt đầu",
          completionRate: "0",
        };
        newProgress.push(newProgressItem);
        // Thêm video liên quan đến bài tập vào listVideo
        setCurrentWorkout({
          ...currentWorkout,
          progressId: newProgress,
          listVideo: [...currentWorkout.listVideo, exerciseData.video],
        });
      }
    } else {
      const filteredProgress = newProgress.filter(
        (exercise) => exercise.exerciseId._id !== exerciseId
      );
      newProgress.length = 0;
      newProgress.push(...filteredProgress);
      // Xóa video liên quan đến bài tập khỏi listVideo
      const exerciseData = exercises.find(
        (exercise) => exercise._id === exerciseId
      );
      setCurrentWorkout({
        ...currentWorkout,
        progressId: newProgress,
        listVideo: currentWorkout.listVideo.filter(
          (videoUrl) => videoUrl !== exerciseData.video
        ),
      });
    }
  };

  // Xử lý xóa video khỏi listVideo
  const handleRemoveVideo = (videoUrl) => {
    setCurrentWorkout({
      ...currentWorkout,
      listVideo: currentWorkout.listVideo.filter((url) => url !== videoUrl),
    });
  };

  // Hàm hiển thị video
  const renderVideo = (videoUrl) => {
    if (
      videoUrl.includes("youtube.com") ||
      videoUrl.includes("youtube.com/shorts")
    ) {
      // Xử lý YouTube và YouTube Shorts
      return <ReactPlayer url={videoUrl} width="100%" height="100%" controls />;
    } else if (videoUrl.includes("cloudinary.com")) {
      // Xử lý Cloudinary
      return <ReactPlayer url={videoUrl} width="100%" height="100%" controls />;
    } else {
      // Hiển thị video mặc định
      return <ReactPlayer url={videoUrl} width="100%" height="100%" controls />;
    }
  };

  return (
    <Modal
      title={isNewWorkout ? "Tạo Workout Mới" : "Chỉnh Sửa Workout"}
      visible={isModalVisible}
      onCancel={() => setIsModalVisible(false)}
      footer={null}
      width={800} // Tăng chiều rộng của modal
    >
      <div>
        <label>Tên Workout</label>
        <Input
          value={currentWorkout?.name}
          onChange={handleWorkoutNameChange}
          style={{ marginBottom: "20px" }}
        />
        <h3>Bài Tập</h3>
        <Row gutter={[16, 16]}>
          {exercises.map((exercise) => {
            const isChecked = (currentWorkout.progressId || []).some(
              (item) => item.exerciseId?._id === exercise?._id
            );
            return (
              <Col span={12} key={exercise._id}>
                {/* Hiển thị 2 bài tập trên một hàng */}
                <List.Item
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }} // Sử dụng flexbox để căn chỉnh
                >
                  <List.Item.Meta
                    title={exercise.name}
                    description={`Loại: ${exercise.exerciseType} - Thời lượng: ${exercise.exerciseDuration} phút`}
                  />
                  <Checkbox
                    checked={isChecked}
                    onChange={(e) =>
                      handleExerciseCheckboxChange(
                        exercise._id,
                        e.target.checked
                      )
                    }
                  />
                </List.Item>
              </Col>
            );
          })}
        </Row>

        {/* Hiển thị listVideo */}
        <h3>Videos</h3>
        <div style={{ marginBottom: "20px" }}>
          {currentWorkout?.listVideo.length > 0 ? (
            currentWorkout?.listVideo.map((videoUrl, index) => (
              <div
                key={index}
                style={{
                  width: "40%",
                  height: "300px",
                  margin: "10px",
                  marginBottom: "20px",
                  display: "inline-block",
                  verticalAlign: "top",
                  position: "relative",
                }}
              >
                {renderVideo(videoUrl)}
              </div>
            ))
          ) : (
            <p>Không có video nào được chọn</p>
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
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => handleSaveWorkout(currentWorkout)}
          >
            Lưu Workout
          </Button>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover/>
    </Modal>
  );
};

export default EditWorkoutModal;
import React, { useState, useEffect } from "react";
import { Modal, Input, List, Checkbox, Button, Tag, Row, Col } from "antd";
import { CloseOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import ReactPlayer from "react-player";

const EditWorkoutModal = ({
  isModalVisible,
  setIsModalVisible,
  currentWorkout,
  setCurrentWorkout,
  handleSaveWorkout,
  isNewWorkout,
}) => {
  const [exercises, setExercises] = useState([]);

  // Fetch all exercises when modal is visible
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
          console.error("Error fetching exercises:", error);
        });
    }
  }, [isModalVisible]);

  // Reset currentWorkout state if we are creating a new workout
  useEffect(() => {
    if (isNewWorkout) {
      setCurrentWorkout({
        name: "",
        progressId: [],
        listVideo: [], // Initialize listVideo as an empty array when creating a new workout
      });
    }
  }, [isNewWorkout, setCurrentWorkout]);

  // Update workout name
  const handleWorkoutNameChange = (e) => {
    setCurrentWorkout({
      ...currentWorkout,
      name: e.target.value,
    });
  };

  // Handle exercise checkbox change
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
          note: "Not started",
          completionRate: "0",
        };
        newProgress.push(newProgressItem);
        // Add video related to the exercise to listVideo
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
      // Remove video related to the exercise from listVideo
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

  // Handle remove video from listVideo
  const handleRemoveVideo = (videoUrl) => {
    setCurrentWorkout({
      ...currentWorkout,
      listVideo: currentWorkout.listVideo.filter((url) => url !== videoUrl),
    });
  };

  // Function to render the video
  const renderVideo = (videoUrl) => {
    if (
      videoUrl.includes("youtube.com") ||
      videoUrl.includes("youtube.com/shorts")
    ) {
      // Handle YouTube and YouTube Shorts
      return <ReactPlayer url={videoUrl} width="100%" height="100%" controls />;
    } else if (videoUrl.includes("cloudinary.com")) {
      // Handle Cloudinary
      return <ReactPlayer url={videoUrl} width="100%" height="100%" controls />;
    } else {
      // Default video rendering
      return <ReactPlayer url={videoUrl} width="100%" height="100%" controls />;
    }
  };

  return (
    <Modal
      title={isNewWorkout ? "Create New Workout" : "Edit Workout"}
      visible={isModalVisible}
      onCancel={() => setIsModalVisible(false)}
      footer={null}
      width={800} // Increase width of the modal
    >
      <div>
        <label>Workout Name</label>
        <Input
          value={currentWorkout?.name}
          onChange={handleWorkoutNameChange}
          style={{ marginBottom: "20px" }}
        />
        <h3>Exercises</h3>
        <Row gutter={[16, 16]}>
          {exercises.map((exercise) => {
            const isChecked = (currentWorkout.progressId || []).some(
              (item) => item.exerciseId?._id === exercise?._id
            );
            return (
              <Col span={12} key={exercise._id}>
                {/* Display 2 exercises per row */}
                <List.Item
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }} // Use flexbox to align
                >
                  <List.Item.Meta
                    title={exercise.name}
                    description={`Type: ${exercise.exerciseType} - Duration: ${exercise.exerciseDuration} minutes`}
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

        {/* Display listVideo */}
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
                <Button
                  icon={<DeleteOutlined />}
                  size="small"
                  onClick={() => handleRemoveVideo(videoUrl)}
                  style={{ marginTop: "5px", marginBottom: "20px" }}
                >
                  Remove
                </Button>
              </div>
            ))
          ) : (
            <p>No videos selected</p>
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
            Close
          </Button>
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => handleSaveWorkout(currentWorkout)}
          >
            Save Workout
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EditWorkoutModal;

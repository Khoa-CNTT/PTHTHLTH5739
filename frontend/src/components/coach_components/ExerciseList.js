import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import ReactQuill from "react-quill"; // Import React Quill
import "react-quill/dist/quill.snow.css"; // Import CSS of React Quill
import "./ExerciseList.css";
import { uploadVideoToCloudinary } from "../../utils/uploadImage";
import { message } from "antd";
import { Toaster } from "react-hot-toast";
import { toast, ToastContainer } from "react-toastify";

const ExerciseList = () => {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]); // Exercise data from API
  const [searchTerm, setSearchTerm] = useState(""); // Search value
  const [show, setShow] = useState(false); // Show detail modal
  const [showCreateModal, setShowCreateModal] = useState(false); // Show create exercise modal
  const [selectedExercise, setSelectedExercise] = useState(null); // Selected exercise for display in modal
  const [isEditing, setIsEditing] = useState(false); // Edit mode state
  const [newExercise, setNewExercise] = useState({
    name: "",
    description: "",
    exerciseType: "",
    exerciseDuration: "",
    video: "",
    difficulty: "",
  }); // Store new exercise data
  const [videoFile, setVideoFile] = useState(null); // Video file to upload for new exercise
  const [showVideoModal, setShowVideoModal] = useState(false); // State cho video modal
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [uploadProgress, setUploadProgress] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Fetch exercises from API on component mount

  useEffect(() => {
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
        console.error("Lỗi khi tải bài tập:", error);
        toast.error("Lỗi khi tải bài tập");
      });
  }, []);

  // Filter exercises based on search term
  const filteredExercises = exercises.filter(
    (exercise) =>
      !searchTerm ||
      (exercise.name &&
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Show exercise detail in modal
  const handleShow = (exercise) => {
    setSelectedExercise(exercise);
    setIsEditing(false);
    setShow(true);
  };

  // Close detail modal
  const handleClose = () => setShow(false);

  // Toggle edit mode
  const handleEditToggle = () => setIsEditing(true);

  // Save changes to exercise
  const handleSaveChanges = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("Bạn cần phải đăng nhập để cập nhật bài tập.");
      return;
    }

    const exerciseId = selectedExercise._id;

    // If a video file is selected, upload it to Cloudinary
    if (videoFile) {
      try {
        const videoUrl = await uploadVideoToCloudinary(videoFile);
        selectedExercise.video = videoUrl;
      } catch (error) {
        toast.error("Không tải được video lên.");
        return;
      }
    }

    axios
      .put(
        `http://localhost:4000/api/coaches/exercises/${exerciseId}`,
        { ...selectedExercise },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setExercises(
          exercises.map((exercise) =>
            exercise._id === selectedExercise._id ? response.data : exercise
          )
        );
        toast.success("Bài tập đã được cập nhật thành công!");
        setIsEditing(false);
      })
      .catch((error) => {
        console.error("Lỗi khi cập nhật bài tập:", error);
        toast.error("Lỗi khi cập nhật bài tập.");
      });
  };

  // Hàm thực hiện xóa exercise
  const deleteExercise = async (id) => {
    const loadingToast = toast.loading("Delete exercises ...");
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:4000/api/coaches/exercises/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setExercises(exercises.filter((exercise) => exercise._id !== id));
      toast.dismiss(loadingToast);
      toast.success("Xóa bài tập thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa bài tập:", error);
      toast.dismiss(loadingToast);
      toast.error("Lỗi khi xóa bài tập!");
    }
  };

  // Thêm function kiểm tra exercise usage
  const checkExerciseUsage = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/coaches/exercises/check-usage/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Kiểm tra lỗi sử dụng bài tập:", error);
      return { isUsed: false, courses: [] };
    }
  };

  // Cập nhật hàm handleDelete
  const handleDelete = async (id) => {
    try {
      // Kiểm tra xem exercise có đang được sử dụng không
      const { isUsed, courses } = await checkExerciseUsage(id);

      if (isUsed) {
        toast(
          (t) => (
            <div className="confirm-toast">
              <p>
                Không thể xóa bài tập này vì đang được sử dụng trong các khóa
                học:
                <br />
                {courses.map((course) => course.name).join(", ")}
              </p>
              <button
                onClick={() => toast.dismiss(t.id)}
                className="cancel-btn"
              >
                Đóng
              </button>
            </div>
          ),
          {
            duration: 5000,
          }
        );
        return;
      }

      // Nếu không được sử dụng, hiển thị xác nhận xóa
      toast(
        (t) => (
          <div className="confirm-toast">
            <p>Bạn có chắc chắn muốn xóa bài tập này không?</p>
            <div>
              <button
                onClick={() => {
                  deleteExercise(id);
                  toast.dismiss(t.id);
                }}
                className="confirm-btn"
              >
                Delete
              </button>
              <button
                onClick={() => toast.dismiss(t.id)}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        ),
        {
          duration: Infinity,
        }
      );
    } catch (error) {
      console.error("Lỗi:", error);
      toast.error("Đã xảy ra lỗi khi kiểm tra bài tập!");
    }
  };

  // Handle input changes for selected exercise
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedExercise({ ...selectedExercise, [name]: value });
  };

  // Handle description changes in React Quill
  const handleDescriptionChange = (value) => {
    setSelectedExercise({ ...selectedExercise, description: value });
  };

  // Show create exercise modal
  const handleShowCreateModal = () => setShowCreateModal(true);

  // Close create exercise modal
  const handleCloseCreateModal = () => setShowCreateModal(false);

  // Handle new exercise input changes
  const handleNewExerciseChange = (e) => {
    const { name, value } = e.target;
    setNewExercise({ ...newExercise, [name]: value });
  };

  // Handle video file change for new exercise
  const handleVideoFileChange = (e) => {
    const file = e.target.files[0];
    setVideoFile(file);
  };

  // Định nghĩa hàm checkVideoDuration
  const checkVideoDuration = (file) => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = function () {
        window.URL.revokeObjectURL(video.src);
        const duration = Math.floor(video.duration);
        resolve(duration);
      };

      video.src = URL.createObjectURL(file);
    });
  };

  // Hàm validate
  const validateForm = () => {
    const newErrors = {};
    if (!newExercise.name) {
      newErrors.name = "Tên bài tập không được để trống.";
    } else if (newExercise.name.length < 3 || newExercise.name.length > 100) {
      newErrors.name = "Tên bài tập phải từ 3 đến 100 ký tự.";
    } else if (
      exercises.some((exercise) => exercise.name === newExercise.name)
    ) {
      newErrors.name = "Tên bài tập đã tồn tại.";
    }

    if (!newExercise.description) {
      newErrors.description = "Mô tả không được để trống.";
    } else if (
      newExercise.description.length < 10 ||
      newExercise.description.length > 500
    ) {
      newErrors.description = "Mô tả phải từ 10 đến 500 ký tự.";
    }

    if (!newExercise.exerciseType) {
      newErrors.exerciseType = "Vui lòng chọn loại bài tập.";
    }

    if (!newExercise.difficulty) {
      newErrors.difficulty = "Vui lòng chọn mức độ khó.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Trả về true nếu không có lỗi
  };

  // Định nghĩa handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return; // Nếu có lỗi, không tiếp tục
    }

    try {
      setIsUploading(true);
      const token = localStorage.getItem("token");

      // Nếu có video, upload video lên Cloudinary
      let videoUrl = "";
      if (selectedVideo) {
        videoUrl = await uploadVideoToCloudinary(selectedVideo);
      }

      const exerciseData = {
        ...newExercise,
        video: videoUrl, // Thêm video URL vào dữ liệu bài tập
      };

      console.log("Exercise Data:", exerciseData); // Kiểm tra dữ liệu

      const response = await axios.post(
        "http://localhost:4000/api/coaches/exercises",
        exerciseData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Cập nhật danh sách bài tập
      setExercises([...exercises, response.data]);
      toast.success("Tạo bài tập thành công!");
      setShowCreateModal(false); // Đóng modal
      setNewExercise({
        // Reset form
        name: "",
        description: "",
        exerciseType: "",
        exerciseDuration: "",
        video: "",
        difficulty: "",
      });
    } catch (error) {
      console.error("Error creating exercise:", error.response.data); // Log phản hồi từ server
      toast.error("Đã xảy ra lỗi khi tạo bài tập!");
    } finally {
      setIsUploading(false);
    }
  };

  // Định nghĩa handleVideoUpload
  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedVideo(file);
      const duration = await checkVideoDuration(file);
      setNewExercise((prev) => ({
        ...prev,
        exerciseDuration: 20, // Cập nhật duration vào state
      }));
    }
  };

  return (
    <div>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            style: {
              background: "green",
            },
          },
          error: {
            duration: 3000,
            style: {
              background: "red",
            },
          },
          loading: {
            duration: Infinity,
            style: {
              background: "#363636",
            },
          },
        }}
      />

      <h2 style={{ color: "#000" }}>Danh sách các bài tập trong hệ thống</h2>

      {/* Search input */}
      <input
        type="text"
        placeholder="Nhập bài tập..."
        className="search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} // Update search term
      />

      {/* Create new exercise button */}
      <Button variant="primary ms-3" onClick={handleShowCreateModal}>
        Tạo bài tập mới
      </Button>

      <div className="exercise-list">
        {filteredExercises.length > 0 ? (
          filteredExercises.map((exercise) => (
            <div
              key={exercise._id}
              className="exercise-card"
              onClick={() => handleShow(exercise)}
            >
              <h3>{exercise.name}</h3>
              <br />
              <p>
                <span>Loại bài tập: </span>
                {exercise.exerciseType}
              </p>
              <button
                className="delete-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(exercise._id);
                }}
              >
                ✖
              </button>
            </div>
          ))
        ) : (
          <p>Không tìm thấy bài tập nào</p>
        )}
      </div>

      {/* Create exercise modal */}
      <Modal show={showCreateModal} onHide={handleCloseCreateModal}>
        <Modal.Header closeButton>
          <Modal.Title>Tạo bài tập mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Tên bài tập</Form.Label>
              <Form.Control
                type="text"
                value={newExercise.name}
                onChange={(e) =>
                  setNewExercise({ ...newExercise, name: e.target.value })
                }
                isInvalid={!!errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={newExercise.description}
                onChange={(e) =>
                  setNewExercise({ ...newExercise, description: e.target.value })
                }
                isInvalid={!!errors.description}
              />
              <Form.Control.Feedback type="invalid">
                {errors.description}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
              <Form.Label>Loại bài tập</Form.Label>
              <Form.Select
                value={newExercise.exerciseType}
                onChange={(e) =>
                  setNewExercise({
                    ...newExercise,
                    exerciseType: e.target.value,
                  })
                }
                isInvalid={!!errors.exerciseType}
              >
                <option value="">Chọn loại bài tập</option>
                <option value="Cardio">Cardio</option>
                <option value="Strength">Sức mạnh</option>
                <option value="Flexibility">Dẻo dai</option>
                <option value="Balance">Cân đối</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.exerciseType}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
              <Form.Label>Mức độ khó</Form.Label>
              <Form.Select
                value={newExercise.difficulty}
                onChange={(e) =>
                  setNewExercise({ ...newExercise, difficulty: e.target.value })
                }
                isInvalid={!!errors.difficulty}
              >
                <option value="">Chọn mức độ khó</option>
                <option value="Dễ">Dễ</option>
                <option value="Trung bình">Trung bình</option>
                <option value="Khó">Khó</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.difficulty}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
              <Form.Label>Thời gian bài tập (phút)</Form.Label>
              <Form.Control
                type="text"
                value={
                  newExercise.exerciseDuration
                    ? Math.floor(newExercise.exerciseDuration / 60)
                    : ""
                }
                readOnly // Không cho phép chỉnh sửa
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Video bài tập</Form.Label>
              <Form.Control
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                isInvalid={!!errors.video}
                disabled={isUploading}
              />
              {selectedVideo && (
                <div className="selected-video-info">
                  <i className="fas fa-file-video"></i>
                  <span>{selectedVideo.name}</span>
                </div>
              )}
              {isUploading && (
                <div className="upload-loading">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                  </div>
                  <span className="ms-2">{uploadProgress}</span>
                </div>
              )}
              <Form.Control.Feedback type="invalid">
                {errors.video}
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleCloseCreateModal}
            disabled={isUploading}
          >
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isUploading}
          >
            {isUploading ? "Đang xử lý..." : "Tạo bài tập"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit or View exercise modal */}
      {selectedExercise && (
        <Modal
          show={show}
          onHide={handleClose}
          size="xl"
          className="exercise-detail-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {isEditing ? "Chỉnh sửa bài tập" : selectedExercise.name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="modal-content-wrapper">
              <div className="info-section">
                {isEditing ? (
                  <Form>
                    <Form.Group controlId="formName">
                      <Form.Label>Tên bài tập</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={selectedExercise.name}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                    <Form.Group controlId="formDescription">
                      <Form.Label>Mô tả</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={5}
                        value={selectedExercise.description}
                        onChange={handleDescriptionChange}
                      />
                    </Form.Group>
                    <Form.Group controlId="formType">
                      <Form.Label>Loại bài tập</Form.Label>
                      <Form.Control
                        type="text"
                        name="exerciseType"
                        value={selectedExercise.exerciseType}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                    <Form.Group controlId="formDuration">
                      <Form.Label>Thời gian bài tập (phút)</Form.Label>
                      <Form.Control
                        type="number"
                        name="exerciseDuration"
                        value={selectedExercise.exerciseDuration}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                    <Form.Group controlId="formDifficulty">
                      <Form.Label>Độ khó</Form.Label>
                      <Form.Control
                        type="text"
                        name="difficulty"
                        value={selectedExercise.difficulty}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                    <Form.Group controlId="formNewVideo">
                      <Form.Label>Video bài tập</Form.Label>
                      <Form.Control
                        type="file"
                        name="video"
                        onChange={handleVideoFileChange}
                      />
                    </Form.Group>
                  </Form>
                ) : (
                  <div className="exercise-info">
                    <p>
                      <strong>Mô tả:</strong>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: selectedExercise.description,
                        }}
                      />
                    </p>
                    <p>
                      <strong>Loại bài tập:</strong>{" "}
                      {selectedExercise.exerciseType}
                    </p>
                    <p>
                      <strong>Thời gian:</strong>{" "}
                      {selectedExercise.exerciseDuration} minutes
                    </p>
                    <p>
                      <strong>Độ khó:</strong> {selectedExercise.difficulty}
                    </p>
                    <p>
                      <strong>Video bài tập:</strong>{" "}
                      <Button
                        variant="link"
                        onClick={() => setShowVideoModal(!showVideoModal)}
                        className="video-link-btn"
                      >
                        {showVideoModal ? "Ẩn Video" : "Xem Video"}
                      </Button>
                    </p>
                  </div>
                )}
              </div>

              {showVideoModal && (
                <div className="video-section">
                  {selectedExercise.video && (
                    <video
                      controls
                      className="exercise-video"
                      key={selectedExercise.video}
                    >
                      <source src={selectedExercise.video} type="video/mp4" />
                      Trình duyệt của bạn không hỗ trợ thẻ video.
                    </video>
                  )}
                </div>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            {isEditing ? (
              <>
                <Button variant="primary"
                onClick={handleSaveChanges}
                >
                  Lưu
                </Button>
                <Button variant="secondary" onClick={() => setIsEditing(false)}>
                  Hủy
                </Button>
              </>
            ) : (
              <Button variant="warning" onClick={handleEditToggle}>
                Chỉnh sửa
              </Button>
            )}
            <Button variant="secondary" onClick={handleClose}>
              Đóng
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover/>
    </div>
  );
};

export default ExerciseList;

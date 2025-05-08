import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  Form,
  Button,
  ProgressBar,
  Container,
  Card,
  Row,
  Col,
  Tabs,
  Tab,
  Modal,
} from "react-bootstrap";
import { message, Upload } from "antd"; // Add Ant Design's message component
import "./CreateCourseForm.css";
import PreviewCourseModal from "./PreviewCourseModal";
import { DeleteOutline, UploadOutlined } from "@mui/icons-material";
import {
  uploadToCloudinary,
  uploadVideoToCloudinary,
} from "../../utils/uploadImage";
import ReactPlayer from "react-player";
import { fetchCoachProfile } from "../../services/coachService";
import { toast, ToastContainer } from "react-toastify";

const CreateCourseForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(50);
  const [courseData, setCourseData] = useState({
    name: "",
    description: "",
    slotNumber: "",
    price: "",
    discount: 0,
    image: "",
    exercises: [],
    category: "",
  });
  const [exerciseSearch, setExerciseSearch] = useState([]);
  const [exercisesList, setExercisesList] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [workoutDetails, setWorkoutDetails] = useState([]);
  const [errors, setErrors] = useState({});
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [newExercise, setNewExercise] = useState({
    name: "",
    description: "",
    exerciseType: "",
    exerciseDuration: "",
    video: "",
    difficulty: "",
  });
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [optionChooseQuestion, setOptionChooseQuestion] = useState([]);
  const [errorOptionChooseQuestion, setErrorOptionChooseQuestion] = useState("");

  const handlePreviewCourse = () => {
    setShowPreviewModal(true);
  };
  useEffect(() => {
    axios
      .get("http://localhost:4000/api/coaches/exercises", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setExercisesList(response.data || []);
      })
      .catch((error) => {
        console.error("Lỗi khi tải bài tập", error);
        toast.error("Lỗi khi tải bài tập");
      });
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await fetchCoachProfile();
        const response = await axios.get(
          `http://localhost:4000/api/coaches/questions?idCoach=${data._id}`
        );
        setQuestions(response.data);
      } catch (error) {
        console.log(error);
        toast.error("Lỗi khi tải câu hỏi");
      }
    };
    fetchQuestions();
  }, []);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData({
      ...courseData,
      [name]: value,
    });
  };

  const handleDescriptionChange = (e) => {
    setCourseData({
      ...courseData,
      description: e.target.value,
    });
  };

  const handleSlotNumberChange = (e) => {
    const slotNumber = e.target.value;
    setCourseData({
      ...courseData,
      slotNumber,
    });

    const workoutSlots = Array.from({ length: slotNumber }, (_, i) => ({
      id: i + 1,
      name: "",
      description: "",
      exercises: [],
      listVideo: [],
    }));

    setWorkoutDetails(workoutSlots);
  };

  const handleWorkoutDetailsChange = (workoutId, field, value) => {
    const updatedWorkouts = workoutDetails.map((workout) =>
      workout.id === workoutId ? { ...workout, [field]: value } : workout
    );
    setWorkoutDetails(updatedWorkouts);
  };

  const handleExerciseSelection = (workoutId, exercise) => {
    const updatedWorkouts = workoutDetails.map((workout) =>
      workout.id === workoutId
        ? {
          ...workout,
          exercises: workout.exercises.includes(exercise)
            ? workout.exercises.filter((ex) => ex !== exercise)
            : [...workout.exercises, exercise],
          listVideo: workout.exercises.includes(exercise)
            ? workout.listVideo.filter((video) => video !== exercise.video)
            : [...workout.listVideo, exercise.video],
        }
        : workout
    );
    setWorkoutDetails(updatedWorkouts);
  };

  const handleQuestionSelection = (questionId) => {

    if (optionChooseQuestion.includes(questionId)) {
      setOptionChooseQuestion(optionChooseQuestion.filter((id) => id !== questionId));
    } else {
      setOptionChooseQuestion([...optionChooseQuestion, questionId]);
    }
  }

  const handleVideoFileChange = (e) => {
    const file = e.target.files[0];
    setVideoFile(file);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!courseData.name.trim()) newErrors.name = "Course name is required";
    if (!courseData.description.trim())
      newErrors.description = "Description is required";
    if (!courseData.slotNumber.trim())
      newErrors.slotNumber = "Slot number is required";
    if (!courseData.price || isNaN(courseData.price) || courseData.price <= 0)
      newErrors.price = "Please enter a valid price";
    if (courseData.discount < 0 || courseData.discount >= 100)
      newErrors.discount = "Please enter a valid discount";
    if (!courseData.category.trim())
      newErrors.category = "Category is required";
    return newErrors;
  };
  const handleImageUpload = ({ fileList }) => {
    // Just add the selected file to the state, no upload yet
    setFileList(fileList);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('submit');

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (optionChooseQuestion.length === 0) {
      setErrorOptionChooseQuestion("Please choose at least one question");
    } else {
      setErrorOptionChooseQuestion("");

    }

    // Handle image uploads to Cloudinary
    const uploadedImages = await Promise.all(
      fileList.map(async (file) => {
        if (file.originFileObj) {
          return await uploadToCloudinary(file.originFileObj);
        }
        return file.url;
      })
    );

    const course = {
      ...courseData,
      image: uploadedImages,
      listExercise: workoutDetails.map(
        ({ id, name, description, exercises, listVideo }) => ({
          name,
          description,
          exercises: exercises.map((exercise) => exercise._id),
          listVideo: listVideo,
        })
      ),
      questions: optionChooseQuestion,
    };


    // Submit the course data to the backend
    axios
      .post("http://localhost:4000/api/coaches/createCourse", course, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("Khóa học đã được tạo thành công:", response.data);
        toast.success("Khóa học đã được tạo thành công!");
        navigate("/coach/course");
      })
      .catch((error) => {
        console.error("Lỗi khi tạo khóa học:", error);
        toast.error("Lỗi khi tạo khóa học.");
      });
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      setProgress(Math.round(((currentStep + 1) / 3) * 100));
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setProgress(Math.round(((currentStep - 1) / 3) * 100));
    }
  };

  const addNewWorkoutSlot = () => {
    const newWorkoutId = workoutDetails.length + 1;
    setWorkoutDetails([
      ...workoutDetails,
      {
        id: newWorkoutId,
        name: "",
        description: "",
        exercises: [],
        listVideo: [],
      },
    ]);
  };

  const handleExerciseModalClose = () => setShowExerciseModal(false);

  const handleExerciseModalShow = () => setShowExerciseModal(true);

  const handleNewExerciseChange = (e) => {
    const { name, value } = e.target;
    setNewExercise({
      ...newExercise,
      [name]: value,
    });
  };

  const handleCreateExercise = async () => {
    let videoUrl = "";
    // If a video file is selected, upload it to Cloudinary
    if (videoFile) {
      try {
        videoUrl = await uploadVideoToCloudinary(videoFile);
      } catch (error) {
        toast.error("Không tải được video lên.");
        return;
      }
    }
    axios
      .post(
        "http://localhost:4000/api/coaches/exercises",
        { ...newExercise, video: videoUrl || newExercise.video },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        toast.success("Bài tập đã được tạo thành công!");
        setExercisesList([...exercisesList, response.data]);
        setShowExerciseModal(false); // Close the modal after successful creation
      })
      .catch((error) => {
        toast.error("Lỗi khi tạo bài tập");
        console.error("Lỗi khi tạo bài tập:", error);
      });
  };

  const renderStep1 = () => (
    <div className="form-background">
      <Form>
        <Form.Group controlId="formCourseName">
          <Form.Label className="custom-label">Tên khóa học</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={courseData.name}
            onChange={handleInputChange}
            required
            className="custom-input"
          />
          {errors.name && <p className="text-danger">{errors.name}</p>}
        </Form.Group>
        <Form.Group controlId="formDescription" className="mt-3">
          <Form.Label className="custom-label">Mô tả</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            value={courseData.description ? courseData.description.text : ""}
            onChange={handleDescriptionChange}
            rows={3}
            required
            className="custom-input"
          />
          {errors.description && (
            <p className="text-danger">{errors.description}</p>
          )}
        </Form.Group>
        <Form.Group controlId="formSlotnumber" className="mt-3">
          <Form.Label className="custom-label">Số lượng bài tập</Form.Label>
          <Form.Control
            type="number"
            name="slotNumber"
            value={courseData.slotNumber}
            onChange={handleSlotNumberChange}
            required
            className="custom-input"
          />
          {errors.slotNumber && (
            <p className="text-danger">{errors.slotNumber}</p>
          )}
        </Form.Group>
        <Form.Group controlId="formPrice" className="mt-3">
          <Form.Label className="custom-label">Giá</Form.Label>
          <Form.Control
            type="number"
            name="price"
            value={courseData.price}
            onChange={handleInputChange}
            required
            className="custom-input"
          />
          {errors.price && <p className="text-danger">{errors.price}</p>}
        </Form.Group>
        <Form.Group controlId="formPrice" className="mt-3">
          <Form.Label className="custom-label">Giảm giá</Form.Label>
          <Form.Control
            type="number"
            name="discount"
            value={courseData.discount}
            onChange={handleInputChange}
            required
            className="custom-input"
          />
          {errors.discount && (
            <p className="text-danger">{errors.discount}</p>
          )}
        </Form.Group>
        <Form.Group controlId="formCategory" className="mt-3">
          <Form.Label className="custom-label">Thể loại</Form.Label>
          <Form.Control
            type="text"
            name="category"
            value={courseData.category}
            onChange={handleInputChange}
            required
            className="custom-input"
          />
          {errors.category && (
            <p className="text-danger">{errors.category}</p>
          )}
        </Form.Group>

        {/* Image Upload */}
        <Form.Group controlId="formImages" className="mt-3">
          <Form.Label className="custom-label">Ảnh</Form.Label>
          <Upload
            listType="picture"
            beforeUpload={() => false}
            multiple
            fileList={fileList}
            onChange={handleImageUpload}
            onRemove={(file) =>
              setFileList((prevList) =>
                prevList.filter((item) => item.uid !== file.uid)
              )
            }
          >
            <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
          </Upload>
        </Form.Group>

        <Button variant="primary" className="mt-4"
          onClick={handleNext}
        >
          Tiếp theo
        </Button>
      </Form>

    </div>
  );

  const renderStep2 = () => (
    <div className="form-background">
      <h4
        className="custom-label"
        style={{ color: "black", fontSize: "40px", marginBottom: "40px" }}
      >
        Thêm chi tiết cho từng buổi tập luyện
      </h4>

      <Tabs defaultActiveKey="1">
        {workoutDetails.map((workout, index) => (
          <Tab
            eventKey={workout.id}
            title={`Buổi tập ${workout.id}`}
            key={workout.id}
          >
            <Form.Group
              controlId={`workoutName-${workout.id}`}
              className="mb-2"
            >
              <Form.Label className="custom-label">Tên bài tập</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên bài tập"
                value={workout.name || ""}
                onChange={(e) =>
                  handleWorkoutDetailsChange(
                    workout.id,
                    "name",
                    e.target.value
                  )
                }
              />
            </Form.Group>
            <Form.Group
              controlId={`workoutDescription-${workout.id}`}
              className="mb-2"
            >
              <Form.Label className="custom-label">
                Mô tả
              </Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Nhập mô tả"
                rows={3}
                value={workout.description || ""}
                onChange={(e) =>
                  handleWorkoutDetailsChange(
                    workout.id,
                    "description",
                    e.target.value
                  )
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="custom-label">
                Lựa chọn bài tập
              </Form.Label>
              {exercisesList.length > 0 ? (
                exercisesList.map((exercise) => (
                  <Form.Check
                    key={exercise._id}
                    type="checkbox"
                    id={`exercise-${exercise._id}`}
                    label={exercise.name}
                    checked={workout.exercises.includes(exercise)}
                    onChange={() =>
                      handleExerciseSelection(workout.id, exercise)
                    }
                  />
                ))
              ) : (
                <p style={{ color: "black" }}>Không có bài tập nào có sẵn</p>
              )}
            </Form.Group>

            {/* Display selected videos */}
            {workout.listVideo.length > 0 ? (
              workout.listVideo.map((videoUrl, index) => (
                <div
                  key={index}
                  style={{
                    width: "40%",
                    height: "300px",
                    margin: "10px",
                    display: "inline-block",
                    verticalAlign: "top",
                    position: "relative",
                  }}
                >
                  {videoUrl.includes("youtube.com") ? (
                    // Check if it's a regular YouTube URL or YouTube Shorts URL
                    videoUrl.includes("shorts") ? (
                      <ReactPlayer
                        url={`https://www.youtube.com/watch?v=${videoUrl.split("shorts/")[1]
                          }`}
                        width="100%"
                        height="100%"
                        controls
                      />
                    ) : (
                      <ReactPlayer
                        url={`https://www.youtube.com/watch?v=${videoUrl.split("v=")[1]
                          }`}
                        width="100%"
                        height="100%"
                        controls
                      />
                    )
                  ) : videoUrl.includes("cloudinary.com") ? (
                    <ReactPlayer
                      url={videoUrl}
                      width="100%"
                      height="100%"
                      controls
                    />
                  ) : (
                    <ReactPlayer
                      url={videoUrl}
                      width="100%"
                      height="100%"
                      controls
                    />
                  )}
                </div>
              ))
            ) : (
              <p style={{ color: "black" }}>Không có video nào được chọn</p>
            )}
          </Tab>
        ))}
      </Tabs>

      <Button
        variant="secondary"
        onClick={handlePrevious}
        className="mt-3 me-2"
      >
        Trước
      </Button>
      <Button
        variant="success"
        onClick={addNewWorkoutSlot}
        className="mt-3 me-2"
      >
        Thêm buổi tập
      </Button>

      {/* New Exercise Button */}
      <Button
        variant="info"
        onClick={handleExerciseModalShow}
        className="mt-3 me-2"
      >
        Tạo bài tập mới
      </Button>
      <Button
        variant="warning"
        onClick={handlePreviewCourse}
        className="mt-3 me-2"
      >
        Xem trước khóa học
      </Button>
      <Button variant="primary" className="mt-4" onClick={handleNext}>
        Tiếp theo
      </Button>
      {/*Modal tạo bài tập*/}
      <Modal
        show={showExerciseModal}
        onHide={handleExerciseModalClose}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Tạo bài tập mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="exerciseName">
              <Form.Label>Tên bài tập</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newExercise.name}
                onChange={handleNewExerciseChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="exerciseDescription" className="mt-3">
              <Form.Label>Mô tả bài tập</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={newExercise.description}
                onChange={handleNewExerciseChange}
                rows={3}
                required
              />
            </Form.Group>
            <Form.Group controlId="exerciseType" className="mt-3">
              <Form.Label>Loại bài tập</Form.Label>
              <Form.Control
                type="text"
                name="exerciseType"
                value={newExercise.exerciseType}
                onChange={handleNewExerciseChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="exerciseDuration" className="mt-3">
              <Form.Label>Thời gian tập luyện (tính bằng giây)</Form.Label>
              <Form.Control
                type="number"
                name="exerciseDuration"
                value={newExercise.exerciseDuration}
                onChange={handleNewExerciseChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="exerciseVideo" className="mt-3">
              <Form.Label>Tải lên Video</Form.Label>
              <Form.Control
                type="file"
                name="video"
                onChange={handleVideoFileChange}
              />
            </Form.Group>
            <Form.Group controlId="exerciseDifficulty" className="mt-3">
              <Form.Label>Độ khó</Form.Label>
              <Form.Control
                type="text"
                name="difficulty"
                value={newExercise.difficulty}
                onChange={handleNewExerciseChange}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleExerciseModalClose}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleCreateExercise}>
            Tạo bài tập
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );

  const renderStep3 = () => (
    <div className="form-background">
      <h4
        className="custom-label"
        style={{ color: "black", fontSize: "40px", marginBottom: "40px" }}
      >
        Thêm khảo sát khóa học
      </h4>
            <Form.Group className="mb-3">
              <Form.Label className="custom-label">
                Chọn câu hỏi
              </Form.Label>
              {questions.length > 0 ? (
                questions.map((exercise) => (
                  <Form.Check
                    key={exercise._id}
                    type="checkbox"
                    id={`exercise-${exercise._id}`}
                    label={exercise.question}
                    checked={optionChooseQuestion.includes(exercise._id)}
                    onChange={() =>
                      handleQuestionSelection(exercise._id)
                    }
                  />
                ))
              ) : (
                <p>Không có câu hỏi nào có sẵn</p>
              )}
              <p style={{ color: 'red' }}>{errorOptionChooseQuestion}</p>
            </Form.Group>
      <Button
        variant="secondary"
        onClick={handlePrevious}
        className="mt-3 me-2"
      >
        Trước
      </Button>

      <Button
        variant="warning"
        onClick={handlePreviewCourse}
        className="mt-3 me-2"
      >
        Xem trước khóa học
      </Button>

      <Button variant="primary" onClick={handleSubmit} className="mt-3">
        Hoàn tất
      </Button>


    </div>
  )

  return (
    <div>
      <div style={{ marginTop: "20px" }}>

        <h3 style={{ color: "#000" }}>Tạo khóa học mới</h3>
        <ProgressBar now={progress} label={`${progress}%`} />
      </div>
      {currentStep === 1
        ? renderStep1()
        : currentStep === 2
          ? renderStep2()
          : renderStep3()
      }
      <PreviewCourseModal
        show={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        courseData={courseData}
        fileList={fileList}
        workoutDetails={workoutDetails}
      />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover/>
    </div>
  );
};

export default CreateCourseForm;
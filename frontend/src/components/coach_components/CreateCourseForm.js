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
import { message, Upload } from "antd"; // Thêm component message của Ant Design
import "./CreateCourseForm.css";
import PreviewCourseModal from "./PreviewCourseModal";
import { DeleteOutline, UploadOutlined } from "@mui/icons-material";
import {
  uploadToCloudinary,
  uploadVideoToCloudinary,
} from "../../utils/uploadImage";
import ReactPlayer from "react-player";
import { fetchCoachProfile } from "../../services/coachService";

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
  const [errorOptionChooseQuestion, setErrorOptionChooseQuestion] = "";

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
        console.error("Lỗi khi tải bài tập:", error);
      });
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await fetchCoachProfile();
        const response = await axios.get(
          `http://localhost:4000/api/admins/questions?idCoach=${data._id}`
        );
        setQuestions(response.data);
      } catch (error) {
        console.log(error);

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

  const handleDescriptionChange = (value) => {
    setCourseData({
      ...courseData,
      description: value,
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
  const handleVideoRemove = (workoutId, video) => {
    const updatedWorkouts = workoutDetails.map((workout) =>
      workout.id === workoutId
        ? {
          ...workout,
          listVideo: workout.listVideo.filter((item) => item !== video),
        }
        : workout
    );
    setWorkoutDetails(updatedWorkouts);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!courseData.name.trim()) newErrors.name = "Tên khóa học là bắt buộc";
    if (!courseData.description.trim())
      newErrors.description = "Mô tả là bắt buộc";
    if (!courseData.slotNumber.trim())
      newErrors.slotNumber = "Số lượng bài tập là bắt buộc";
    if (!courseData.price || isNaN(courseData.price) || courseData.price <= 0)
      newErrors.price = "Vui lòng nhập giá hợp lệ";
    if (courseData.discount < 0 || courseData.discount >= 100)
      newErrors.discount = "Vui lòng nhập giảm giá hợp lệ";
    if (!courseData.category.trim())
      newErrors.category = "Thể loại là bắt buộc";
    return newErrors;
  };
  const handleImageUpload = ({ fileList }) => {
    // Chỉ thêm file đã chọn vào state, chưa upload vội
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
      setErrorOptionChooseQuestion("Vui lòng chọn ít nhất một câu hỏi");
    } else {
      setErrorOptionChooseQuestion("");

    }

    // Xử lý tải ảnh lên Cloudinary
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


    // Gửi dữ liệu khóa học lên backend
    axios
      .post("http://localhost:4000/api/coaches/createCourse", course, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("Khóa học được tạo thành công:", response.data);
        message.success("Khóa học được tạo thành công!");
        navigate("/coach/course");
      })
      .catch((error) => {
        console.error("Lỗi khi tạo khóa học:", error);
        message.error("Lỗi khi tạo khóa học.");
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
    // Nếu có file video được chọn, hãy tải nó lên Cloudinary
    if (videoFile) {
      try {
        videoUrl = await uploadVideoToCloudinary(videoFile);
      } catch (error) {
        message.error("Tải video lên thất bại.");
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
      .then((response) => {message.success("Bài tập được tạo thành công!");
          setExercisesList([...exercisesList, response.data]);
          setShowExerciseModal(false); // Đóng modal sau khi tạo thành công
        })
        .catch((error) => {
          message.error("Lỗi khi tạo bài tập");
          console.error("Lỗi khi tạo bài tập:", error);
        });
    };
  
    const renderStep1 = () => (
      <div className="form-background">
        <Card className="shadow-sm p-4 mb-4 bg-white rounded">
          <Card.Body>
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
                <ReactQuill
                  style={{ color: "#333" }}
                  value={courseData.description}
                  onChange={handleDescriptionChange}
                  className="custom-input text-black  "
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
  
              {/* Tải ảnh lên */}
              <Form.Group controlId="formImages" className="mt-3">
                <Form.Label className="custom-label">Ảnh</Form.Label>
                {/* <Upload
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
                </Upload> */}
                <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
              </Form.Group>
  
              <Button variant="primary" className="mt-4"
              // onClick={handleNext}
              >
                Tiếp theo
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    );
  
    const renderStep2 = () => (
      <div className="form-background">
        <Card className="shadow-sm p-4 mb-4 bg-white rounded">
          <Card.Body>
            <h4
              className="custom-label"
              style={{ color: "orange", fontSize: "40px", marginBottom: "40px" }}
            >
              Thêm chi tiết cho từng bài tập
            </h4>
  
            <Tabs defaultActiveKey="1">
              {workoutDetails.map((workout, index) => (
                <Tab
                  eventKey={workout.id}
                  title={`Bài tập ${workout.id}`}
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
                          workout.id,"name",
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
                    Mô tả bài tập
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    placeholder="Nhập mô tả bài tập"
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
                    Chọn bài tập
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
                    <p>Không có bài tập nào</p>
                  )}
                </Form.Group>

                {/* Hiển thị video đã chọn */}
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
                        // Kiểm tra xem có phải là URL YouTube thông thường hay YouTube Shorts
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
                      <Button
                        variant="danger"
                        size="sm"
                        className="remove-icon ms-2"
                        onClick={() => handleVideoRemove(workout.id, videoUrl)}
                        style={{
                          position: "absolute",
                          top: "5px",right: "5px",
                          padding: "0.1rem 0.3rem",
                          fontSize: "0.8rem",
                        }}
                      >
                        <DeleteOutline />
                      </Button>
                    </div>
                  ))
                ) : (
                  <p>Chưa có video nào được chọn.</p>
                )}
              </Tab>
            ))}
          </Tabs>

          <Button variant="secondary" onClick={handlePrevious} className="mt-3 me-2">
            Quay lại
          </Button>
          <Button variant="primary" onClick={handleNext} className="mt-3">
            Tiếp theo
          </Button>
        </Card.Body>
      </Card>
    </div>
  );

  const renderStep3 = () => (
    <div className="form-background">
      <Card className="shadow-sm p-4 mb-4 bg-white rounded">
        <Card.Body>
          <h4
            className="custom-label"
            style={{ color: "orange", fontSize: "40px", marginBottom: "40px" }}
          >
            Thêm câu hỏi đánh giá
          </h4>

          {questions.length > 0 ? (
            questions.map((question) => (
              <Form.Check
                key={question._id}
                type="checkbox"
                id={`question-${question._id}`}
                label={question.questionText}
                checked={optionChooseQuestion.includes(question._id)}
                onChange={() => handleQuestionSelection(question._id)}
              />
            ))
          ) : (
            <p>Không có câu hỏi nào được tạo.</p>
          )}

          {errorOptionChooseQuestion && (
            <p className="text-danger">{errorOptionChooseQuestion}</p>
          )}

          <Button variant="secondary" onClick={handlePrevious} className="mt-3 me-2">
            Quay lại
          </Button>
          <Button variant="success" onClick={handleSubmit} className="mt-3">
            Hoàn thành và tạo khóa học
          </Button>
          <Button variant="info" onClick={handlePreviewCourse} className="mt-3 ms-2">
            Xem trước
          </Button>
        </Card.Body>
      </Card>
    </div>
  );

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4 custom-heading">Tạo Khóa Học Mới</h2>
      <ProgressBar now={progress} label={`${progress}%`} className="mb-3" />

      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}

      <Modal show={showExerciseModal} onHide={handleExerciseModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm Bài Tập Mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="newExerciseName" className="mb-3">
              <Form.Label>Tên bài tập</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newExercise.name}
                onChange={handleNewExerciseChange}
              />
            </Form.Group>
            <Form.Group controlId="newExerciseDescription" className="mb-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={newExercise.description}
                onChange={handleNewExerciseChange}
              />
            </Form.Group>
            <Form.Group controlId="newExerciseType" className="mb-3">
              <Form.Label>Loại bài tập</Form.Label>
              <Form.Control
                type="text"
                name="exerciseType"
                value={newExercise.exerciseType}
                onChange={handleNewExerciseChange}
              />
            </Form.Group>
            <Form.Group controlId="newExerciseDuration" className="mb-3">
              <Form.Label>Thời lượng (phút)</Form.Label>
              <Form.Control
                type="number"
                name="exerciseDuration"
                value={newExercise.exerciseDuration}
                onChange={handleNewExerciseChange}
              />
            </Form.Group>
            <Form.Group controlId="newExerciseDifficulty" className="mb-3">
              <Form.Label>Độ khó</Form.Label>
              <Form.Control
                type="text"
                name="difficulty"
                value={newExercise.difficulty}
                onChange={handleNewExerciseChange}
              />
            </Form.Group>
            <Form.Group controlId="newExerciseVideo" className="mb-3">
              <Form.Label>Video hướng dẫn (URL hoặc tải lên)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập URL video (YouTube, Vimeo,...)"
                name="video"
                value={newExercise.video}
                onChange={handleNewExerciseChange}
              />
              <Form.Control
                type="file"
                accept="video/*"
                onChange={handleVideoFileChange}
              />
            </Form.Group>
            <Button variant="primary" onClick={handleCreateExercise}>
              Tạo bài tập
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <PreviewCourseModal
        show={showPreviewModal}
        onHide={() => setShowPreviewModal(false)}
        course={courseData}
        workoutDetails={workoutDetails}
        questions={questions.filter((q) => optionChooseQuestion.includes(q._id))}
      />
    </Container>
  );
};

export default CreateCourseForm;
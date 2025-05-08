import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { LeftOutlined } from "@ant-design/icons";
import { HTML5Backend } from "react-dnd-html5-backend";
import Calendar from "react-calendar";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-calendar/dist/Calendar.css";
import "./SubscriptionDetail.css";
import { Button } from "react-bootstrap";

Modal.setAppElement("#root");

function SubscriptionDetail() {
  const { subscriptionId } = useParams();
  const [subscription, setSubscription] = useState(null);
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openExerciseModal, setOpenExerciseModal] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState(null);

  useEffect(() => {
    fetchSubscriptionDetail();
  }, [subscriptionId]);

  const fetchSubscriptionDetail = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/coaches/subscriptions/${subscriptionId}/workouts`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const sortedWorkouts = response.data.data.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
      setSubscription(response.data.data);
      setWorkouts(sortedWorkouts);
    } catch (error) {
      console.error("Lỗi khi tải thông tin đăng ký:", error);
      toast.error("Lỗi khi tải thông tin đăng ký");
    }
  };

  const fetchExercisesByCoachId = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/coaches/exercises`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setExercises(response.data);
    } catch (error) {
      console.error("Lỗi khi tìm bài tập theo coach ID:", error);
      toast.error("Không thể tải bài tập");
    }
  };

  const handleDrop = (date, workout) => {
    setSelectedWorkout({ ...workout, date });
    setOpenEditModal(true); // Open the edit modal after dropping to allow user to confirm the change
  };

  const handleRightClick = (event, workout) => {
    event.preventDefault();
    setSelectedWorkout(workout);
    setContextMenu({
      x: event.pageX,
      y: event.pageY,
      workout,
    });
  };

  const openExerciseListModal = async () => {
    await fetchExercisesByCoachId();
    setOpenExerciseModal(true);
    setContextMenu(null);
  };

  const handleCloseModals = () => {
    setOpenEditModal(false);
    setOpenExerciseModal(false);
    setSelectedWorkout(null);
    setSelectedExercises([]);
  };

  const handleExerciseSelect = (exercise) => {
    if (!selectedExercises.find((e) => e.exerciseId === exercise._id)) {
      setSelectedExercises([
        ...selectedExercises,
        { exerciseId: exercise._id, name: exercise.name, note: "" },
      ]);
    }
  };

  const handleNoteChange = (exerciseId, note) => {
    setSelectedExercises(
      selectedExercises.map((ex) =>
        ex.exerciseId === exerciseId ? { ...ex, note } : ex
      )
    );
  };

  const handleRemoveExercise = (exerciseId) => {
    setSelectedExercises(
      selectedExercises.filter((ex) => ex.exerciseId !== exerciseId)
    );
  };

  const CalendarCell = ({ date }) => {
    const workoutsForDate = workouts.filter((workout) =>
      moment(workout.date).isSame(date, "day")
    );

    const [, drop] = useDrop({
      accept: "workout",
      drop: (item) => handleDrop(date, item),
    });

    return (
      <div ref={drop} className="calendar-cell">
        {workoutsForDate.map((workout) => (
          <DraggableWorkout key={workout._id} workout={workout} />
        ))}
      </div>
    );
  };

  const DraggableWorkout = ({ workout }) => {
    const [{ isDragging }, drag] = useDrag({
      type: "workout",
      item: workout,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    const workoutClass =
      workout.progressId && workout.progressId.length > 0
        ? "green" // Set to green if progressId has elements
        : workout.progressId === null
          ? "blue"
          : "orange";

    return (
      <div
        ref={drag}
        onContextMenu={(event) => handleRightClick(event, workout)}
        className={`workout-card ${workoutClass}`}
        style={{ opacity: isDragging ? 0.5 : 1 }}
      >
        <p>{workout.name}</p>
      </div>
    );
  };

  const handleTabClick = (exerciseId) => {
    setSelectedExerciseId(exerciseId);
  };

  // Render selected exercise details based on the active tab
  const renderExerciseDetails = () => {
    // Check if selectedExerciseId is valid
    if (!selectedExerciseId)
      return <p>Vui lòng chọn một bài tập để xem chi tiết.</p>;

    const exercise = selectedExercises.find(
      (ex) => ex.exerciseId === selectedExerciseId
    );
    const exerciseDetails =
      exercise && exercises.find((e) => e._id === exercise.exerciseId);

    // If no valid exercise is found, show a message
    if (!exercise || !exerciseDetails)
      return <p>Không tìm thấy thông tin chi tiết về bài tập.</p>;

    return (
      <div key={exercise.exerciseId}>
        <span>
          <strong>Tên:</strong> {exercise.name}
        </span>
        <div>
          <strong>Mô tả:</strong>
          <div
            style={{ color: "black" }}
            dangerouslySetInnerHTML={{
              __html: `<span style="color: black">${exerciseDetails.description}</span>`,
            }}
          />
        </div>
        <div>
          <strong>Loại:</strong> {exerciseDetails.exerciseType}
        </div>
        <div>
          <strong>Khoảng thời gian:</strong> {exerciseDetails.exerciseDuration} phút
        </div>
        <div>
          <strong>Độ khó:</strong> {exerciseDetails.difficulty}
        </div>
        {exerciseDetails.video ? (
          <div>
            <strong>Video:</strong>
            {exerciseDetails.video.includes("youtube.com") ||
              exerciseDetails.video.includes("vimeo.com") ? (
              <iframe
                src={exerciseDetails.video}
                title="Video Bài Tập"
                width="100%"
                height="315"
                style={{
                  borderRadius: "8px",
                  border: "none",
                  marginTop: "10px",
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <video
                controls
                src={exerciseDetails.video}
                width="100%"
                height="315"
                style={{ borderRadius: "8px", marginTop: "10px" }}
              >
                Trình duyệt của bạn không hỗ trợ thẻ video.
              </video>
            )}
          </div>
        ) : (
          <div>
            <strong>Video:</strong> Không có sẵn
          </div>
        )}
        <label>
          Ghi chú:
          <input
            type="text"
            value={exercise.note}
            onChange={(e) =>
              handleNoteChange(exercise.exerciseId, e.target.value)
            }
          />
        </label>
        <button onClick={() => handleRemoveExercise(exercise.exerciseId)}>
          Xóa
        </button>
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="subscription-detail" style={{ display: 'flex', alignItems: 'center', content: 'flex-start' }}>
        <Button
          icon={<LeftOutlined />}
          onClick={() => navigate(-1)}
          style={{ marginRight: "10px" }} // Thêm một chút khoảng cách
        >
          Quay lại
        </Button>
        <h2 style={{ margin: 0 }}>Chi tiết đăng ký</h2>
        <Calendar
          tileContent={({ date }) => <CalendarCell date={date} />}
          onClickDay={() => { }}
          className="custom-calendar"
        />

        {/* Context Menu */}
        {contextMenu && (
          <div
            className="context-menu"
            style={{
              top: contextMenu.y,
              left: contextMenu.x,
            }}
          >
            <button onClick={openExerciseListModal}>Xem Bài tập</button>
          </div>
        )}

        {/* Danh sách bài tập Modal */}
        <Modal
          isOpen={openExerciseModal}
          onRequestClose={handleCloseModals}
          contentLabel="Exercise List"
          className="modal-content exercise-modal"
          overlayClassName="modal-overlay"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderBottom: '1px solid #eee' }}>
            <h2>Bài tập cho {selectedWorkout?.name}</h2>
            <button onClick={handleCloseModals} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#aaa' }}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div style={{ padding: '20px', display: 'flex', gap: '20px' }}>
            <div style={{ flex: 1, borderRight: '1px solid #eee', paddingRight: '15px' }}>
              <h3>Danh sách bài tập</h3>
              <p>Vui lòng chọn một bài tập để xem chi tiết.</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxHeight: '350px', overflowY: 'auto', border: '1px solid #ccc', borderRadius: '5px', padding: '10px' }}>
                {exercises.map((exercise) => (
                  <li
                    key={exercise._id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '5px 0',
                      borderBottom: '1px dotted #eee',
                    }}
                  >
                    <span style={{ flexGrow: 1, marginRight: '10px' }}>{exercise.name}</span>
                    <button
                      onClick={() => handleExerciseSelect(exercise)}
                      style={{
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        padding: '5px 10px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '0.9em',
                      }}
                    >
                      Chọn
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ flex: 1, paddingLeft: '15px' }}>
              <h3>Bài tập đã chọn</h3>
              {selectedExercises.length > 0 ? (
                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', overflowX: 'auto' }}>
                  {selectedExercises.map((exercise) => (
                    <button
                      key={exercise.exerciseId}
                      className={`tab-button ${selectedExerciseId === exercise.exerciseId ? "active" : ""}`}
                      onClick={() => handleTabClick(exercise.exerciseId)}
                      style={{
                        backgroundColor: selectedExerciseId === exercise.exerciseId ? '#007bff' : '#f8f9fa',
                        color: selectedExerciseId === exercise.exerciseId ? 'white' : '#333',
                        border: '1px solid #ddd',
                        padding: '8px 15px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                      }}
                    >
                      {exercise.name}
                    </button>
                  ))}
                </div>
              ) : (
                <p>Chưa có bài tập nào được chọn.</p>
              )}
              <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '5px', backgroundColor: '#fff' }}>
                {selectedExercises.length > 0 && renderExerciseDetails()}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '15px', borderTop: '1px solid #eee', gap: '10px' }}>
            <button
              onClick={handleCloseModals}
              style={{ padding: '10px 15px', borderRadius: '5px', cursor: 'pointer', border: '1px solid #ccc', backgroundColor: '#f0f0f0', color: '#333' }}
            >
              Đóng
            </button>
          </div>
        </Modal>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover/>
      </div>
    </DndProvider>
  );
}

export default SubscriptionDetail;

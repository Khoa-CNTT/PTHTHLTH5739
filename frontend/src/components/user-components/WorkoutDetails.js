import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './WorkoutDetails.module.css';
import ChatRoom from './chatRoom';

const WorkoutDetails = () => {
  const { workoutId } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState(0);
  const [canProceed, setCanProceed] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isWorkoutOverview, setIsWorkoutOverview] = useState(true);
  const [isFinishPopupVisible, setIsFinishPopupVisible] = useState(false);
  const [videoLink, setVideoLink] = useState('');
  const videoRef = useRef(null);
  const [activeTab, setActiveTab] = useState('workout'); //Tab mặc định là 'tập luyện'
  const [adviceList, setAdviceList] = useState([]); // Lưu trữ dữ liệu tư vấn
  const [currentAdvice, setCurrentAdvice] = useState(''); // Hiển thị lời khuyên phù hợp
  const [timestamp, setTimestamp] = useState(0); // Theo dõi dấu thời gian tính bằng giây
  const [advice, setAdvice] = useState('');
  const [isChatPopupVisible, setIsChatPopupVisible] = useState(false);

  const toggleChatPopup = () => {
    setIsChatPopupVisible(!isChatPopupVisible);
  };

  const GetAdvice = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/users/workouts/${workoutId}/advice`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setAdviceList(response.data.advice);
    } catch (error) {
      console.error('Lỗi khi lấy lời khuyên:', error);
      toast.error('Lỗi khi lấy lời khuyên');
    }
  };

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/users/workouts/${workoutId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setWorkout(response.data);
        setLoading(false);
      } catch (error) {
        setError('Có lỗi xảy ra khi tải dữ liệu');
        toast.error("Có lỗi xảy ra khi tải dữ liệu");
        setLoading(false);
      }
    };
    fetchWorkout();
    GetAdvice();
  }, [workoutId]);

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>{error}</p>;

  const progressExercises = workout.progressId || [];
  const selectedExercise = progressExercises[selectedExerciseIndex];

  const completedProgressCount = progressExercises.filter(
    (progress) => progress.completionRate === "true"
  ).length;

  const completionPercentage =
    workout.status === "success"
      ? 100
      : (
        (completedProgressCount / (progressExercises.length + 1)) *
        100
      ).toFixed(2);

  const handleNext = async () => {
    if (isWorkoutOverview) {
      setIsWorkoutOverview(false);
      setIsPopupVisible(true);
    } else {
      if (selectedExercise.completionRate !== "true" && !canProceed) {
        toast.error("Bạn phải xem trên 70% video để tiếp tục", {
          autoClose: 3000,
        });
        return;
      }
      if (selectedExerciseIndex < progressExercises.length - 1) {
        setSelectedExerciseIndex(selectedExerciseIndex + 1);
        setCanProceed(false);
        setIsPopupVisible(true);
      }
    }
  };

  const handleBack = () => {
    if (!isWorkoutOverview && selectedExerciseIndex === 0) {
      setIsWorkoutOverview(true);
    } else if (!isWorkoutOverview && selectedExerciseIndex > 0) {
      setSelectedExerciseIndex(selectedExerciseIndex - 1);
      setCanProceed(false);
    }
  };

  const isValidVideoLink = (link) => {
    if (!link || typeof link !== "string" || link.trim() === "") return false;

    const urlRegex = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([/?#].*)?$/i;
    return urlRegex.test(link);
  };


  const handleFinishWorkout = async () => {
    if (!isValidVideoLink(videoLink)) {
      toast.error("Hãy nhập vào một liên kết video hợp lệ!", {
        autoClose: 3000,
      });
      return;
    }

    try {
      await axios.put(
        `http://localhost:4000/api/users/workouts/${workoutId}/finished`,
        { status: "success", videoLink },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setWorkout((prevWorkout) => ({
        ...prevWorkout,
        status: "success",
      }));
      setVideoLink("");
      setIsFinishPopupVisible(false);

      toast.success("Hoàn thành bài tập!", {
        autoClose: 3000,
      });
    } catch (error) {
      toast.error("Thất bại khi hoàn thành bài tập", {
        autoClose: 3000,
      });
    }
  };

  const handleVideoProgress = async () => {
    const video = videoRef.current;
    const watchedPercentage = (video.currentTime / video.duration) * 100;

    if (watchedPercentage >= 70 && selectedExercise.completionRate !== "true") {
      try {
        const progressId = selectedExercise._id;
        await axios.patch(
          `http://localhost:4000/api/users/progress/${progressId}`,
          { completionRate: "true" },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const updatedProgress = [...progressExercises];
        updatedProgress[selectedExerciseIndex].completionRate = "true";
        setWorkout((prevWorkout) => ({
          ...prevWorkout,
          progressId: updatedProgress,
        }));

        toast.success("Lưu tiến độ bài tập thành công!", {
          autoClose: 3000,
        });
      } catch (error) {
        toast.error("Thất bại khi lưu tiến độ bài tập", {
          autoClose: 3000,
        });
      }
    }

    if (watchedPercentage >= 70) {
      setCanProceed(true);
    }
  };

  const closePopup = () => {
    setIsPopupVisible(false);
  };

  const handleAdviceByTimestamp = (time) => {
    const matchingAdvice = adviceList.find((adv) => adv.timestamp === time);
    setAdvice(matchingAdvice ? matchingAdvice.advice : '');
    setTimestamp(time);
  };

  const handleTimeUpdate = (e) => {
    const currentTime = Math.floor(e.target.currentTime);
    handleAdviceByTimestamp(currentTime);
  };

  // Hiển thị Tab Bài tập hoặc Lời khuyên dựa trên trạng thái tab đang hoạt động
  return (
    <div className={styles.workoutDetails}>
      {isFinishPopupVisible && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>
            <h3>Nhập link video tập luyện</h3>
            <p>Hãy nhập video tập luyện của các bài tập:</p>
            <input
              type="text"
              value={videoLink}
              onChange={(e) => setVideoLink(e.target.value)}
              placeholder="Nhập link bài tập"
              className={styles.videoInput}
            />
            <div className={styles.buttons}>
              <button onClick={handleFinishWorkout}>Lưu</button>
              <button onClick={() => setIsFinishPopupVisible(false)}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.sidebar}>
        <h2 className={styles.workoutName}>{workout.name}</h2>
        <p>
          {new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }).format(new Date(workout.date))}
        </p>

        <div>
          {progressExercises.length > 0 ? (
            progressExercises.map((progress, index) => (
              <div key={progress._id}>
                <button
                  className={`${styles.exerciseButton} 
                  ${selectedExerciseIndex === index
                      ? styles.exerciseButtonSelected
                      : ""
                    } 
                  ${progress.completionRate === "true"
                      ? styles.completedButton
                      : ""
                    }`}
                >
                  Bài tập: {progress.exerciseId?.name || "N/A"}
                </button>
              </div>
            ))
          ) : (
            <p>Không có bài tập.</p>
          )}
        </div>

        <div className={styles.completionCircle}>
          <div>{completionPercentage}%</div>
        </div>
      </div>

      <div className={`${styles.exerciseContent} flex-col flex gap-3`}>
        <div className="flex justify-end">
          {workout.status === "success" && (
            <div className={styles.tabs}>
              <button
                onClick={() => setActiveTab("advice")}
                className={activeTab === "advice" ? styles.activeTab : ""}
              >
                Lời khuyên
              </button>
              <button
                onClick={() => setActiveTab("workout")}
                className={activeTab === "workout" ? styles.activeTab : ""}
              >
                Chi tiết tập luyện
              </button>
            </div>
          )}
        </div>

        {activeTab === "workout" ? (
          <>
            {isWorkoutOverview ? (
              <>
                <h3 className={styles.workoutName}>Tổng quan:</h3>
                <p>Thời lượng: {workout.duration || "N/A"}</p>
                <p>Số bài tập: {progressExercises.length}</p>
                <p>Trạng thái: {workout.status || "N/A"}</p>
                <div className={styles.buttons}>
                  <button onClick={handleNext}>Bắt đầu tập</button>
                </div>
              </>
            ) : selectedExercise ? (
              <>
                <h3 className={styles.workoutName}>
                  Bài tập: {selectedExercise.exerciseId?.name || "N/A"}
                </h3>
                <div
                  className={styles.description}
                  dangerouslySetInnerHTML={{
                    __html: selectedExercise.exerciseId?.description || "",
                  }}
                />

                {selectedExercise.exerciseId?.video ? (
                  <video
                    key={selectedExercise._id}
                    controls
                    ref={videoRef}
                    onTimeUpdate={handleVideoProgress}
                  >
                    <source
                      src={selectedExercise.exerciseId.video}
                      type="video/mp4"
                    />
                    Trình duyệt không hỗ trợ định dạng video này.
                  </video>
                ) : (
                  <p>Không có video cho bài tập này.</p>
                )}

                <div className={styles.buttons}>
                  <button onClick={handleBack}>
                    {selectedExerciseIndex === 0 ? 'Trở lại tổng quan buổi tập' : 'Trở lại'}
                  </button>
                  {selectedExerciseIndex < progressExercises.length - 1 ? (
                    <button onClick={handleNext}>Tiếp tục</button>
                  ) : workout.status === 'success' ? (
                    <div className={styles.completedMessage}>
                      <button disabled className={styles.completedButton}>
                        Bạn đã hoàn thành khóa học này rồi
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setIsFinishPopupVisible(true)}>
                      {videoLink ? 'Hoàn thành' : 'Cần nhập video để hoàn thành'}
                    </button>
                  )}
                </div>
              </>
            ) : (
              <p>Hãy chọn bài tập.</p>
            )}
          </>
        ) : (
          <div className={styles.adviceTab}>
            <h3 className='text-white'>Lời khuyên của HLV</h3>
            <div className='mb-4'>
              {workout.preview?.video && (
                <>
                  <video
                    controls
                    src={workout.preview?.video}
                    className='w-full h-64 rounded-md'
                    onTimeUpdate={handleTimeUpdate} // Theo dõi thời gian cập nhật
                  >
                    Trình duyệt của bạn không hỗ trợ thẻ video.
                  </video>

                  {/* Hiển thị danh sách lời khuyên */}
                  <div className='mt-4'>
                    <h3 className='mb-2 text-lg font-semibold text-gray-700'>Danh sách lời khuyên</h3>
                    <ul className='space-y-2'>
                      {adviceList.length > 0 ? (
                        adviceList.map((adv) => (
                          <li
                            key={adv.timestamp}
                            className='flex justify-between p-2 border rounded-md cursor-pointer bg-white hover:bg-gray-100'
                            onClick={() => {
                              setTimestamp(adv.timestamp);
                              const videoElement = document.querySelector('video');
                              if (videoElement) {
                                videoElement.currentTime = adv.timestamp; // Đặt thời gian video
                              }
                              setCurrentAdvice(adv.advice); // Hiển thị lời khuyên trong textarea
                            }}
                          >
                            <span>{new Date(adv.timestamp * 1000).toISOString().substr(14, 5)}</span> {/* Format MM:SS */}
                            <span className='text-sm text-gray-600'>{adv.advice}</span>
                          </li>
                        ))
                      ) : (
                        <p className='text-sm text-gray-500'>Chưa có lời khuyên nào </p>
                      )}
                    </ul>
                  </div>
                </>
              )}
            </div>

          </div>
        )}
      </div>
      {isChatPopupVisible && (
        <div className={styles.chatRoomPopup}>
          <ChatRoom />
          <button onClick={toggleChatPopup} className={styles.closeChatButton}>
            Đóng
          </button>
        </div>
      )}

      <div className={styles.chatIcon} onClick={toggleChatPopup}>
        Chat
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover/>
    </div>
  );
};

export default WorkoutDetails;
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameDay,
  isSameMonth,
} from 'date-fns';
import axios from 'axios';
import moment from 'moment';
import './ViewSchedules.css';
import '../css/bootstrap.min.css';
import '../css/font-awesome.min.css';
import ChatRoom from './chatRoom';
import { LeftOutlined } from "@ant-design/icons";
import { Button, Modal } from "react-bootstrap"; // Import Modal from react-bootstrap

const ViewSchedules = () => {
  const { subscriptionId } = useParams();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [workouts, setWorkouts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dailyWorkouts, setDailyWorkouts] = useState([]);
  const [showModal, setShowModal] = useState(false); // Rename showPopup to showModal
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  
  const [isChatPopupVisible, setIsChatPopupVisible] = useState(false);
  const toggleChatPopup = () => {
    setIsChatPopupVisible(!isChatPopupVisible);
  };

  
  const handleCloseModal = () => setShowModal(false); // Rename closeModal
  const handleShowModal = (date) => { // Rename handleDateClick and update logic
    setSelectedDate(date);
    fetchWorkouts(date);
    setShowModal(true);
  };
  

  const checkSurveyAndFetchSubscription = async () => {
    const token = localStorage.getItem('token');
    try {
      const surveyCheckResponse = await axios.get(
        `http://localhost:4000/api/users/subscriptions/${subscriptionId}/check-survey`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (surveyCheckResponse.status === 201) {
        navigate(`/userSubscription/${subscriptionId}/survey`);
      } else {
        fetchMonthlyWorkouts();
      }
    } catch (err) {
      setMessage('Error fetching subscription details or survey status.');
      console.error(err);
    }
  };

  const fetchMonthlyWorkouts = async () => {
    const token = localStorage.getItem("token");
    try {
      const startDate = startOfMonth(currentMonth);
      const endDate = endOfMonth(currentMonth);
      const response = await axios.get(
        `http://localhost:4000/api/users/subscriptions/${subscriptionId}/workouts`,
        {
          params: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setWorkouts(response.data.workouts || []);
    } catch (error) {
      console.error("Error fetching workouts:", error);
    }
  };

  const handleDateClick = (date) => { // Now only sets the date and shows the modal
    const selectedWorkoutIndex = workouts.findIndex((workout) =>
      isSameDay(new Date(workout.date), date)
    );

    if (selectedWorkoutIndex === -1) {
      return;
    }

    setSelectedDate(date);
    handleShowModal(date); // Show the modal
  };

  const fetchWorkouts = async (date) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `http://localhost:4000/api/users/subscriptions/${subscriptionId}/workouts`,
        {
          params: { date: date.toISOString() },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDailyWorkouts(response.data.workouts || []);
    } catch (error) {
      console.error("Error fetching workouts:", error);
    }
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const renderHeader = () => {
    const dateFormat = "MMMM yyyy";
    return (
      <div className="calendar-header">
        <button onClick={prevMonth} className="prev-btn">
          Trước đó
        </button>
        <span className="current-month">
          {format(currentMonth, dateFormat)}
        </span>
        <button onClick={nextMonth} className="next-btn">
          Kế tiếp
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const dateFormat = "eeee";
    const startDate = startOfWeek(currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <th key={i} className="day-header">
          {format(addDays(startDate, i), dateFormat)}
        </th>
      );
    }
    return <tr>{days}</tr>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        const isWorkoutDay = workouts.some((workout) =>
          isSameDay(new Date(workout.date), cloneDay)
        );

        days.push(
          <td
            key={day}
            className={`text-center cursor-pointer py-2 ${!isSameMonth(day, monthStart) ? 'text-gray-300' : isWorkoutDay ? 'bg-gray-300' : ''
              } ${isSameDay(day, new Date()) ? 'bg-blue-500 text-white' : ''}`}
            onClick={() => handleDateClick(cloneDay)}
          >
            <span>{formattedDate}</span>
          </td>
        );
        day = addDays(day, 1);
      }
      rows.push(<tr key={day}>{days}</tr>);
      days = [];
    }
    return <tbody>{rows}</tbody>;
  };

  const goToWorkoutDetail = (workoutId) => {
    navigate(`/userSubscription/${subscriptionId}/workout/${workoutId}`);
  };

  useEffect(() => {
    checkSurveyAndFetchSubscription();
  }, [subscriptionId]);

  return (
    <section className='px-4 py-8 bg-gray-50'>
      <div className='container mx-auto flex flex-row'>
        <div className='flex-1'>
          <div className='flex items-center justify-between mb-6'>
            <div className='text-left'>
              <Button
                icon={<LeftOutlined />}
                onClick={() => navigate(-1)}
                className="mb-2"
                style={{ marginRight: "10px" }}
              >
                Quay lại
              </Button>
              <h2 className='text-2xl font-semibold'>Lịch trình tập luyện của bạn</h2>
            </div>
          </div>

          {renderHeader()}

          <div className='overflow-x-auto'>
            <table className='w-full text-sm table-auto'>
              <thead>{renderDays()}</thead>
              {renderCells()}
            </table>
          </div>

          {/* React Bootstrap Modal */}
          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>
                Chi tiết tập luyện cho {selectedDate && format(selectedDate, 'MMMM d, yyyy')}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {dailyWorkouts.length > 0 ? (
                <ul className='p-0'>
                  {dailyWorkouts.map((workout) => (
                    <li
                      key={workout._id}
                      className='flex flex-col items-start gap-2 mb-3'
                      style={{ listStyleType: 'none' }}
                    >
                      <strong>{workout.name}</strong>
                      <div>
                        Trạng thái:
                        {workout.status === 'success' ? (
                          <span className='px-2 py-1 text-white bg-green-500 rounded-md ml-1'>
                            {workout.status}
                          </span>
                        ) : (
                          <span className='ml-1'>{workout.status}</span>
                        )}
                      </div>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => goToWorkoutDetail(workout._id)}
                      >
                        Xem chi tiết
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Không có lịch tập luyện nào cho ngày này.</p>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Đóng
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
        {isChatPopupVisible && (
        <div className="chatRoomPopup">
          <ChatRoom />
          <button onClick={toggleChatPopup} className="closeChatButton">
            Đóng
          </button>
        </div>
      )}

      <div className="chatIcon" onClick={toggleChatPopup}>
        Chat
      </div>
        {/* <div className='w-1/3'>
          <ChatRoom />
        </div> */}
      </div>
    </section>
  );
};

export default ViewSchedules;
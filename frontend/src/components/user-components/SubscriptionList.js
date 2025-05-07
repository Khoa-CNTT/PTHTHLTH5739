import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./SubscriptionList.module.css"; // Import CSS module

const SubscriptionList = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Tính toán tiến độ hoàn thành và trả về số lượng workout hoàn thành và tổng số workout
  const calculateProgress = (workouts) => {
    const completedWorkouts = workouts.filter(workout => workout.status === 'success').length;
    const totalWorkouts = workouts.length;
    return {
      progress: totalWorkouts > 0 ? (completedWorkouts / totalWorkouts) * 100 : 0,
      completedWorkouts,
      totalWorkouts,
    };
  };

// Lọc đăng ký theo search
  const handleSearchChange = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    if (value === "") {
      setFilteredSubscriptions(subscriptions);
    } else {
      const filtered = subscriptions.filter(subscription =>
        subscription._id.toLowerCase().includes(value) ||
        subscription.courseId?.name.toLowerCase().includes(value)
      );
      setFilteredSubscriptions(filtered);
    }
  };

  // Sắp xếp subscriptions theo ngày từ mới đến cũ
  const sortSubscriptionsByDate = (subscriptions) => {
    return subscriptions.map(subscription => {
      const sortedWorkouts = [...subscription.workoutId].sort((a, b) => new Date(b.date) - new Date(a.date));
      return { ...subscription, workoutId: sortedWorkouts };
    });
  };

  useEffect(() => {
    const fetchSubscriptions = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          "http://localhost:4000/api/users/subscriptions",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const sortedSubscriptions = sortSubscriptionsByDate(response.data.subscriptions);
        setSubscriptions(sortedSubscriptions);
        setFilteredSubscriptions(sortedSubscriptions);
      } catch (err) {
        setError("Error fetching subscriptions.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  // const handleViewSubscription = (subscriptionId) => {
  //   navigate(`/userSubscription/${subscriptionId}`);
  // };

  const handleViewSchedule = (subscriptionId) => {
    navigate(`/userSchedule/${subscriptionId}`);
  };

  // const handleViewSurvey = (subscriptionId) => {
  //   navigate(`/userSurvey/${subscriptionId}`);
  // };

  // const handleViewChatRoom = (subscriptionId) => {
  //   navigate(`/chatRoom/${subscriptionId}`);
  // };

  if (loading) return <p>Đang chạy...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container-full">
      <div className={styles.subscriptionList}>
        {/* Tạo ô tìm kiếm */}
        <input
          type="text"
          className="form-control mb-4"
          placeholder="Tìm kiếm theo ID đăng ký hoặc tên khóa học"
          value={searchTerm}
          onChange={handleSearchChange}
        />

        {filteredSubscriptions.length > 0 ? (
          filteredSubscriptions.map((subscription) => {
            const { progress, completedWorkouts, totalWorkouts } = calculateProgress(subscription.workoutId);
            const subscriptionStatus = subscription.subscriptionStatus.status;

            let statusClass = '';
            switch (subscriptionStatus) {
              case 'pause':
                statusClass = styles.subscriptionStatusPause;
                break;
              case 'finish':
                statusClass = styles.subscriptionStatusFinish;
                break;
              case 'active':
              case 'ongoing':
                statusClass = styles.subscriptionStatusActive;
                break;
              default:
                statusClass = styles.subscriptionStatusActive;
            }

            return (
              <div className={`${styles.card} ${statusClass}`} key={subscription._id}>
                <div className={styles.cardBody}>
                  {/* Hiển thị status ở góc trên bên phải */}
                  <h5 className={styles.cardTitle}>
                    {subscription.courseId?.name || "Unknown Course"}
                  </h5>
                  <img src={subscription.courseId?.image} style={{width:"550px", height:"300px", display: 'inline-block'}} alt="Course" />        
                  {/* Thanh tiến độ */}
                  <div>
                    <div className={styles.progressContainer}>
                      <div className={styles.progressBarWrapper}>
                        <div
                          className={styles.progressBar}
                          style={{ width: `${progress}%` }}
                        />
                        <div className={styles.progressText}>
                          {progress.toFixed(2)}% ({completedWorkouts}/{totalWorkouts})
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.cardActions}>
                    <button
                      className={styles.btn}
                      onClick={() => handleViewSchedule(subscription._id)}
                    >
                      Xem lịch trình
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p>Không có đăng ký nào được tìm thấy</p>
        )}
      </div>
    </div>
  );
};

export default SubscriptionList;

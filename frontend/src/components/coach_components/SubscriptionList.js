import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Modal, Form } from "react-bootstrap";
import "./SubscriptionList.css";
import { toast, ToastContainer } from "react-toastify";

function SubscriptionList() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/coaches/subscriptions",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setSubscriptions(response.data.data);
      } catch (error) {
        console.error("Lỗi khi tải đăng ký:", error);
        toast.error("Lỗi khi tải đăng ký");
      }
    };
    fetchSubscriptions();
  }, []);

  const calculateProgress = (workoutId) => {
    if (!workoutId || workoutId.length === 0) return 0;
    const completedWorkouts = workoutId.filter(workout => workout.status === 'success').length;
    return Math.round((completedWorkouts / workoutId.length) * 100);
  };

  const handleViewSurvey = (subscriptionId) => {
    navigate(`/coach/subscription/${subscriptionId}/userSurvey`);
  };

  const filteredSubscriptions = subscriptions.filter((subscription) =>
    subscription.courseId?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div >
      <h2 className="text-3xl font-bold mb-8" style={{ color: '#000' }}>
        Danh sách đăng ký
      </h2>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <div className="mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên khóa học..."
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredSubscriptions.map((subscription) => {
          const isPaused = subscription.subscriptionStatus.status === "pause";
          const progress = calculateProgress(subscription.workoutId);

          return (
            <div
              key={subscription._id}
              className={`rounded-lg shadow-lg overflow-hidden ${isPaused ? 'bg-gray-200' : 'bg-white'
                }`}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    {subscription.courseId?.name || "Unknown Course"}
                  </h3>
                  {isPaused && (
                    <span className="px-3 py-1 bg-red-500 text-white rounded-full text-sm font-bold">
                      PAUSED
                    </span>
                  )}
                </div>

                {/* User Info */}
                <div className="space-y-2 mb-4">
                  <p className="text-gray-600">
                    <span className="font-semibold">Học viên: </span>
                    {subscription.userId?.name || "Unknown User"}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Ngày bắt đầu: </span>
                    {new Date(subscription.createdAt).toLocaleDateString()}
                  </p>

                </div>

                {/* Progress Section */}
                <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">Tiến độ</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-3 text-center">
                    <div>
                      <div className="text-lg font-bold text-green-500">
                        {subscription.workoutId?.filter(w => w.status === 'success').length || 0}
                      </div>
                      <div className="text-sm text-gray-600">Hoàn thành</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-600">
                        {subscription.workoutId?.filter(w => w.status !== 'success').length || 0}
                      </div>
                      <div className="text-sm text-gray-600">Còn lại</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to={`/coach/subscription/${subscription._id}`}
                    className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 text-center transition-colors duration-200"
                  >
                    Xem chi tiết
                  </Link>
                  <button
                    onClick={() => handleViewSurvey(subscription._id)}
                    className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-200"
                  >
                    Xem Khảo sát
                  </button>
                  <Link
                    to={`/chatRoom/${subscription._id}`}
                    className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 text-center transition-colors duration-200"
                  >
                    Phòng chat
                  </Link>
                  <Link
                    to={`/preview/${subscription._id}`}
                    className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 text-center transition-colors duration-200"
                  >
                    Xem tiến dộ
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SubscriptionList;

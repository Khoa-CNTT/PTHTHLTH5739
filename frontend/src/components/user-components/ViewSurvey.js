import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "./ViewSurvey.css";
import { LeftOutlined } from "@ant-design/icons";
import { Button } from "react-bootstrap";

const ViewSurvey = () => {
  const { subscriptionId } = useParams();
  const [survey, setSurvey] = useState({
    _id: "",
    level: "",
    dayPerWeek: [],
    hourPerDay: "",
    height: "",
    weight: "",
  });
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSurvey = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `http://localhost:4000/api/users/${subscriptionId}/survey`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setSurvey(response.data);
        setQuestions(response.data.surveyOptions || []);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi tải khảo sát:", error);
        setError("Lỗi khi tải khảo sát");
        setLoading(false);
      }
    };

    fetchSurvey();
  }, [subscriptionId]);

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDayChange = (day) => {
    setEditForm((prev) => {
      const newDays = prev.dayPerWeek.includes(day)
        ? prev.dayPerWeek.filter((d) => d !== day)
        : [...prev.dayPerWeek, day];
      return { ...prev, dayPerWeek: newDays };
    });
  };

  const handleOptionChange = (questionId, optionId) => {
    setEditForm((prev) => ({
      ...prev,
      surveyOptions: prev.surveyOptions.map((q) =>
        q.questionId._id === questionId ? { ...q, optionId } : q
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra xem có sự thay đổi so với dữ liệu cũ không
    const hasChanges =
      editForm.level !== survey.level ||
      editForm.hourPerDay !== survey.hourPerDay ||
      editForm.height !== survey.height ||
      editForm.weight !== survey.weight ||
      JSON.stringify(editForm.dayPerWeek) !==
      JSON.stringify(survey.dayPerWeek) ||
      editForm.surveyOptions.some(
        (option, index) => option.optionId !== questions[index].optionId
      );

    if (!hasChanges) {
      toast.info("No changes detected");
      setIsEditing(false);
      setEditForm(null);
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await axios.put(
        `http://localhost:4000/api/users/surveys/${survey._id}`,
        {
          level: editForm.level,
          dayPerWeek: editForm.dayPerWeek,
          hourPerDay: editForm.hourPerDay,
          height: editForm.height,
          weight: editForm.weight,
          surveyOptions: editForm.surveyOptions.map((q) => ({
            questionId: q.questionId, // Sử dụng _id thay vì object đầy đủ
            optionId: q.optionId,
          })),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSurvey(response.data.survey);
      setQuestions(response.data.survey.surveyOptions);
      setIsEditing(false);
      setEditForm(null);
      toast.success("Khảo sát đã được cập nhật thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật khảo sát:", error);
      toast.error("Lỗi khi cập nhật khảo sát");
    }
  };

  if (loading) return <div className="loading-spinner">Đang tải khảo sát...</div>;
  if (error) return <div className="error-message">{error}</div>;

  const daysOfWeek = [
    "Thứ Hai",
    "Thứ Ba",
    "Thứ Tư",
    "Thứ Năm",
    "Thứ Sáu",
    "Thứ Bảy",
    "Chủ Nhật",
  ];

  return (
    <div className="survey-container">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <div className="survey-form">
        <Button
          icon={<LeftOutlined />}
          onClick={() => navigate(-1)}
          className="mb-2"
          style={{ marginRight: "10px" }} // Thêm một chút khoảng cách
        >
          Quay lại
        </Button>
        <h2 className="survey-title">
          {isEditing ? "Edit Survey" : "Survey Details"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="survey-section">
            <h3>Thông tin cơ bản</h3>
            <div className="form-group">
              <label>Mức độ:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="level"
                  value={editForm.level}
                  onChange={handleEditFormChange}
                  className="form-input"
                />
              ) : (
                <span className="form-value">{survey.level}</span>
              )}
            </div>

            <div className="form-group">
              <label>Ngày trong tuần:</label>
              {isEditing ? (
                <div className="days-selector">
                  {daysOfWeek.map((day) => (
                    <label key={day} className="day-checkbox">
                      <input
                        type="checkbox"
                        checked={editForm.dayPerWeek.includes(day)}
                        onChange={() => handleDayChange(day)}
                      />
                      {day}
                    </label>
                  ))}
                </div>
              ) : (
                <span className="form-value">
                  {survey.dayPerWeek?.join(", ")}
                </span>
              )}
            </div>

            <div className="form-group">
              <label>Số giờ mỗi ngày:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="hourPerDay"
                  value={editForm.hourPerDay}
                  onChange={handleEditFormChange}
                  className="form-input"
                />
              ) : (
                <span className="form-value">{survey.hourPerDay}</span>
              )}
            </div>

            <div className="form-group">
              <label>Chiều cao (cm):</label>
              {isEditing ? (
                <input
                  type="number"
                  name="height"
                  value={editForm.height}
                  onChange={handleEditFormChange}
                  className="form-input"
                />
              ) : (
                <span className="form-value">{survey.height}</span>
              )}
            </div>

            <div className="form-group">
              <label>Cân nặng (kg):</label>
              {isEditing ? (
                <input
                  type="number"
                  name="weight"
                  value={editForm.weight}
                  onChange={handleEditFormChange}
                  className="form-input"
                />
              ) : (
                <span className="form-value">{survey.weight}</span>
              )}
            </div>
          </div>

          <div className="survey-section">
            <h3>Câu hỏi khảo sát</h3>
            {questions.map((question, index) => (
              <div key={index} className="question-item">
                <p className="question-text">{question?.questionId?.question}</p>
                {isEditing ? (
                  <select
                    value={editForm.surveyOptions[index]?.optionId || ""}
                    onChange={(e) =>
                      handleOptionChange(
                        question?.questionId?._id,
                        e.target.value
                      )
                    }
                    className="options-select"
                  >
                    <option value="">Chọn một tùy chọn</option>
                    {question?.questionId?.optionId?.map((option) => (
                      <option key={option?._id} value={option?._id}>
                        {option?.option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="selected-option">
                    {question?.questionId?.optionId?.find(
                      (opt) => opt?._id === question?.optionId
                    )?.option || "Chưa chọn câu trả lời"}
                  </p>
                )}
              </div>
            ))}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ViewSurvey;
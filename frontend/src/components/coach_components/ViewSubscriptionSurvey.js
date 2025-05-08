import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "react-bootstrap";
import { LeftOutlined } from "@ant-design/icons";
import "./ViewSubscriptionSurvey.css";
import { toast, ToastContainer } from "react-toastify";

const ViewSubscriptionSurvey = () => {
  const { subscriptionId } = useParams();
  const [survey, setSurvey] = useState({
    level: "",
    dayPerWeek: "",
    hourPerDay: "",
    height: "",
    weight: "",
  });
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    const fetchSurvey = async () => {
      const token = localStorage.getItem("token");
      const apiUrl = `http://localhost:4000/api/users/${subscriptionId}/survey`;

      try {
        const response = await axios.get(apiUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setSurvey(response.data || {});
        setQuestions(response.data?.surveyOptions || []);
        console.log("data", response.data);
        console.log("survey option", response.data?.surveyOptions);
        setLoading(false);
        toast.error("")
      } catch (error) {
        console.error("Lỗi khi tải khảo sát:", error);
        toast.error("Lỗi khi tải khảo sát.")
        setLoading(false);
      }
    };

    fetchSurvey();
  }, [subscriptionId]);

  const handleSurveyChange = (e) => {
    setSurvey({ ...survey, [e.target.name]: e.target.value });
  };

  if (loading) return <p>Loading survey...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container-full">
    <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover/>
    <div className="survey-form">
      <Button
        icon={<LeftOutlined />}
        onClick={() => navigate(-1)}
        className="mb-2"
        style={{ marginRight: "10px" }} // Thêm một chút khoảng cách
      >
        Quay lại
      </Button>
      <h2 className="survey-title">Xem chi tiết khảo sát</h2>

      {/* Basic Survey Info */}
      <div className="survey-group">
        <label>Mức độ:</label>
        <input
          type="text"
          name="level"
          value={survey.level}
          onChange={handleSurveyChange}
        />
      </div>

      <div className="survey-group">
        <label>Ngày trong tuần:</label>
        <input
          type="text"
          name="dayPerWeek"
          value={survey.dayPerWeek}
          onChange={handleSurveyChange}
        />
      </div>

      <div className="survey-group">
        <label>Số giờ mỗi ngày:</label>
        <input
          type="text"
          name="hourPerDay"
          value={survey.hourPerDay}
          onChange={handleSurveyChange}
        />
      </div>

      <div className="survey-group">
        <label>Chiều cao (cm):</label>
        <input
          type="number"
          name="height"
          value={survey.height}
          onChange={handleSurveyChange}
        />
      </div>

      <div className="survey-group">
        <label>Cân nặng (kg):</label>
        <input
          type="number"
          name="weight"
          value={survey.weight}
          onChange={handleSurveyChange}
        />
      </div>

      {/* Survey Questions and Options */}
      <div className="survey-questions">
        <h3>Câu hỏi khảo sát</h3>
        {questions.map((question, index) => (
          <div key={index} className="question-item">
            <p className="question-text">
              <strong>{question?.questionId?.question}</strong>
            </p>
            <ul className="options-list">
              {question.questionId?.optionId?.map((option) => (
                <li
                  key={option._id}
                  className={`option-item ${option._id === question.optionId ? "selected-option" : ""
                    }`}
                >
                  {option.option}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default ViewSubscriptionSurvey;

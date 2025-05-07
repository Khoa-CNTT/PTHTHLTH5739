import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./PreSubscriptionSurvey.css"; // Thêm file CSS để tùy chỉnh giao diện

const PreSubscriptionSurvey = () => {
  const { subscriptionId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [dayPerWeek, setDayPerWeek] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitError, setSubmitError] = useState(""); // Error khi gửi survey
  const [successMessage, setSuccessMessage] = useState(""); // Hiển thị thông báo thành công
  const [step, setStep] = useState(1); // Quản lý bước hiện tại

  useEffect(() => {
    const fetchSurveyQuestions = async () => {
      try {

        const response = await axios.get(
          `http://localhost:4000/api/users/detailSub/${subscriptionId}`
        );

        setQuestions(response?.data?.courseId?.questions || []);
      } catch (err) {
        setError("Error loading survey questions.");
      } finally {
        setLoading(false);
      }
    };

    fetchSurveyQuestions();
  }, []);

  const handleAnswerChange = (questionId, optionId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleNextStep = () => {
    if (step === 1) {
      // Kiểm tra nếu người dùng chưa nhập đầy đủ thông tin ở bước 1
      if (!height || !weight || dayPerWeek.length === 0) {
        setSubmitError("Please fill in all required fields before proceeding.");
        return;
      }
      setSubmitError(""); // Xóa lỗi nếu có
    }
    setStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    // if (Object.keys(answers).length !== questions.length) {
    //   setSubmitError("Vui lòng trả lời tất cả các câu hỏi trước khi gửi.");
    //   return;
    // }

    try {
      const response = await axios.post(
        `http://localhost:4000/api/users/subscriptions/${subscriptionId}/survey`,
        { subscriptionId, answers, height, weight, dayPerWeek },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      console.log("Response:", response.data);
      setSuccessMessage("Survey submitted successfully!");
      setSubmitError("");
      setTimeout(() => {
        navigate(`/userSchedule/${subscriptionId}`);
      }, 2000);
    } catch (err) {
      console.error(
        "Error submitting survey:",
        err.response?.data || err.message
      );
      setSubmitError("Error submitting survey. Please try again.");
    }
  };

  console.log(
    "URL:",
    `http://localhost:4000/api/users/subscriptions/${subscriptionId}/survey`
  );
  console.log("Body:", { answers, height, weight, dayPerWeek });

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p className="error-message">{error}</p>;

  const questionsPerStep = Math.ceil(questions.length / 2);
  const displayedQuestions = questions.slice(
    (step - 2) * questionsPerStep,
    step * questionsPerStep
  );

  const handleBack = () => {
    navigate('/userSchedule');
  };

  console.log(questions);


  return (
    <div className="survey-container">
      <button className='px-4 py-2 mb-6 text-white bg-orange-500 rounded-md' onClick={handleBack}>
        &larr; Quay lại
      </button>
      <h1 className="survey-title">Hoàn thành khảo sát của bạn</h1>
      <p className="survey-description">
        Vui lòng hoàn thành khảo sát từng bước này để giúp chúng tôi hiểu rõ hơn
        nhu cầu của bạn.
      </p>

      {step === 1 && (
        <div className="step-container">
          <h2 className="step-title">Bước 1: Thông tin cá nhân</h2>
          <div className="form-group">
            <label htmlFor="height">Chiều cao (cm):</label>
            <input
              type="number"
              id="height"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="Nhập chiều cao của bạn"
            />
          </div>

          <div className="form-group">
            <label htmlFor="weight">Cân nặng (kg):</label>
            <input
              type="number"
              id="weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Nhập cân nặng của bạn"
            />
          </div>

          <div className="form-group">
            <label>Ngày trong tuần:</label>
            <div className="checkbox-group">
              {[...Array(7)].map((_, index) => {
                const day = [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ][index];
                return (
                  <label key={day} className="checkbox-item">
                    <input
                      type="checkbox"
                      value={day}
                      checked={dayPerWeek.includes(day)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setDayPerWeek([...dayPerWeek, day]);
                        } else {
                          setDayPerWeek(dayPerWeek.filter((d) => d !== day));
                        }
                      }}
                    />
                    {day}
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="step-container">
          <h2 className="step-title">Bước 2: Câu hỏi khảo sát</h2>
          {displayedQuestions.map((question, index) => (
            <div key={question._id} className="survey-question">
              <h3 className="question-title">
                {index + 1 + (step - 2) * questionsPerStep}. {question.question}
              </h3>
              <div className="options-container">
                {question.optionId.map((option) => (
                  <label key={option._id} className="option-item">
                    <input
                      type="radio"
                      name={question._id}
                      value={option._id}
                      onChange={() =>
                        handleAnswerChange(question._id, option._id)
                      }
                      checked={answers[question._id] === option._id}
                    />
                    {option.option}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {submitError && <p className="error-message">{submitError}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <div className="navigation-buttons">
        {step > 1 && (
          <button className="back-btn" onClick={handlePreviousStep}>
            Trước
          </button>
        )}
        {step === 1 && (
          <button className="next-btn" onClick={handleNextStep}>
            Sau
          </button>
        )}
        {step === 2 && (
          <button className="submit-btn" onClick={handleSubmit}>
            Nộp khảo sát
          </button>
        )}
      </div>
    </div>
  );
};

export default PreSubscriptionSurvey;

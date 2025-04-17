import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { fetchCoachProfile } from "../../services/coachService";

const ManageQuestionCoach = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  const [newOption, setNewOption] = useState("");
  const [editQuestionId, setEditQuestionId] = useState(null);
  const [editQuestionText, setEditQuestionText] = useState("");
  const [editOptionId, setEditOptionId] = useState(null);
  const [editOptionText, setEditOptionText] = useState("");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await fetchCoachProfile();
        const response = await axios.get(
          `http://localhost:4000/api/admins/questions?idCoach=${data._id}`
        );
        setQuestions(response.data);
      } catch (error) {
        toast.error("Lỗi khi tải danh sách câu hỏi");
      }
    };

    fetchQuestions();
  }, []);

  // Thêm câu hỏi mới
  const handleAddQuestion = async () => {
    if (!newQuestion) return;

    try {

        const data = await fetchCoachProfile();

      const response = await axios.post(
        "http://localhost:4000/api/admins/questions",
        { question: newQuestion, idCoach: data._id }
      );
      setQuestions([...questions, response.data]);
      setNewQuestion("");
      toast.success("Thêm câu hỏi thành công!");
    } catch (error) {
      toast.error("Lỗi khi thêm câu hỏi");
    }
  };

  // Sửa câu hỏi
  const handleEditQuestion = async (id) => {
    if (!editQuestionText) return;

    try {
      const response = await axios.put(
        `http://localhost:4000/api/admins/questions/${id}`,
        { question: editQuestionText }
      );
      setQuestions(questions.map((q) => (q._id === id ? response.data : q)));
      setEditQuestionId(null);
      setEditQuestionText("");
      toast.success("Cập nhật câu hỏi thành công!");
    } catch (error) {
      toast.error("Lỗi khi cập nhật câu hỏi");
    }
  };

  // Xóa câu hỏi
  const handleDeleteQuestion = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/admins/questions/${id}`);
      setQuestions(questions.filter((q) => q._id !== id));
      if (currentQuestionId === id) setCurrentQuestionId(null); // Đóng câu hỏi đang mở
      toast.success("Xóa câu hỏi thành công!");
    } catch (error) {
      toast.error("Lỗi khi xóa câu hỏi");
    }
  };

  // Thêm đáp án mới
  const handleAddOption = async (questionId) => {
    if (!newOption) return;

    try {
      const response = await axios.post(
        `http://localhost:4000/api/admins/questions/${questionId}/options`,
        { option: newOption }
      );
      setQuestions(
        questions.map((q) =>
          q._id === questionId
            ? { ...q, optionId: [...q.optionId, response.data] }
            : q
        )
      );
      setNewOption("");
      toast.success("Thêm đáp án thành công!");
    } catch (error) {
      toast.error("Lỗi khi thêm đáp án");
    }
  };

  // Sửa đáp án
  const handleEditOption = async (questionId, optionId) => {
    if (!editOptionText) return;

    try {
      const response = await axios.put(
        `http://localhost:4000/api/admins/questions/${questionId}/options/${optionId}`,
        { option: editOptionText }
      );
      setQuestions(
        questions.map((q) => {
          if (q._id === questionId) {
            return {
              ...q,
              optionId: q.optionId.map((opt) =>
                opt._id === optionId ? response.data : opt
              ),
            };
          }
          return q;
        })
      );
      setEditOptionId(null);
      setEditOptionText("");
      toast.success("Cập nhật đáp án thành công!");
    } catch (error) {
      toast.error("Lỗi khi cập nhật đáp án");
    }
  };

  // Xóa đáp án
  const handleDeleteOption = async (questionId, optionId) => {
    try {
      await axios.delete(
        `http://localhost:4000/api/admins/questions/${questionId}/options/${optionId}`
      );
      setQuestions(
        questions.map((q) => {
          if (q._id === questionId) {
            return {
              ...q,
              optionId: q.optionId.filter((opt) => opt._id !== optionId),
            };
          }
          return q;
        })
      );
      toast.success("Xóa đáp án thành công!");
    } catch (error) {
      toast.error("Lỗi khi xóa đáp án");
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Quản Lý Câu Hỏi</h1>

      {/* Ô input thêm câu hỏi mới */}
      <div className="input-group mb-4">
        <input
          type="text"
          className="form-control"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="Nhập câu hỏi mới"
        />
        <button className="btn btn-primary" 
        //onClick={handleAddQuestion}
        >
          Thêm Câu Hỏi
        </button>
      </div>

      {/* Danh sách câu hỏi */}
      {questions.map((q) => (
        <div key={q._id} className="card mb-3">
          <div className="card-header d-flex justify-content-between align-items-center">
            {editQuestionId === q._id ? (
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  value={editQuestionText}
                  onChange={(e) => setEditQuestionText(e.target.value)}
                  placeholder="Sửa câu hỏi"
                />
                <button
                  className="btn btn-success"
                  //onClick={() => handleEditQuestion(q._id)}
                >
                  Lưu
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setEditQuestionId(null)}
                >
                  Hủy
                </button>
              </div>
            ) : (
              <>
                <strong>{q.question}</strong>
                <div>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => {
                      setEditQuestionId(q._id);
                      setEditQuestionText(q.question);
                    }}
                  >
                    Sửa
                  </button>
                  <button
                    className="btn btn-danger btn-sm me-2"
                    //onClick={() => handleDeleteQuestion(q._id)}
                  >
                    Xóa
                  </button>
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() =>
                      setCurrentQuestionId(
                        q._id === currentQuestionId ? null : q._id
                      )
                    }
                  >
                    {currentQuestionId === q._id ? "Ẩn Đáp Án" : "Hiện Đáp Án"}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Hiển thị các đáp án nếu câu hỏi này được chọn */}
          {currentQuestionId === q._id && (
            <div className="card-body">
              <h5 className="card-title">Danh Sách Đáp Án</h5>
              <ul className="list-group">
                {q.optionId.map((opt) => (
                  <li
                    key={opt._id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {editOptionId === opt._id ? (
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          value={editOptionText}
                          onChange={(e) => setEditOptionText(e.target.value)}
                          placeholder="Sửa đáp án"
                        />
                        <button
                          className="btn btn-success"
                          //onClick={() => handleEditOption(q._id, opt._id)}
                        >
                          Lưu
                        </button>
                        <button
                          className="btn btn-secondary"
                          onClick={() => setEditOptionId(null)}
                        >
                          Hủy
                        </button>
                      </div>
                    ) : (
                      <>
                        {opt.option}
                        <div>
                          <button
                            className="btn btn-warning btn-sm me-2"
                            // onClick={() => {
                            //   setEditOptionId(opt._id);
                            //   setEditOptionText(opt.option);
                            // }}
                          >
                            Sửa
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            //onClick={() => handleDeleteOption(q._id, opt._id)}
                          >
                            Xóa
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>

              {/* Thêm đáp án mới */}
              <div className="input-group mt-3">
                <input
                  type="text"
                  className="form-control"
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  placeholder="Nhập đáp án mới"
                />
                <button
                  className="btn btn-primary"
                  onClick={() => handleAddOption(q._id)}
                >
                  Thêm Đáp Án
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      <ToastContainer />
    </div>
  );
};

export default ManageQuestionCoach;

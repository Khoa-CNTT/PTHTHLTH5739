import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import { FiEdit, FiTrash2, FiEye, FiEyeOff } from "react-icons/fi";
const QuestionManager = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  const [newOption, setNewOption] = useState("");
  const [editQuestionId, setEditQuestionId] = useState(null);
  const [editQuestionText, setEditQuestionText] = useState("");
  const [editOptionId, setEditOptionId] = useState(null);
  const [editOptionText, setEditOptionText] = useState("");
  const [showDeleteQuestionModal, setShowDeleteQuestionModal] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const [showDeleteOptionModal, setShowDeleteOptionModal] = useState(false);
  const [optionToDelete, setOptionToDelete] = useState(null);
  const [questionIdForOptionDelete, setQuestionIdForOptionDelete] = useState(null);

  const containerStyle = {
    backgroundColor: "white",
    color: "black",
    padding: "20px",
    borderRadius: "8px",
  };

  const headingStyle = {
    color: "black",
  };

  const cardStyle = {
    backgroundColor: "white",
    color: "black",
    border: "1px solid #ccc",
  };

  const cardHeaderStyle = {
    backgroundColor: "#f0f0f0",
    color: "black",
    borderBottom: "1px solid #ccc",
  };

  const listItemStyle = {
    backgroundColor: "white",
    color: "black",
    borderColor: "#e0e0e0",
  };

  const formControlStyle = {
    backgroundColor: "white",
    color: "black",
    border: "1px solid #ccc",
  };

  const formControlPlaceholderStyle = {
    color: "#777",
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/admins/questions"
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
      const response = await axios.post(
        "http://localhost:4000/api/admins/questions",
        { question: newQuestion }
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

  // Hiển thị modal xác nhận xóa câu hỏi
  const handleShowDeleteQuestionModal = (id) => {
    setQuestionToDelete(id);
    setShowDeleteQuestionModal(true);
  };

  // Đóng modal xác nhận xóa câu hỏi
  const handleCloseDeleteQuestionModal = () => {
    setQuestionToDelete(null);
    setShowDeleteQuestionModal(false);
  };

  // Xóa câu hỏi sau khi xác nhận
  const handleDeleteQuestionConfirm = async () => {
    try {
      await axios.delete(
        `http://localhost:4000/api/admins/questions/${questionToDelete}`
      );
      setQuestions(questions.filter((q) => q._id !== questionToDelete));
      if (currentQuestionId === questionToDelete) setCurrentQuestionId(null); // Đóng câu hỏi đang mở
      toast.success("Xóa câu hỏi thành công!");
    } catch (error) {
      toast.error("Lỗi khi xóa câu hỏi");
    } finally {
      handleCloseDeleteQuestionModal();
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

  // Hiển thị modal xác nhận xóa đáp án
  const handleShowDeleteOptionModal = (questionId, optionId) => {
    setQuestionIdForOptionDelete(questionId);
    setOptionToDelete(optionId);
    setShowDeleteOptionModal(true);
  };

  // Đóng modal xác nhận xóa đáp án
  const handleCloseDeleteOptionModal = () => {
    setQuestionIdForOptionDelete(null);
    setOptionToDelete(null);
    setShowDeleteOptionModal(false);
  };

  // Xóa đáp án sau khi xác nhận
  const handleDeleteOptionConfirm = async () => {
    try {
      await axios.delete(
        `http://localhost:4000/api/admins/questions/${questionIdForOptionDelete}/options/${optionToDelete}`
      );
      setQuestions(
        questions.map((q) => {
          if (q._id === questionIdForOptionDelete) {
            return {
              ...q,
              optionId: q.optionId.filter((opt) => opt._id !== optionToDelete),
            };
          }
          return q;
        })
      );
      toast.success("Xóa đáp án thành công!");
    } catch (error) {
      toast.error("Lỗi khi xóa đáp án");
    } finally {
      handleCloseDeleteOptionModal();
    }
  };

  return (
    <div style={containerStyle}>
      <h2 className="mb-4" style={headingStyle}>
        Quản Lý Câu Hỏi
      </h2>

      {/* Ô input thêm câu hỏi mới */}
      <div className="input-group mb-4">
        <input
          type="text"
          className="form-control"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="Nhập câu hỏi mới"
          style={formControlStyle}
          placeholderStyle={formControlPlaceholderStyle}
        />
        <button className="btn btn-primary ms-3" onClick={handleAddQuestion}>
          Thêm Câu Hỏi
        </button>
      </div>

      {/* Danh sách câu hỏi */}
      {questions.map((q) => (
        <div key={q._id} className="card mb-3" style={cardStyle}>
          <div className="card-header d-flex justify-content-between align-items-center" style={cardHeaderStyle}>
            {editQuestionId === q._id ? (
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  value={editQuestionText}
                  onChange={(e) => setEditQuestionText(e.target.value)}
                  placeholder="Sửa câu hỏi"
                  style={formControlStyle}
                  placeholderStyle={formControlPlaceholderStyle}
                />
                <button
                  className="btn btn-success ms-5"
                  onClick={() => handleEditQuestion(q._id)}
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
                <strong style={headingStyle}>{q.question}</strong>
                <div>
                  <button
                    className="btn btn-warning me-2"
                    onClick={() => {
                      setEditQuestionId(q._id);
                      setEditQuestionText(q.question);
                    }}
                    style={{ height: '40px', justifyContent: 'center' }}
                  >
                    <FiEdit />
                  </button>
                  <button
                    className="btn btn-danger me-2"
                    onClick={() => handleShowDeleteQuestionModal(q._id)}
                    style={{ height: '40px', justifyContent: 'center' }}
                  >
                    <FiTrash2 />
                  </button>
                  <button
                    className="btn btn-info "
                    onClick={() =>
                      setCurrentQuestionId(q._id === currentQuestionId ? null : q._id)}
                    style={{ height: '40px', justifyContent: 'center' }}
                  >
                    {currentQuestionId === q._id ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Hiển thị các đáp án nếu câu hỏi này được chọn */}
          {currentQuestionId === q._id && (
            <div className="card-body" style={{ backgroundColor: "white", color: "black" }}>
              <h5 className="card-title" style={headingStyle}>
                Danh Sách Đáp Án
              </h5>
              <ul className="list-group">
                {q.optionId.map((opt) => (
                  <li
                    key={opt._id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                    style={listItemStyle}
                  >
                    {editOptionId === opt._id ? (
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          value={editOptionText}
                          onChange={(e) => setEditOptionText(e.target.value)}
                          placeholder="Sửa đáp án"
                          style={formControlStyle}
                          placeholderStyle={formControlPlaceholderStyle}
                        />
                        <button
                          className="btn btn-success"
                          onClick={() => handleEditOption(q._id, opt._id)}
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
                        <span style={headingStyle}>{opt.option}</span>
                        <div>
                          <button
                            className="btn btn-warning btn-sm me-2"
                            onClick={() => {
                              setEditOptionId(opt._id);
                              setEditOptionText(opt.option);
                            }}
                            style={{ height: '40px', justifyContent: 'center' }}
                          >
                            <FiEdit />
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleShowDeleteOptionModal(q._id, opt._id)}
                            style={{ height: '40px', justifyContent: 'center' }}
                          >
                            <FiTrash2 />
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
                  style={formControlStyle}
                  placeholderStyle={formControlPlaceholderStyle}
                />
                <button
                  className="btn btn-primary"
                  onClick={() => handleAddOption(q._id)}
                  style={{ height: '40px', justifyContent: 'center' }}
                >
                  Thêm Đáp Án
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Modal xác nhận xóa câu hỏi */}
      <Modal
        show={showDeleteQuestionModal}
        onHide={handleCloseDeleteQuestionModal}
      >
        <Modal.Header closeButton>
          <Modal.Title >Xác nhận xóa câu hỏi</Modal.Title>
        </Modal.Header>
        <Modal.Body >
          Bạn có chắc chắn muốn xóa câu hỏi này không? Hành động này không thể
          hoàn tác.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteQuestionModal}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleDeleteQuestionConfirm}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal xác nhận xóa đáp án */}
      <Modal
        show={showDeleteOptionModal}
        onHide={handleCloseDeleteOptionModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa đáp án</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn xóa đáp án này không? Hành động này không thể hoàn
          tác.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteOptionModal}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleDeleteOptionConfirm}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default QuestionManager;
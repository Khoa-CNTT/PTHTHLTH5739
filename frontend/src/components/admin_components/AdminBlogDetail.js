import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faReply } from "@fortawesome/free-solid-svg-icons";
import "react-toastify/dist/ReactToastify.css";

const AdminBlogDetail = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedComment, setEditedComment] = useState("");
  const [replyingCommentId, setReplyingCommentId] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [isAdmin, setIsAdmin] = useState(false); // Kiểm tra quyền admin

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);

      const fetchProfile = async () => {
        try {
          const response = await axios.get(
            "http://localhost:4000/api/users/getAccount",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setUserId(response.data._id);
          setIsAdmin(response.data.role === "admin"); // Thiết lập trạng thái admin
        } catch (error) {
          console.error("Lỗi khi lấy thông tin cá nhân:", error);
          if (error.response && error.response.status === 401) {
            toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
            setIsLoggedIn(false);
            localStorage.removeItem("token");
          }
        }
      };

      fetchProfile();
    }

    const fetchData = async () => {
      try {
        const blogResponse = await axios.get(
          `http://localhost:4000/api/admins/blogs/${blogId}`
        );
        setBlog(blogResponse.data);

        const commentsResponse = await axios.get(
          `http://localhost:4000/api/admins/blogs/${blogId}/comments`
        );
        setComments(commentsResponse.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [blogId]);

  const fetchComments = async () => {
    try {
      const commentsResponse = await axios.get(
        `http://localhost:4000/api/admins/blogs/${blogId}/comments`
      );
      setComments(commentsResponse.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error("Bạn cần đăng nhập để bình luận.");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `http://localhost:4000/api/admins/blogs/${blogId}/comments`,
        {
          content: newComment,
          userId: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNewComment("");
      fetchComments();
    } catch (err) {
      console.error("Lỗi khi gửi bình luận:", err);
      if (err.response && err.response.status === 401) {
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        setIsLoggedIn(false);
        localStorage.removeItem("token");
      } else {
        setError(err.message);
      }
    }
  };

  const handleReplyClick = (commentId) => {
    setReplyingCommentId(commentId);
  };

  const handleReplyChange = (e) => {
    setReplyContent(e.target.value);
  };

  const handleReplySubmit = async (e, parentCommentId) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error("Bạn cần đăng nhập để trả lời.");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `http://localhost:4000/api/admins/blogs/${blogId}/comments`,
        {
          content: replyContent,
          userId: userId,
          parentCommentId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReplyingCommentId(null);
      setReplyContent("");
      fetchComments();
    } catch (err) {
      console.error("Lỗi khi gửi trả lời:", err);
      if (err.response && err.response.status === 401) {
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        setIsLoggedIn(false);
        localStorage.removeItem("token");
      } else {
        setError(err.message);
      }
    }
  };

  const handleEditClick = (comment) => {
    setEditingCommentId(comment._id);
    setEditedComment(comment.content);
  };

  const handleEditChange = (e) => {
    setEditedComment(e.target.value);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `http://localhost:4000/api/admins/comments/${editingCommentId}`,
        {
          content: editedComment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEditingCommentId(null);
      setEditedComment("");
      fetchComments();
    } catch (err) {
      console.error("Lỗi khi chỉnh sửa bình luận:", err);
      if (err.response && err.response.status === 401) {
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        setIsLoggedIn(false);
        localStorage.removeItem("token");
      } else {
        setError(err.message);
      }
    }
  };

  const handleDeleteClick = async (commentId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(
        `http://localhost:4000/api/admins/comments/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchComments();
    } catch (err) {
      console.error("Lỗi khi xóa bình luận:", err);
      if (err.response && err.response.status === 401) {
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        setIsLoggedIn(false);
        localStorage.removeItem("token");
      } else {
        setError(err.message);
      }
    }
  };

  const handleDeleteBlog = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:4000/api/admins/blogs/${blogId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Đã xóa blog thành công");
      navigate("/admin/blogs"); // Chuyển hướng về trang danh sách blog sau khi xóa
    } catch (err) {
      console.error("Lỗi khi xóa blog:", err);
      if (err.response && err.response.status === 401) {
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        setIsLoggedIn(false);
        localStorage.removeItem("token");
      } else {
        setError(err.message);
      }
    }
  };

  const renderComments = (comments, isReply = false) => {
    return comments.map((comment) => (
      <div
        key={comment._id}
        className="comment"
        style={{
          marginLeft: isReply ? "20px" : "0",
          padding: "10px",
          marginBottom: "10px",
          border: "1px solid #ddd",
          borderRadius: "5px",
        }}
      >
        <p
          className="comment-meta"
          style={{ fontSize: "12px", marginBottom: "5px" }}
        >
          <strong>
            {comment.userId ? comment.userId.name : "Người dùng không xác định"}
          </strong>{" "}
          - {new Date(comment.date).toLocaleString()}
        </p>
        <p
          className="comment-content"
          style={{ fontSize: "14px", marginBottom: "10px" }}
        >
          {comment.content}
        </p>
        {isLoggedIn && userId === comment.userId?._id && (
          <div className="comment-actions" style={{ fontSize: "16px" }}>
            <FontAwesomeIcon
              icon={faEdit}
              onClick={() => handleEditClick(comment)}
              className="icon"
              style={{ marginRight: "10px", cursor: "pointer" }}
            />
            <FontAwesomeIcon
              icon={faTrash}
              onClick={() => handleDeleteClick(comment._id)}
              className="icon"
              style={{ cursor: "pointer" }}
            />
          </div>
        )}
        {editingCommentId === comment._id ? (
          <form onSubmit={handleEditSubmit}>
            <textarea
              value={editedComment}
              onChange={handleEditChange}
              style={{ width: "100%", padding: "8px" }}
            />
            <button type="submit" className="btn btn-primary">
              Lưu
            </button>
          </form>
        ) : (
          <div>
            <FontAwesomeIcon
              icon={faReply}
              onClick={() => handleReplyClick(comment._id)}
              className="icon"
              style={{ cursor: "pointer", marginTop: "10px" }}
            />
            {replyingCommentId === comment._id && (
              <form
                onSubmit={(e) => handleReplySubmit(e, comment._id)}
                style={{ marginTop: "10px" }}
              >
                <textarea
                  value={replyContent}
                  onChange={handleReplyChange}
                  style={{ width: "100%", padding: "8px" }}
                />
                <button type="submit" className="btn btn-primary">
                  Trả lời
                </button>
              </form>
            )}
          </div>
        )}
        {comment.replies &&
          comment.replies.length > 0 &&
          renderComments(comment.replies, true)}
      </div>
    ));
  };

  if (loading) return <p>Đang tải...</p>;

  if (error) return <p>Lỗi: {error}</p>;

  return (
    <div className="blog-detail">
      <div className="blog-header">
        <h2>{blog?.title}</h2>
        <p className="blog-author">Bởi {blog?.author}</p>
        <p className="blog-date">{new Date(blog?.date).toLocaleString()}</p>
        {isAdmin && (
          <div className="admin-actions">
            <button onClick={handleDeleteBlog} className="btn btn-danger">
              Xóa Blog
            </button>
          </div>
        )}
      </div>
      <div className="blog-content">
        <ReactQuill value={blog?.content} readOnly={true} theme="bubble" />
      </div>
      <div className="comments-section">
        <h3>Bình luận</h3>
        {renderComments(comments)}
      </div>
      {isLoggedIn && (
        <div className="comment-form">
          <textarea
            value={newComment}
            onChange={handleCommentChange}
            placeholder="Viết bình luận..."
          />
          <button onClick={handleCommentSubmit} className="btn btn-primary">
            Gửi bình luận
          </button>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default AdminBlogDetail;
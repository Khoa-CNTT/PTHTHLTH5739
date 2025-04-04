import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./BlogDetail.css";
import Comments from "../custom/Custom-Comment";

const BlogDetail = () => {
  const { blogId } = useParams();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);

      const fetchProfile = async () => {
        try {
          const response = await axios.get("/api/users/getAccount", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUserId(response.data._id);
        } catch (error) {
          console.error("Error fetching profile:", error);
          if (error.response && error.response.status === 401) {
            toast.error("Session expired. Please log in again.");
            setIsLoggedIn(false);
            localStorage.removeItem("token");
          }
        }
      };

      fetchProfile();
    }

    const fetchData = async () => {
      try {
        const blogResponse = await axios.get(`/api/admins/blogs/${blogId}`);
        setBlog(blogResponse.data);

        const commentsResponse = await axios.get(
          `/api/admins/blogs/${blogId}/comments`
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
        `/api/admins/blogs/${blogId}/comments`
      );
      setComments(commentsResponse.data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (blogId) {
      fetchComments();
    }
  }, [blogId]);

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>Lỗi: {error}</p>;

  return (
    <div className="blog-detail">
      {blog ? (
        <>
          <div
            className="feature-image"
            style={{
              backgroundImage: `url(${blog.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              width: "100vw",
              maxHeight: "400px",
              borderLeft: "5px solid #000",
              borderRight: "5px solid #000",
            }}
          ></div>
          <div className="container-fluid blog-detail-content article-content">
            <div className="blog-detail-paper">
              <div className="article-header site-main">
                <h1 className="entry-title">{blog.title}</h1>
                <div className="author">
                  <a className="avatar" href="#">
                    <img
                      height="80"
                      width="80"
                      src="https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg"
                      alt="Author"
                    />
                  </a>
                  <div className="inner-meta">
                    <span>
                      By{" "}
                      <a className="created-by">
                        {blog.author ? blog.author.name : "Unknown"}
                      </a>
                    </span>
                    <p className="created-at">
                      {new Date(blog.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="site-main article-text-wrap">
                <ReactQuill
                  value={blog.content || ""}
                  readOnly={true}
                  theme="bubble"
                  className="blog-detail-content-2 text-justify"
                />
                {/* <div className="entry-summary">{blog.content}</div> */}
              </div>
            </div>
          </div>
          <div className="comment-contain">
            <Comments
              userId={userId}
              comments={comments}
              isLoggedIn={isLoggedIn}
              fetchComments={fetchComments}
              setIsLoggedIn={setIsLoggedIn}
              setError={setError}
            />
          </div>
        </>
      ) : (
        <p>Không tìm thấy bài viết nào</p>
      )}

      <ToastContainer />
    </div>
  );
};

export default BlogDetail;

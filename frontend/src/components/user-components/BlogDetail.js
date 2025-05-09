import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./BlogDetail.css";

const BlogDetail = () => {
  const { blogId } = useParams();
  const [blog, setBlog] = useState(null);
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
          console.error("Lỗi khi tải hồ sơ:", error);
          if (error.response && error.response.status === 401) {
            toast.error("Phiên đã hết hạn. Vui lòng đăng nhập lại.");
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
      } catch (err) {
        setError(err.message);
        toast.error("Lỗi khi tải chi tiết bài viết")
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [blogId]);

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>Lỗi: {error}</p>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container-cus py-12">
        <div className="blog-detail">
          {blog ? (
            <>
              <div className="container-fluid blog-detail-content article-content">
                <div className="blog-detail-paper">
                  <div className="article-header site-main">
                    <h1 className="entry-title">{blog.title}</h1>
                    <div className="feature-image">
                      <img
                        height="800"
                        width="850"
                        src={blog.image}
                        alt="ảnh bài viết"
                      />
                    </div>
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
                          {new Date(blog.date).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="site-main article-text-wrap">

                    <div className="entry-summary">{blog.content}</div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p>Không tìm thấy bài viết nào</p>
          )}

          <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover/>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;

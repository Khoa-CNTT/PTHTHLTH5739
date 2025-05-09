// src/pages/Blog.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Blog.css';
import SearchBar from './blog-components/SearchBar';
import Categories from './blog-components/Categories';
import RecentPosts from './blog-components/RecentPosts';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";

const Blog = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const blogsPerPage = 4;
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get('http://localhost:4000/api/users/blogs')
            .then((response) => {
                setBlogs(response.data);
                setLoading(false);
            })
            .catch((err) => {
                toast.error("Lỗi khi tải blog");
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const filteredBlogs = blogs.filter((blog) => {
        const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory =
            !selectedCategory || blog.category.catName.toLowerCase() === selectedCategory.toLowerCase();
        return matchesSearch && matchesCategory;
    });
    // Pagination logic
    const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
    const startIndex = (currentPage - 1) * blogsPerPage;
    const endIndex = startIndex + blogsPerPage;
    const currentBlogs = filteredBlogs.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };


    if (error) return <p className='error'>Lỗi: {error}</p>;

    console.log("Secat", selectedCategory);

    return (
        <div className="bg-gray-50 min-h-screen">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <div className="container-cus py-12">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">Bài viết</h1>

                </div>

                <div className="lg:flex lg:gap-12">
                    {/* Main Content */}
                    <div className="lg:w-2/3">
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                            </div>
                        ) : error ? (
                            <div className="text-red-500 text-center p-4">{error}</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8"> {/* Thay đổi grid-cols */}
                                {currentBlogs.map((blog) => (
                                    <article
                                        key={blog._id}
                                        className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300"
                                    >
                                        <div className="relative">
                                            <img
                                                src={blog.image}
                                                alt={blog.title}
                                                className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute top-2 right-2"> {/* Điều chỉnh vị trí category badge */}
                                                <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs"> {/* Giảm kích thước badge */}
                                                    {blog.category?.catName}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-4"> {/* Giảm padding */}
                                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2"> {/* Giảm margin bottom */}
                                                <div className="flex items-center gap-1">
                                                    <i className="far fa-user"></i>
                                                    {blog.author?.name || 'Unknown'}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <i className="far fa-calendar"></i>
                                                    {new Date(blog.date).toLocaleString()}
                                                </div>
                                            </div>

                                            <h2 className="text-lg font-bold text-gray-800 mb-2 hover:text-orange-500 transition-colors line-clamp-2"> {/* Giảm kích thước tiêu đề và giới hạn dòng */}
                                                {blog.title}
                                            </h2>

                                            <p className="text-gray-600 mb-3 line-clamp-2 text-sm"> {/* Giảm margin bottom và giới hạn dòng nội dung */}
                                                {blog.content}
                                            </p>

                                            <button
                                                onClick={() => navigate(`/blog/${blog._id}`)}
                                                className="inline-flex items-center gap-1 hover:text-black-600 transition-colors text-sm"
                                            >
                                                Đọc thêm
                                                <i className="fas fa-arrow-right"></i>
                                            </button>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        <div className="flex justify-center gap-2 mt-8"> {/* Giảm margin top */}
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`px-3 py-1 rounded-md text-sm ${currentPage === 1
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    : 'bg-white text-gray-700 hover:bg-orange-500 hover:text-white'
                                    } transition-colors`}
                            >
                                Trước
                            </button>
                            <span className="px-3 py-1 bg-white rounded-md text-sm">
                                Trang {currentPage} của {totalPages}
                            </span>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`px-3 py-1 rounded-md text-sm ${currentPage === totalPages
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    : 'bg-white text-gray-700 hover:bg-orange-500 hover:text-white'
                                    } transition-colors`}
                            >
                                Sau
                            </button>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:w-1/3 mt-12 lg:mt-0">
                        <div className="sticky top-24 space-y-8">
                            {/* Search */}
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Tìm kiếm</h3>
                                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                            </div>

                            {/* Thể loại */}
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Thể loại</h3>
                                <Categories onCategorySelect={setSelectedCategory} />
                            </div>

                            {/* Bài viết gần đây */}
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Bài viết gần đây</h3>
                                <RecentPosts />
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default Blog;
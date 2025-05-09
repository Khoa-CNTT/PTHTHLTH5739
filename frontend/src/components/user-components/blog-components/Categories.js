import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";

const btnStyles = `font-medium transition-all hover:text-red-500 hover:bg-transparent py-2 px-4 rounded-md hover:bg-gray-200 text-sm`;

function Categories({ onCategorySelect }) {
    const [categories, setCategories] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [categoryBlogsMap, setCategoryBlogsMap] = useState({});
    const [totalBlogs, setTotalBlogs] = useState(0); // Trạng thái theo dõi tổng số blog

    // Fetch Thể loại
    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/users/blogCategory');
            setCategories(response.data.blogCategory);
        } catch (error) {
            console.error("Lỗi khi tải danh mục:", error);
            toast.error("Lỗi khi tìm kiếm danh mục");
        }
    };

    // Fetch blogs
    const fetchBlogs = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/users/blogs');
            setBlogs(response.data);
            setTotalBlogs(response.data.length);
        } catch (error) {
            console.error("Lỗi khi tải blog:", error);
            toast.error("Lỗi khi tải blog");
        }
    };

    // Map các danh mục vào blog để tra cứu nhanh
    useEffect(() => {
        fetchCategories();
        fetchBlogs();
    }, []);

    useEffect(() => {
        // Map các danh mục blog và đếm số lượng blog cho mỗi danh mục
        const map = {};
        blogs.forEach(blog => {
            if (blog.category) {
                const catName = blog.category.catName;
                if (map[catName]) {
                    map[catName] += 1;
                } else {
                    map[catName] = 1;
                }
            }
        });
        setCategoryBlogsMap(map);
    }, [blogs]);

    return (
        <div className='p-6 bg-gray-100 rounded-md shadow-sm'>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <h3 className='relative pb-2 text-xl font-bold text-gray-800 mb-4 before:absolute before:bottom-0 before:h-1 before:w-16 before:bg-red-500'>
                Thể loại
            </h3>
            <div className="flex flex-wrap gap-2"> {/* Sử dụng flex và flex-wrap */}
                <button
                    className={`${btnStyles} text-gray-700`}
                    onClick={() => onCategorySelect(null)}
                    disabled={false} //Luôn bật cho "Tất cả Thể loại"
                >
                    Tất cả ({totalBlogs}) {/* Hiển thị tổng số bài viết */}
                </button>
                {categories.map((category) => {
                    const blogCount = categoryBlogsMap[category.catName] || 0;
                    const isCategoryDisabled = blogCount === 0;

                    return (
                        <button
                            key={category._id}
                            className={`${btnStyles} text-gray-700 ${isCategoryDisabled ? 'cursor-not-allowed opacity-50' : ''}`}
                            onClick={() => !isCategoryDisabled && onCategorySelect(category.catName)}
                            disabled={isCategoryDisabled} // Không hiển thị nếu ko có bài viết nào
                        >
                            {category.catName}
                            {blogCount > 0 && ` (${blogCount})`} {/* hiển thị nếu bài viết lớn > 0 */}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default Categories;
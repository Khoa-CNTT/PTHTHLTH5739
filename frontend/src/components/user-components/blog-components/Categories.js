import React, { useState, useEffect } from 'react';
import axios from 'axios';

const btnStyles = `font-medium transition-all hover:text-red-500 hover:bg-transparent py-2 px-4 rounded-md hover:bg-gray-200 text-sm`;

function Categories({ onCategorySelect }) {
    const [categories, setCategories] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [categoryBlogsMap, setCategoryBlogsMap] = useState({});
    const [totalBlogs, setTotalBlogs] = useState(0); // State để theo dõi tổng số bài viết

    // Lấy danh mục
    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/users/blogCategory');
            setCategories(response.data.blogCategory);
        } catch (error) {
            console.error("Lỗi khi lấy danh mục:", error);
        }
    };

    // Lấy bài viết
    const fetchBlogs = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/users/blogs');
            setBlogs(response.data);
            setTotalBlogs(response.data.length);
        } catch (error) {
            console.error("Lỗi khi lấy bài viết:", error);
        }
    };

    // Ánh xạ danh mục với bài viết để tra cứu nhanh
    useEffect(() => {
        fetchCategories();
        fetchBlogs();
    }, []);

    useEffect(() => {
        // Ánh xạ danh mục bài viết và đếm số lượng bài viết cho mỗi danh mục
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
            <h3 className='relative pb-2 text-xl font-bold text-gray-800 mb-4 before:absolute before:bottom-0 before:h-1 before:w-16 before:bg-red-500'>
                Thể loại
            </h3>
            <div className="flex flex-wrap gap-2"> {/* Sử dụng flex và flex-wrap */}
                <button
                    className={`${btnStyles} text-gray-700`}
                    onClick={() => onCategorySelect(null)}
                    disabled={false} // Luôn bật cho "Tất cả Thể loại"
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
                            disabled={isCategoryDisabled} // Ẩn nếu không có bài viết nào
                        >
                            {category.catName}
                            {blogCount > 0 && ` (${blogCount})`} {/* Hiển thị nếu số bài viết lớn hơn 0 */}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default Categories;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';  // Để điều hướng đến chi tiết blog

function RecentPosts() {
	const [recentPosts, setRecentPosts] = useState([]);
	useEffect(() => {
        // Fetch all blogs
        const fetchBlogs = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/users/blogs');
                const blogs = response.data;
                // Lọc và sắp xếp blog theo ngày gần nhất (mới nhất trước)
                const sortedBlogs = blogs
                    .filter(blog => blog.status === 'approved')  //Chỉ những blog được chấp thuận
                    .sort((a, b) => new Date(b.date) - new Date(a.date));  // Sắp xếp theo ngày theo thứ tự giảm dần

                // Lấy 3 bài viết gần đây nhất
                setRecentPosts(sortedBlogs.slice(0, 3));  // chỉ lấy 3 bài đầu tiên
            } catch (error) {
                console.error("Error fetching blogs:", error);
            }
        };

        fetchBlogs();
    }, []);

    return (
        <div className='flex flex-col gap-4 p-6 bg-gray-100'>
            <h3 className='relative pb-2 text-xl font-bold before:absolute before:bottom-0 before:h-1 before:w-16 before:bg-red-500'>
            Bài viết gần đây
            </h3>
            {recentPosts.map((post) => (
                <div className='flex items-center gap-4' key={post._id}>
                    <img src={post.image} alt={post.title} className='w-48 h-32' />
                    <div>
                        <p className='mb-2 font-medium text-gray-500'>{new Date(post.date).toLocaleDateString()}</p>
                        <h4 className='font-semibold'>
                            {post.title.length > 32 ? post.title.slice(0, 32) + '...' : post.title}
                        </h4>
                        <Link to={`/blog/${post._id}`} className='text-blue-500 hover:underline'>
                        Đọc thêm
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default RecentPosts;

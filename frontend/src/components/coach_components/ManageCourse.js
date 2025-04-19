import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';

// Gộp cả CourseList (danh sách khóa học) và CourseForm (biểu mẫu khóa học) vào cùng một file ManageCourse.js
const ManageCourse = () => {
    const [courses, setCourses] = useState([]);
    const [course, setCourse] = useState({
        name: '',
        description: '',
        duration: '',
        price: 0,
        status: '',
        difficulty: '',
        coachId: ''
    });
    const [coaches, setCoaches] = useState([]);
    const history = useHistory();
    const { id } = useParams();

    // Lấy tất cả các khóa học
    useEffect(() => {
        axios.get('/api/courses')
            .then(response => setCourses(response.data))
            .catch(error => console.log('Lỗi khi tải khóa học:', error));
    }, []);

    // Lấy tất cả các huấn luyện viên
    useEffect(() => {
        axios.get('/api/coaches')
            .then(response => setCoaches(response.data))
            .catch(error => console.log('Lỗi khi tải huấn luyện viên:', error));
    }, []);

    // Lấy thông tin khóa học theo ID nếu đang chỉnh sửa
    useEffect(() => {
        if (id) {
            axios.get(`/api/courses/${id}`)
                .then(response => setCourse(response.data))
                .catch(error => console.log('Lỗi khi tải thông tin khóa học:', error));
        }
    }, [id]);

    // Xử lý xóa khóa học
    const handleDelete = (id) => {
        axios.delete(`/api/courses/${id}`)
            .then(() => {
                setCourses(courses.filter(course => course._id !== id));
            })
            .catch(error => console.log('Lỗi khi xóa khóa học:', error));
    };

    // Xử lý thay đổi trong biểu mẫu
    const handleChange = (e) => {
        setCourse({ ...course, [e.target.name]: e.target.value });
    };

    // Xử lý khi gửi biểu mẫu (tạo hoặc chỉnh sửa khóa học)
    const handleSubmit = (e) => {
        e.preventDefault();
        if (id) {
            axios.put(`/api/courses/${id}`, course)
                .then(() => history.push('/courses'))
                .catch(error => console.log('Lỗi khi cập nhật khóa học:', error));
        } else {
            axios.post('/api/courses', course)
                .then(() => history.push('/courses'))
                .catch(error => console.log('Lỗi khi tạo khóa học:', error));
        }
    };

    return (
        <div>
            <h2>Quản Lý Khóa Học</h2>

            {/* Danh sách khóa học */}
            <table>
                <thead>
                    <tr>
                        <th>Tên</th>
                        <th>Mô tả</th>
                        <th>Giá</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map((course) => (
                        <tr key={course._id}>
                            <td>{course.name}</td>
                            <td>{course.description}</td>
                            <td>{course.price}</td>
                            <td>{course.status}</td>
                            <td>
                                <button onClick={() => history.push(`/courses/${course._id}/edit`)}>Sửa</button>
                                <button onClick={() => handleDelete(course._id)}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Biểu mẫu khóa học (Tạo/Chỉnh sửa) */}
            <h3>{id ? 'Chỉnh Sửa Khóa Học' : 'Tạo Khóa Học Mới'}</h3>
            <form onSubmit={handleSubmit}>
                <label>
                    Tên:
                    <input
                        type="text"
                        name="name"
                        value={course.name}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Mô tả:
                    <textarea
                        name="description"
                        value={course.description}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Thời lượng:
                    <input
                        type="text"
                        name="duration"
                        value={course.duration}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Giá:
                    <input
                        type="number"
                        name="price"
                        value={course.price}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Trạng thái:
                    <input
                        type="text"
                        name="status"
                        value={course.status}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Độ khó:
                    <input
                        type="text"
                        name="difficulty" value={course.difficulty}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Huấn luyện viên:
                    <select
                        name="coachId"
                        value={course.coachId}
                        onChange={handleChange}
                    >
                        <option value="">-- Chọn huấn luyện viên --</option>
                        {coaches.map(coach => (
                            <option key={coach._id} value={coach._id}>
                                {coach.introduce}
                            </option>
                        ))}
                    </select>
                </label>

                <button type="submit">
                    {id ? 'Cập Nhật Khóa Học' : 'Tạo Khóa Học'}
                </button>
            </form>
        </div>
    );
};

export default ManageCourse;
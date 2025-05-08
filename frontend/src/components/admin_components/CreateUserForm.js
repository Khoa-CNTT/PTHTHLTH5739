import React, { useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const CreateUserForm = ({ onUserCreated }) => {
    const [newUser, setNewUser] = useState({
        email: '',
        name: '',
        role: 'user',
        status: 'activate',
        avatar: '',
        gender: 'male',
        dob: '',
        phone: '',
        address: '',
        password: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();

        if (!newUser.email || !newUser.name || !newUser.password) {
            toast.error('Email, Tên và Mật khẩu là bắt buộc.');
            return;
        }

        try {
            const res = await axios.post('http://localhost:4000/api/admins/accounts', newUser, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            toast.success(res.data.msg);
            onUserCreated();
            setNewUser({
                email: '',
                name: '',
                role: 'user',
                status: 'activate',
                avatar: '',
                gender: 'male',
                dob: '',
                phone: '',
                address: '',
                password: '',
            });
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Không tạo được người dùng');
        }
    };

    return (
        
        <Form onSubmit={handleCreateUser}>
            <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                    type="email"
                    name="email"
                    value={newUser.email}
                    onChange={handleInputChange}
                    required
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Tên</Form.Label>
                <Form.Control
                    type="text"
                    name="name"
                    value={newUser.name}
                    onChange={handleInputChange}
                    required
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Link Avatar</Form.Label>
                <Form.Control
                    type="url"
                    name="avatar"
                    placeholder="Nhập URL hình ảnh đại diện"
                    value={newUser.avatar}
                    onChange={handleInputChange}
                />
                <Form.Text className="text-muted">
                    Cung cấp URL hình ảnh hợp lệ (ví dụ: https://example.com/avatar.jpg).
                </Form.Text>
                {newUser.avatar && (
                    <div className="mt-3">
                        <img
                            src={newUser.avatar}
                            alt="Avatar Preview"
                            style={{ width: '100px', height: '100px', borderRadius: '50%' }}
                        />
                    </div>
                )}
            </Form.Group>
            <Form.Group>
                <Form.Label>Mật khẩu</Form.Label>
                <Form.Control
                    type="text"
                    name="password"
                    value={newUser.password}
                    onChange={handleInputChange}
                    required
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Giới tính</Form.Label>
                <Form.Control as="select" name="gender" value={newUser.gender} onChange={handleInputChange}>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                </Form.Control>
            </Form.Group>
            <Form.Group>
                <Form.Label>Ngày sinh</Form.Label>
                <Form.Control
                    type="date"
                    name="dob"
                    value={newUser.dob}
                    onChange={handleInputChange}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>SĐT</Form.Label>
                <Form.Control
                    type="text"
                    name="phone"
                    value={newUser.phone}
                    onChange={handleInputChange}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Địa chỉ</Form.Label>
                <Form.Control
                    type="text"
                    name="address"
                    value={newUser.address}
                    onChange={handleInputChange}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Tình trạng</Form.Label>
                <Form.Control as="select" name="status" value={newUser.status} onChange={handleInputChange}>
                    <option value="activate">Kích hoạt</option>
                    <option value="blocked">Chặn</option>
                </Form.Control>
            </Form.Group>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => window.history.back()}>
                    Hủy
                </Button>
                <Button type="submit" variant="primary">
                    Thêm mới
                </Button>
            </Modal.Footer>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover/>
        </Form>
    );
};

export default CreateUserForm;

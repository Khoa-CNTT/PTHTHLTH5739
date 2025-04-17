import React, { useState } from 'react';
import '../css/bootstrap.min.css';
import '../css/font-awesome.min.css';
import '../css/style.css';
import './Contact.css';

function Contact() {
    const [report, setReport] = useState({
        name: '',
        email: '',
        type: '',
        message: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setReport({ ...report, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Cảm ơn bạn đã liên hệ với chúng tôi!');
        console.log('Report Submitted', report);
        setReport({ name: '', email: '', type: '', message: '' });
    };

    return (
        <section className="contact-page">
            <div className="container">
                <div className="contact-grid">
                    <div className="contact-info">
                        <h2>Thông tin liên hệ</h2> 
                        <p><i className="fa fa-map-marker" /> Đại học Duy Tân, Hải Châu, Đà Nẵng</p>
                        <p><i className="fa fa-phone" /> (+84) 123 456 789</p>
                        <p><i className="fa fa-envelope" /> fitzoneteams@gmail.com</p>
                        <p><i className="fa fa-clock-o" /> Giờ làm việc: 8:00 - 17:00 (T2 - T6)</p>
                    </div>

                    <div className="contact-form">
                        <h2>Gửi liên hệ cho chúng tôi</h2>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="name"
                                placeholder="Họ tên"
                                value={report.name}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={report.email}
                                onChange={handleChange}
                                required
                            />
                            <select
                                name="type"
                                value={report.type}
                                onChange={handleChange}
                                required
                            >
                                <option value="">-- Loại phản hồi --</option>
                                <option value="question">Câu hỏi</option>
                                <option value="feedback">Góp ý</option>
                                <option value="report">Báo lỗi</option>
                            </select>
                            <textarea
                                name="message"
                                placeholder="Nội dung..."
                                value={report.message}
                                onChange={handleChange}
                                required
                            />
                            <button type="submit" className="submit-btn">Gửi</button>
                        </form>
                    </div>
                </div>

                <div className="map-embed">
                    <iframe
                        title="Google Map"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3833.776119334438!2d108.22054421486064!3d16.076115543485698!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314219b4cdef2bcf%3A0x1d0e1e4fbc3bfe79!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBEdXkgVMOibiAtIER1eSBUw6JuIFVuaXZlcnNpdHk!5e0!3m2!1svi!2s!4v1618234006214!5m2!1svi!2s"
                        width="100%"
                        height="400"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                    ></iframe>
                </div>
            </div>
        </section>
    );
}

export default Contact;

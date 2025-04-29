import React, { useState } from 'react';
import '../css/bootstrap.min.css';
import '../css/font-awesome.min.css';
import '../css/flaticon.css';
import '../css/owl.carousel.min.css';
import '../css/barfiller.css';
import '../css/magnific-popup.css';
import '../css/slicknav.min.css';
import '../css/style.css';
import 'font-awesome/css/font-awesome.min.css';

function Contact() {
    const [report, setReport] = useState({
        type: '',
        message: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setReport({ ...report, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle the form submission logic, such as sending it to a backend API
        console.log('Report Submitted', report);
        // Clear form fields after submission
        setReport({
            type: '',
            message: '',
        });
    };

    return (
        <div>
            {/* Contact Section Begin */}
            <section className="contact-section spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="section-title contact-title">
                                <span>Contact Us</span>
                                <h2>GET IN TOUCH</h2>
                            </div>
                            <div className="contact-widget">
                                <div className="cw-text">
                                    <i className="fa fa-map-marker" />
                                    <p>
                                        333 Middle Winchendon Rd, Rindge,
                                        <br /> NH 03461
                                    </p>
                                </div>
                                <div className="cw-text">
                                    <i className="fa fa-mobile" />
                                    <ul>
                                        <li>125-711-811</li>
                                        <li>125-668-886</li>
                                    </ul>
                                </div>
                                <div className="cw-text email">
                                    <i className="fa fa-envelope" />
                                    <p>Support.gymcenter@gmail.com</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="leave-comment">
                                <form onSubmit={handleSubmit}>
                                    {/* Dropdown for report type */}
                                    <select
                                        name="type"
                                        value={report.type}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="" disabled>
                                            Select Report Type
                                        </option>
                                        <option value="Bug">Bug</option>
                                        <option value="Feedback">Feedback</option>
                                        <option value="General Inquiry">General Inquiry</option>
                                    </select>
                                    
                                    {/* Message input */}
                                    <textarea
                                        name="message"
                                        placeholder="Your Message"
                                        value={report.message}
                                        onChange={handleChange}
                                        required
                                    />
                                    
                                    {/* Submit button */}
                                    <button type="submit">Submit Report</button>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="map">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12087.069761554938!2d-74.2175599360452!3d40.767139456514954!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c254b5958982c3%3A0xb6ab3931055a2612!2sEast%20Orange%2C%20NJ%2C%20USA!5e0!3m2!1sen!2sbd!4v1581710470843!5m2!1sen!2sbd"
                            height={550}
                            style={{ border: 0 }}
                            allowFullScreen=""
                        />
                    </div>
                </div>
            </section>
            {/* Contact Section End */}
        </div>
    );
}

export default Contact;

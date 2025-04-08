const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendEmail = async (to, subject, text) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
        };

        await transporter.sendMail(mailOptions);
        console.log('Email đã gửi thành công');
    } catch (error) {
        console.error('Lỗi khi gửi email:', error);
        throw new Error('Gửi email không thành công');
    }
};

module.exports = sendEmail;

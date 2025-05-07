const axios = require('axios');
const crypto = require('crypto');
const Subscription = require('../../models/subscription');
const Feedback = require('../../models/feedback');
const Account = require('../../models/account');

const moment = require('moment');
const { bucket } = require('../../firebase');

// Lấy thông tin người dùng hiện tại
exports.getCurrentUser = async (req, res) => {
    try {
        const userId = req.account.id; // Lấy ID người dùng từ middleware xác thực
        const currentUser = await Account.findById(userId).select('-password'); // Lấy thông tin người dùng và loại bỏ mật khẩu

        if (!currentUser) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        res.status(200).json(currentUser);
    } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng hiện tại:', error);
        res.status(500).json({ message: 'Lỗi khi lấy thông tin người dùng hiện tại' });
    }
};

// Hàm tải tệp lên Firebase Storage
const uploadFileToFirebase = (file) => {
    return new Promise((resolve, reject) => {
        const blob = bucket.file(file.originalname);
        const blobStream = blob.createWriteStream({
            metadata: {
                contentType: file.mimetype,
            },
        });

        blobStream.on('error', (error) => {
            reject(error);
        });

        blobStream.on('finish', async () => {
            try {
                await blob.makePublic();
                const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
                resolve(publicUrl);
            } catch (error) {
                reject(error);
            }
        });

        blobStream.end(file.buffer);
    });
};

// Thêm phản hồi sau khi đã thêm điều kiện ràng buộc
exports.addFeedback = async (req, res) => {
    try {
        const { content, rating } = req.body;
        const images = req.files?.image || [];
        const videos = req.files?.video || [];
        const imageUrls = await Promise.all(images?.map(uploadFileToFirebase));
        const videoUrls = await Promise.all(videos?.map(uploadFileToFirebase));

        const userId = req.account.id;
        const courseId = req.params.courseId;

        if (!courseId) {
            return res.status(400).json({ message: 'ID khóa học là bắt buộc' });
        }

        const subscription = await Subscription.findOne({ userId, courseId });

        if (!subscription) {
            return res.status(403).json({
                message: 'Bạn cần đăng ký khóa học để thêm phản hồi',
            });
        }

        if (!content) {
            return res.status(400).json({ message: 'Nội dung là bắt buộc' });
        }

        const feedback = new Feedback({
            userId,
            courseId,
            subscriptionId: subscription._id,
            content: content.trim(),
            rating: rating || null,
            imageUrls: imageUrls || [],
            videos: videoUrls || [],
        });

        const savedFeedback = await feedback.save();

        res.status(201).json({
            message: 'Phản hồi đã được thêm thành công',
            feedback: savedFeedback,
        });
    } catch (error) {
        console.error('Lỗi khi thêm phản hồi:', error.message, error.stack);
        res.status(500).json({ message: 'Lỗi khi thêm phản hồi' });
    }
};

// Đánh giá khóa học
exports.rateCourse = async (req, res) => {
    try {
        const { rating, fetchOnly } = req.body; // Chỉ cần rating và fetchOnly
        const userId = req.account.id;
        const courseId = req.params.courseId;

        if (!courseId) {
            return res.status(400).json({ message: 'ID khóa học là bắt buộc' });
        }

        const subscription = await Subscription.findOne({ userId, courseId });

        if (!subscription) {
            return res.status(403).json({
                message: 'Bạn cần đăng ký khóa học để đánh giá',
            });
        }

        if (subscription.subscriptionStatus !== 'finish') {
            return res.status(403).json({
                message: 'Bạn chỉ có thể đánh giá khóa học sau khi hoàn thành',
            });
        }

        // Trả về trạng thái subscription nếu fetchOnly được yêu cầu
        if (fetchOnly) {
            return res.status(200).json({ subscriptionStatus: subscription.subscriptionStatus });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Đánh giá phải từ 1 đến 5' });
        }

        const feedback = new Feedback({
            userId,
            courseId,
            subscriptionId: subscription._id,
            content: null, // Không có nội dung trong đánh giá sao
            rating,
        });

        const savedFeedback = await feedback.save();

        res.status(201).json({
            message: 'Đã đánh giá khóa học thành công',
            feedback: savedFeedback,
        });
    } catch (error) {
        console.error('Lỗi khi đánh giá khóa học:', error.message, error.stack);
        res.status(500).json({ message: 'Lỗi khi đánh giá khóa học' });
    }
};

// Lấy tất cả bình luận của một khóa học
exports.getFeedbacksByCourseId = async (req, res) => {
    try {
        const { courseId } = req.params;

        // Lấy danh sách bình luận gốc (không phải là bình luận trả lời)
        const feedbacks = await Feedback.find({ courseId, parentFeedbackId: null, isHidden: false })
            .populate('userId', 'name') // Lấy thông tin người dùng
            .sort({ createdAt: -1 });

        res.status(200).json(feedbacks);
    } catch (error) {
        console.error('Lỗi khi lấy phản hồi:', error);
        res.status(500).json({ message: 'Lỗi khi lấy phản hồi' });
    }
};

// Lấy thông tin đánh giá (tổng số lượt đánh giá và điểm trung bình) của một khóa học
exports.getCourseRatings = async (req, res) => {
    try {
        const { courseId } = req.params;

        // Lấy tất cả các bình luận của khóa học
        const feedbacks = await Feedback.find({ courseId, isHidden: false });

        // Tính tổng số sao và đánh giá trung bình
        const totalVotes = feedbacks.filter((f) => f.rating).length;
        const averageRating = feedbacks.filter((f) => f.rating).reduce((sum, f) => sum + f.rating, 0) / totalVotes || 0;

        res.status(200).json({ totalVotes, averageRating });
    } catch (error) {
        console.error('Lỗi khi lấy thông tin đánh giá:', error);
        res.status(500).json({ message: 'Lỗi khi lấy thông tin đánh giá' });
    }
};

// Cập nhật phản hồi
exports.updateFeedback = async (req, res) => {
    try {
        const { content, rating: ratingStr } = req.body;
        const { feedbackId } = req.params;
        const images = req.files?.image || [];
        const videos = req.files?.video || [];

        // Kiểm tra nội dung
        if (!content || content.trim() === '') {
            return res.status(400).json({ message: 'Nội dung là bắt buộc.' });
        }

        // Kiểm tra đánh giá nếu được cung cấp
        const rating = parseInt(ratingStr, 10);
        if (rating !== undefined && (isNaN(rating) || rating < 1 || rating > 5)) {
            return res.status(400).json({ message: 'Đánh giá phải là số từ 1 đến 5.' });
        }

        // Tải lên hình ảnh và video nếu có
        const imageUrls = images.length ? await Promise.all(images.map(uploadFileToFirebase)) : [];
        const videoUrls = videos.length ? await Promise.all(videos.map(uploadFileToFirebase)) : [];

        // Tìm và cập nhật phản hồi
        const updatedFeedback = await Feedback.findById(feedbackId);
        if (!updatedFeedback) {
            return res.status(404).json({ message: 'Không tìm thấy phản hồi.' });
        }

        updatedFeedback.content = content.trim();
        updatedFeedback.imageUrls = [...updatedFeedback.imageUrls, ...imageUrls]; // Thêm hình ảnh mới
        updatedFeedback.videos = [...updatedFeedback.videos, ...videoUrls]; // Thêm video mới

        // Cập nhật đánh giá nếu được cung cấp trong body
        if (rating !== undefined) {
            updatedFeedback.rating = rating;
        }

        // Lưu phản hồi đã cập nhật
        await updatedFeedback.save();

        res.status(200).json({
            message: 'Phản hồi đã được cập nhật thành công.',
            feedback: updatedFeedback,
        });
    } catch (error) {
        console.error('Lỗi khi cập nhật phản hồi:', error.message);
        res.status(500).json({ message: 'Lỗi khi cập nhật phản hồi.' });
    }
};

// Xóa phản hồi
exports.deleteFeedback = async (req, res) => {
    try {
        const feedbackId = req.params.feedbackId;

        const deletedFeedback = await Feedback.findByIdAndDelete(feedbackId);

        if (!deletedFeedback) {
            return res.status(404).json({ message: 'Không tìm thấy phản hồi' });
        }

        res.status(200).json({ message: 'Phản hồi đã được xóa thành công' });
    } catch (error) {
        console.error('Lỗi khi xóa phản hồi:', error);
        res.status(500).json({ message: 'Lỗi khi xóa phản hồi' });
    }
};
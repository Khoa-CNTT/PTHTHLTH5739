const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FeedbackSchema = new Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Account',
		},
		subscriptionId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Subscription',
		},
		courseId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Course',
		},
		content: {
			type: String,
			required: true, // Nội dung bình luận là bắt buộc
		},
		rating: {
			type: Number,
			min: 1,
			max: 5, // Tùy chọn đánh giá sao
			default: null,
		},
		parentFeedbackId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Feedback',
			default: null, // Nếu null => bình luận gốc
		},
		replies: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Feedback', // Lưu trữ các bình luận con
			},
		],
		imageUrls: { type: [String] },
		videos: { type: [String] },
	},
	{
		timestamps: true, // Tự động thêm createdAt và updatedAt
	}
);

const Feedback = mongoose.model('Feedback', FeedbackSchema);

module.exports = Feedback;

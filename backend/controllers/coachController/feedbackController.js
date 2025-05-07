const Feedback = require('../../models/feedback');

// Lấy danh sách tất cả phản hồi
exports.getAllFeedbacks = async (req, res) => {
  try {
      const feedbacks = await Feedback.find()
          .populate('userId', 'name') // Lấy thông tin tên người dùng
          .populate({
              path: 'courseId',
              select: 'name coachId', // Chọn chỉ trường 'name' và 'coachId' từ Course
              populate: {
                  path: 'coachId',
                  select: 'name _id' // Lấy tên và _id của coach
              }
          })
          .sort({ createdAt: -1 }); // Sắp xếp theo thời gian tạo mới nhất
      res.status(200).json(feedbacks);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

// Cập nhật trạng thái ẩn/hiện của phản hồi
exports.updateFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.feedbackId,
      { isHidden: req.body.isHidden, updatedAt: Date.now() },
      { new: true }
    );
    if (!feedback) {
      return res.status(404).json({ message: 'Không tìm thấy phản hồi' });
    }
    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

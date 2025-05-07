const Advice = require("../../models/advice");
const Subscription = require("../../models/subscription");

// Lấy danh sách workout preview dựa trên subscriptionId
const getWorkoutsPreviewBySubscriptionId = async (req, res) => {
  try {
    const { subscriptionId } = req.params;

    // Tìm subscription và populate thông tin workout, bao gồm progress và thông tin bài tập
    const subscription = await Subscription.findById(subscriptionId).populate({
      path: "workoutId",
      model: "Workout",
    });

    if (!subscription) {
      return res.status(404).json({ success: false, message: "Không tìm thấy đăng ký" });
    }

    console.log(subscription);

    res.status(200).json({ success: true, data: subscription.workoutId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy danh sách lời khuyên cho một workout preview cụ thể
const getAdviceForPreview = async (req, res) => {
  try {
    const { workoutId } = req.params;
    const adviceList = await Advice.find({ workoutId });
    res.status(200).json({ success: true, advice: adviceList });
  } catch (error) {
    console.error('Lỗi khi lấy lời khuyên:', error);
    res.status(500).json({ success: false, message: 'Không thể lấy lời khuyên' });
  }
};

// Thêm lời khuyên cho một workout preview cụ thể
const giveAdviceForPreview = async (req, res) => {
  try {
    const { workoutId } = req.params;
    const { timestamp, advice } = req.body;

    // Kiểm tra xem lời khuyên cho timestamp này đã tồn tại chưa
    const existingAdvice = await Advice.findOne({ workoutId, timestamp });
    if (existingAdvice) {
      return res.status(400).json({ message: 'Lời khuyên cho thời điểm này đã tồn tại.' });
    }

    // Tạo và lưu lời khuyên mới
    const newAdvice = new Advice({
      workoutId,
      timestamp,
      advice,
    });

    await newAdvice.save();
    return res.status(201).json({ message: 'Đã thêm lời khuyên thành công', advice: newAdvice });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Lỗi khi thêm lời khuyên' });
  }
};

// Cập nhật lời khuyên cho một workout preview cụ thể
const updateAdviceForPreview = async (req, res) => {
  try {
    const { workoutId } = req.params;
    const { timestamp, advice } = req.body;

    // Tìm lời khuyên hiện có
    const existingAdvice = await Advice.findOne({ workoutId, timestamp });
    if (!existingAdvice) {
      return res.status(404).json({ message: 'Không tìm thấy lời khuyên cho thời điểm này.' });
    }

    // Cập nhật lời khuyên
    existingAdvice.advice = advice;
    await existingAdvice.save();

    return res.status(200).json({ message: 'Đã cập nhật lời khuyên thành công', advice: existingAdvice });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Lỗi khi cập nhật lời khuyên' });
  }
}

// Xóa lời khuyên cho một workout preview cụ thể
const deleteAdviceForPreview = async (req, res) => {
  try {
    const { workoutId } = req.params;
    const { timestamp } = req.body;

    // Tìm và xóa lời khuyên theo workoutId và timestamp
    const adviceToDelete = await Advice.findOneAndDelete({ workoutId, timestamp });
    if (!adviceToDelete) {
      return res.status(404).json({ message: 'Không tìm thấy lời khuyên cho thời điểm này.' });
    }

    return res.status(200).json({ message: 'Đã xóa lời khuyên thành công', advice: adviceToDelete });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Lỗi khi xóa lời khuyên' });
  }
}

module.exports = {
  getWorkoutsPreviewBySubscriptionId,
  getAdviceForPreview,
  giveAdviceForPreview,
  updateAdviceForPreview,
  deleteAdviceForPreview
};
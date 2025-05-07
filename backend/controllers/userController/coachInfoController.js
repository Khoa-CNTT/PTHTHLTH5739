const Coach = require("../../models/coach");

// Lấy danh sách tất cả huấn luyện viên
const getCoachList = async (req, res) => {
    try {
        // Tìm tất cả huấn luyện viên và populate thông tin tài khoản
        const coaches = await Coach.find().populate('accountId');
        res.status(200).json(coaches);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Lấy thông tin chi tiết của một huấn luyện viên theo ID
const getCoachDetail = async (req, res) => {
    try {
        // Tìm huấn luyện viên theo ID và populate thông tin tài khoản
        const coach = await Coach.findById(req.params.id).populate("accountId");
        if (!coach) {
            return res.status(404).json({ message: "Không tìm thấy huấn luyện viên" });
        }
        res.status(200).json(coach);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getCoachList,
    getCoachDetail,
}
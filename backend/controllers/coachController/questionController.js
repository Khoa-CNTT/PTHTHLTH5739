// controllers/questionController.js
const Question = require('../../models/question');
const Option = require('../../models/option');
// Lấy tất cả câu hỏi
const getAllQuestions = async (req, res) => {
    const { idCoach} = req.query; 
    
    try {
        const filter = idCoach ? { idCoach } : {};
        const questions = await Question.find(filter).populate('optionId');
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi lấy danh sách câu hỏi",
            error: error.message,
        });
    }
};
// Thêm câu hỏi mới
const addQuestion = async (req, res) => {
    const newQuestion = new Question(req.body);
    try {
        const savedQuestion = await newQuestion.save();
        res.status(201).json(savedQuestion);
    } catch (error) {
        res.status(400).json({
            message: "Lỗi khi thêm câu hỏi",
            error: error.message,
        });
    }
};
// Cập nhật câu hỏi
const updateQuestion = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedQuestion = await Question.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedQuestion) {
            return res.status(404).json({ message: "Câu hỏi không tìm thấy" });
        }
        res.status(200).json(updatedQuestion);
    } catch (error) {
        res.status(400).json({
            message: "Lỗi khi cập nhật câu hỏi",
            error: error.message,
        });
    }
};
// Xoá câu hỏi
const deleteQuestion = async (req, res) => {
    try {
        const question = await Question.findByIdAndDelete(req.params.id);
        if (!question) {
            return res.status(404).json({ message: 'Không tìm thấy câu hỏi' });
        }
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi xoá câu hỏi",
            error: error.message,
        });
    }
};
// Thêm đáp án cho câu hỏi
const addOptionToQuestion = async (req, res) => {
    try {
        const { option, image } = req.body;
        const questionId = req.params.id;
        // Tạo mới một option
        const newOption = new Option({ option, image });
        await newOption.save();
        // Cập nhật câu hỏi để thêm optionId
        const question = await Question.findById(questionId);
        question.optionId.push(newOption._id);
        await question.save();
        res.status(201).json(newOption);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi thêm đáp án', error: error.message });
    }
};
// Cập nhật đáp án
const updateOption = async (req, res) => {
    try {
        const { option, image } = req.body;
        const optionId = req.params.optionId;
        const updatedOption = await Option.findByIdAndUpdate(optionId, { option, image }, { new: true });
        res.json(updatedOption);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật đáp án', error: error.message });
    }
};
// Xóa đáp án
const deleteOption = async (req, res) => {
    try {
        const optionId = req.params.optionId;
        await Option.findByIdAndDelete(optionId);
        res.json({ message: 'Đáp án đã bị xóa' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa đáp án', error: error.message });
    }
};
module.exports = {
    getAllQuestions,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    addOptionToQuestion,
    updateOption,
    deleteOption
};
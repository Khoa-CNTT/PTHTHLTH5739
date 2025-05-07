const Workout = require('../../models/workout');
const Progress = require('../../models/progress');
const Exercise = require('../../models/exercise');
const Advice = require('../../models/advice');

// Lấy thông tin chi tiết của Workout bao gồm Progress và Exercise
exports.getWorkoutDetails = async (req, res) => {
    try {
        const { workoutId } = req.params;
        // console.log("workoutId", workoutId);

        // Tìm workout theo ID và populate thông tin progress và exercise liên quan
        const workout = await Workout.findById(workoutId).populate({
            path: 'progressId',
            populate: {
                path: 'exerciseId',
                model: 'Exercise',
            },
        });

        if (!workout) {
            return res.status(404).json({ message: 'Không tìm thấy Workout' });
        }

        res.status(200).json(workout);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ', error });
    }
};

// Cập nhật tỷ lệ hoàn thành của một Progress
exports.updateProgressCompletion = async (req, res) => {
    try {
        const { completionRate } = req.body;
        const progressId = req.params.progressId;
        console.log(">>> completionRate: ", completionRate);
        console.log(">>> progressId: ", progressId);

        const progress = await Progress.findById(progressId);

        if (!progress) {
            return res.status(404).json({ message: 'Không tìm thấy Progress' });
        }

        // Chỉ cập nhật nếu completionRate chưa phải 'true' (đã hoàn thành)
        if (progress.completionRate !== 'true') {
            progress.completionRate = completionRate || 'true';
            await progress.save();
        }
        console.log('Đã cập nhật Progress thành công');

        res.status(200).json({ message: 'Đã cập nhật Progress thành công', progress });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật Progress', error });
    }
};

// Cập nhật trạng thái hoàn thành và video link của Workout
exports.updateFinishWorkout = async (req, res) => {
    try {
        const { status, videoLink } = req.body;
        const workoutId = req.params.workoutId;

        console.log(">>> Status: ", status);
        console.log(">>> Workout ID: ", workoutId);
        console.log(">>> Video Links: ", videoLink);

        const workout = await Workout.findById(workoutId);

        if (!workout) {
            return res.status(404).json({ message: 'Không tìm thấy Workout' });
        }

        // Cập nhật trạng thái nếu có
        if (status) {
            workout.status = status;
        }

        // Cập nhật video link nếu có
        if (videoLink) {
            if (!workout.preview) {
                workout.preview = {};
            }
            workout.preview.video = videoLink;
        }

        await workout.save();

        res.status(200).json({
            message: 'Đã cập nhật trạng thái và video link của Workout thành công',
            workout,
        });
    } catch (error) {
        console.error("Lỗi khi cập nhật Workout: ", error);
        res.status(500).json({
            message: 'Lỗi khi cập nhật trạng thái Workout',
            error,
        });
    }
};

// Lấy danh sách lời khuyên cho một Workout cụ thể
exports.getAdviceForWorkout = async (req, res) => {
    try {
        const { workoutId } = req.params;
        const adviceList = await Advice.find({ workoutId });
        res.status(200).json({ success: true, advice: adviceList });
    } catch (error) {
        console.error('Lỗi khi lấy lời khuyên:', error);
        res.status(500).json({ success: false, message: 'Lỗi khi lấy lời khuyên' });
    }
};
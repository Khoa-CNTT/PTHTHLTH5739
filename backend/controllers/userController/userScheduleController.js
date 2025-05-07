const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const Subscription = require('../../models/subscription');
const Schedule = require('../../models/schedule');
const Workout = require('../../models/workout');

// Lấy tất cả các đăng ký
const getAllSubscriptions = async (req, res) => {
    try {
        // Tìm tất cả các đăng ký và populate thông tin người dùng và khóa học
        const subscriptions = await Subscription.find()
            .populate('userId', 'name email')
            .populate('courseId', 'name description');

        // Nếu không tìm thấy đăng ký nào
        if (!subscriptions || subscriptions.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy đăng ký nào' });
        }

        res.status(200).json({
            message: 'Lấy danh sách đăng ký thành công',
            data: subscriptions
        });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách đăng ký:', error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
    }
};

// Lấy một đăng ký theo ID
const getSubscription = async (req, res) => {
    try {
        const { subscriptionId } = req.params;

        // Tìm đăng ký theo ID và populate thông tin người dùng và khóa học
        const subscription = await Subscription.findById(subscriptionId)
            .populate('userId', 'name email')
            .populate('courseId', 'name description');

        // Nếu không tìm thấy đăng ký
        if (!subscription) {
            return res.status(404).json({ message: 'Không tìm thấy đăng ký' });
        }

        res.status(200).json({
            message: 'Đã tìm thấy đăng ký',
            data: subscription
        });
    } catch (error) {
        console.error('Lỗi khi lấy thông tin đăng ký:', error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
    }
};

// Tạo danh sách ngày giữa hai thời điểm
const generateDatesBetween = (startDate, endDate) => {
    const dates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1); // Chuyển sang ngày tiếp theo
    }

    return dates;
};

// Tạo lịch tập luyện theo đăng ký
const generateSchedule = async (req, res) => {
    try {
        const { subscriptionId } = req.params;

        // Tìm đăng ký theo ID
        const subscription = await Subscription.findById(subscriptionId);

        // Nếu không tìm thấy đăng ký
        if (!subscription) {
            return res.status(404).json({ message: 'Không tìm thấy đăng ký' });
        }

        const { startDate, endDate, startTime, endTime } = subscription;

        // Tạo danh sách các ngày tập luyện
        const dates = generateDatesBetween(new Date(startDate), new Date(endDate));

        // Tạo mảng các lịch tập luyện dựa trên danh sách ngày
        const schedules = dates.map(date => ({
            date: date.toISOString().split('T')[0], // Chỉ lấy phần ngày
            startTime: {
                hours: startTime.hours,
                minutes: startTime.minutes
            },
            endTime: {
                hours: endTime.hours,
                minutes: endTime.minutes
            },
            subscriptionId: subscription._id,
            workoutId: [], // Ban đầu chưa có workout
            progressId: null // Ban đầu chưa có progress
        }));

        // Lưu danh sách lịch tập luyện vào database
        const savedSchedules = await Schedule.insertMany(schedules);

        res.status(201).json({
            message: 'Đã tạo và lưu lịch tập luyện thành công',
            data: savedSchedules
        });
    } catch (error) {
        console.error('Lỗi khi tạo lịch tập luyện:', error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
    }
};

// Lấy lịch tập luyện của người dùng theo ID đăng ký
const getSchedulesUser = async (req, res) => {
    try {
        const { subscriptionId } = req.params;

        // Tìm lịch tập luyện theo ID đăng ký và populate thông tin workout
        const schedules = await Schedule.find({ subscriptionId: subscriptionId })
            .populate('workoutId', 'name description')
        // .populate('progressId');

        // Nếu không tìm thấy lịch tập luyện nào cho đăng ký này
        if (!schedules || schedules.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy lịch tập luyện cho đăng ký này' });
        }

        res.status(200).json({
            message: 'Lấy lịch tập luyện thành công',
            data: schedules
        });
    } catch (error) {
        console.error('Lỗi khi lấy lịch tập luyện:', error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
    }
};

module.exports = {
    getAllSubscriptions,
    getSubscription,
    generateSchedule,
    getSchedulesUser
};
const Account = require("../../models/account");
const Coach = require("../../models/coach");
const bcrypt = require("bcryptjs");

// Controller lấy thông tin cá nhân của huấn luyện viên
const getCoachProfile = async (req, res) => {
    try {
        const user = await Account.findById(req.account.id).where({ role: 'coach' });
        if (!user) {
            return res.status(400).json({ msg: 'Không tìm thấy người dùng hoặc không phải là huấn luyện viên' });
        }

        const coachProfile = await Coach.findOne({ accountId: user._id })
            .populate('accountId', 'name email phone address gender dob avatar');

        if (!coachProfile) {
            return res.status(400).json({ msg: 'Không tìm thấy hồ sơ huấn luyện viên' });
        }

        const profile = {
            ...user.toObject(),
            avatar: user.avatar, // Đảm bảo trả về avatar
            coachInfo: {
                ...coachProfile.toObject(),
            },
        };

        res.status(200).json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi máy chủ');
    }
};

// Controller chỉnh sửa thông tin cá nhân của huấn luyện viên
const editCoachProfile = async (req, res) => {
    const {
        name, email, gender, dob, phone, address,
        experience, introduce, selfImage, contract, certificate, avatar,
    } = req.body;

    try {
        const user = await Account.findById(req.account.id);
        if (!user) {
            return res.status(400).json({ msg: 'Không tìm thấy người dùng' });
        }

        // Cập nhật thông tin cơ bản
        if (name) user.name = name;
        if (gender) user.gender = gender;
        if (address) user.address = address;
        if (phone) user.phone = phone;
        if (dob) user.dob = dob;
        if (avatar) user.avatar = avatar; // Cập nhật avatar
        await user.save();

        // Tìm và cập nhật hồ sơ huấn luyện viên
        const coachProfile = await Coach.findOne({ accountId: req.account.id });
        if (!coachProfile) {
            return res.status(400).json({ msg: 'Không tìm thấy hồ sơ huấn luyện viên' });
        }

        // Cập nhật các trường mới
        if (experience) coachProfile.experience = experience;
        if (introduce) coachProfile.introduce = introduce;
        if (selfImage && Array.isArray(selfImage)) coachProfile.selfImage = selfImage;
        if (contract) coachProfile.contract = contract;
        if (certificate && Array.isArray(certificate)) coachProfile.certificate = certificate;

        await coachProfile.save();

        res.status(200).json({ msg: 'Hồ sơ được cập nhật thành công' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi máy chủ');
    }
};

module.exports = {
    getCoachProfile,
    editCoachProfile
};
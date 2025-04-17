const Account = require("../../models/account");
const bcrypt = require("bcryptjs");

const Survey = require("../../models/survey")

// Controller lấy thông tin cá nhân của người dùng
const getUserProfile = async (req, res) => {
    // console.log(">>> req.account.id >>> ", req.account.id);

    try {
        const user = await Account.findById(req.account.id);
        // console.log('>>> user: ', user);

        if (!user) {
            return res.status(400).json({ msg: "Không tìm thấy người dùng" });
        }

        res.status(200).json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Lỗi máy chủ");
    }
};

// Controller chỉnh sửa thông tin cá nhân
const editUserProfile = async (req, res) => {
    const { name, email, gender, dob, phone, address } = req.body;
    // console.log(">>> req.account.id >>> ", req.account.id);

    console.log(
        ">>> name:",
        name,
        " - ",
        ">>> email:",
        email,
        " - ",
        ">>> gender:",
        gender,
        " - ",
        ">>> dob:",
        dob,
        " - ",
        ">>> phone:",
        phone,
        " - ",
        ">>> address:",
        address
    );

    try {
        // Tìm người dùng theo userId (bạn nên xác thực userId trước khi sử dụng)
        const user = await Account.findById(req.account.id);
        // console.log('>>> User Edit Profile: ', user);

        if (!user) {
            console.log("Không tìm thấy người dùng");
            return res.status(400).json({ msg: "Không tìm thấy người dùng" });
        }

        // Cập nhật thông tin người dùng
        user.name = name;
        user.gender = gender;
        user.address = address;
        user.phone = phone;
        user.dob = dob;

        await user.save();
        console.log("Hồ sơ đã được cập nhật thành công");

        res.status(200).json({ msg: "Hồ sơ đã được cập nhật thành công" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Lỗi máy chủ");
    }
};

// Controller đổi mật khẩu
const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    console.log(
        ">>> currentPassword, newPassword: ",
        currentPassword,
        newPassword
    );

    try {
        const account = await Account.findById(req.account.id);
        console.log(account);


        if (!account) {
            return res.status(400).json({ msg: "Không tìm thấy tài khoản" });
        }

        const salt = await bcrypt.genSalt(10);

        // Nếu đăng nhập bằng Google
        if (account.password === "") {
            account.password = await bcrypt.hash(newPassword, salt);
            await account.save();
            return res.status(200).json({ msg: "Mật khẩu đã được tạo thành công" });
        }

        // Kiểm tra mật khẩu hiện tại
        const isMatch = await bcrypt.compare(currentPassword, account.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Mật khẩu hiện tại không đúng" });
        }

        // Cập nhật mật khẩu mới
        account.password = await bcrypt.hash(newPassword, salt);
        await account.save();
        return res.status(200).json({ msg: "Mật khẩu đã được cập nhật thành công" });
    } catch (err) {
        console.error(err.message);
        return res.status(500).send("Lỗi máy chủ");
    }
};

const createSurvey = async (req, res) => {
    const { height, weight, goal, surveyOptions } = req.body;
    const userId = '66fffdca2cc2eff8300299e0'
    console.log(height, weight, goal, surveyOptions, userId)
    try {
        // Tạo một đối tượng Survey mới
        const newSurvey = new Survey({
            userId,
            height,
            weight,
            goal,
            surveyOptions,
        });

        // Lưu khảo sát vào cơ sở dữ liệu
        const savedSurvey = await newSurvey.save();
        console.log('Khảo sát đã được tạo thành công')
        return res.status(201).json({
            message: 'Khảo sát đã được tạo thành công',
            survey: savedSurvey,
        });
    } catch (error) {
        console.error("Lỗi khi lưu khảo sát: ", error.message);
        res.status(500).send({ error: error.message });
    }
};

module.exports = {
    getUserProfile,
    editUserProfile,
    changePassword,
    createSurvey
};
const Account = require("../../models/account");
const bcrypt = require('bcrypt');


// Lấy tất cả tài khoản người dùng
exports.getAllAccounts = async (req, res) => {
    try {
        // Lấy tất cả tài khoản có vai trò là "user"
        const accounts = await Account.find({ role: "user" });

        // Đếm tổng số người dùng
        const totalUsers = await Account.countDocuments({ role: "user" });

        // Lấy ngày hiện tại và đặt thời gian về đầu ngày
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        // Đếm số người dùng được tạo trong ngày hôm nay
        const usersCreatedToday = await Account.countDocuments({
            role: "user",
            createdAt: { $gte: startOfDay },
        });
        // Đếm số người dùng đang bị khóa
        const blockedUsers = await Account.countDocuments({
            role: "user",
            status: "blocked",
        });
        // Đếm số người dùng đang hoạt động
        const activateUsers = await Account.countDocuments({
            role: "user",
            status: "activate",
        });
        // Đếm số người dùng chưa kích hoạt
        const nonActivateUsers = await Account.countDocuments({
            role: "user",
            status: "non-activate",
        });


        // Trả về danh sách tài khoản và các thống kê liên quan
        res.json({ accounts, totalUsers, usersCreatedToday, activateUsers, blockedUsers, nonActivateUsers });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Lỗi máy chủ");
    }
};


// Tạo mới tài khoản người dùng
exports.createAccount = async (req, res) => {
    const { email, password, name, role, status, gender, dob, phone, address, avatar } = req.body;

    try {
        // Kiểm tra xem tài khoản với email đã cho có tồn tại hay không
        let account = await Account.findOne({ email });

        if (account) {
            return res.status(400).json({ msg: "Tài khoản đã tồn tại" });
        }

        // Tạo một đối tượng Account mới
        account = new Account({
            email,
            password,
            name,
            role,
            status,
            gender,
            dob,
            phone,
            address,
            avatar,
        });

        // Mã hóa mật khẩu trước khi lưu vào database
        const salt = await bcrypt.genSalt(10);
        account.password = await bcrypt.hash(password, salt);

        // Lưu tài khoản mới vào database
        await account.save();

        res.json({ msg: "Tài khoản đã được tạo thành công", account });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Lỗi máy chủ");
    }
};

// Cập nhật thông tin tài khoản người dùng
exports.updateAccount = async (req, res) => {
    const { status, gender, dob, phone, address, avatar } = req.body;
    const { accountId } = req.params;

    try {
        // Tìm tài khoản theo ID
        let account = await Account.findById(accountId);

        if (!account) {
            return res.status(404).json({ msg: "Không tìm thấy tài khoản" });
        }

        // Cập nhật các trường nếu có sự thay đổi trong request body
        if (status) account.status = status;
        if (gender) account.gender = gender;
        if (dob) account.dob = dob;
        if (phone) account.phone = phone;
        if (address) account.address = address;
        if (avatar) account.avatar = avatar;

        // Lưu các thay đổi vào database
        await account.save();
        res.json({ msg: "Tài khoản đã được cập nhật thành công", account });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Lỗi máy chủ");
    }
};



// Cập nhật vai trò của người dùng
exports.UpdateRole = async (req, res) => {
    try {
        // Tìm và cập nhật tài khoản theo ID với dữ liệu từ request body
        const account = await Account.findByIdAndUpdate(req.params.id, req.body, { new: true });
        console.log(" req.params.id: ", req.params.id);

        res.status(200).json({ msg: 'Vai trò người dùng đã được cập nhật thành công', account });
    } catch (err) {
        res.status(500).json({ msg: 'Không cập nhật được vai trò người dùng' });
    }
};

// Chặn hoặc bỏ chặn tài khoản người dùng
exports.blockUnblockAccount = async (req, res) => {
    const { accountId } = req.params;
    const { status } = req.body; // 'activate' hoặc 'blocked'

    try {
        // Tìm tài khoản theo ID
        let account = await Account.findById(accountId);

        if (!account) {
            return res.status(404).json({ msg: "Không tìm thấy tài khoản" });
        }

        // Cập nhật trạng thái của tài khoản
        account.status = status;

        // Lưu các thay đổi vào database
        await account.save();
        res.json({
            msg: `Tài khoản ${status === 'blocked' ? 'đã bị chặn' : 'đã được bỏ chặn'} thành công`,
            account,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Lỗi máy chủ");
    }
};
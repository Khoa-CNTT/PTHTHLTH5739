const Account = require("../../models/account");
const bcrypt = require('bcrypt');


// Lấy tất cả tài khoản người dùng
exports.getAllAccounts = async (req, res) => {
    try {
        // Lấy tất cả tài khoản người dùng
        const accounts = await Account.find({ role: "user" });

        // Đếm tổng số người dùng
        const totalUsers = await Account.countDocuments({ role: "user" });

        // Lấy ngày hôm nay
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        // Đếm số người dùng đã tạo hôm nay
        const usersCreatedToday = await Account.countDocuments({
            role: "user",
            createdAt: { $gte: startOfDay },
        });
        const blockedUsers = await Account.countDocuments({
            role: "user",
            status: "blocked",
        });
        const activateUsers = await Account.countDocuments({
            role: "user",
            status: "activate",
        });
        const nonActivateUsers = await Account.countDocuments({
            role: "user",
            status: "non-activate",
        });


        // Trả lại cả tài khoản và tổng số
        res.json({ accounts, totalUsers, usersCreatedToday, activateUsers, blockedUsers, nonActivateUsers });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Lỗi máy chủ");
    }
};


// Tạo mới tài khoản
exports.createAccount = async (req, res) => {
    const { email, password, name, role, status, gender, dob, phone, address, avatar } = req.body;

    try {
        let account = await Account.findOne({ email });

        if (account) {
            return res.status(400).json({ msg: "Tài khoản đã tồn tại" });
        }

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

        const salt = await bcrypt.genSalt(10);
        account.password = await bcrypt.hash(password, salt);

        await account.save();

        res.json({ msg: "Tài khoản đã được tạo thành công", account });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Lỗi máy chủ");
    }
};

// Cập nhật tài khoản
exports.updateAccount = async (req, res) => {
    const { status, gender, dob, phone, address, avatar } = req.body;
    const { accountId } = req.params;

    try {
        let account = await Account.findById(accountId);

        if (!account) {
            return res.status(404).json({ msg: "Không tìm thấy tài khoản" });
        }

        // Cập nhật nếu có sự thay đổi
        if (status) account.status = status;
        if (gender) account.gender = gender;
        if (dob) account.dob = dob;
        if (phone) account.phone = phone;
        if (address) account.address = address;
        if (avatar) account.avatar = avatar;

        await account.save();
        res.json({ msg: "Tài khoản đã được cập nhật thành công", account });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Lỗi máy chủ");
    }
};



// Cập nhật vai trò người dùng thành hlv
exports.UpdateRole = async (req, res) => {
    try {
        const account = await Account.findByIdAndUpdate(req.params.id, req.body, { new: true });
        console.log(" req.params.id: ", req.params.id);

        res.status(200).json({ msg: 'Vai trò người dùng đã được cập nhật thành công', account });
    } catch (err) {
        res.status(500).json({ msg: 'Không cập nhật được vai trò người dùng' });
    }
};

// Chặn/Bỏ chặn tài khoản
exports.blockUnblockAccount = async (req, res) => {
    const { accountId } = req.params;
    const { status } = req.body; // 'activate' hoặc 'blocked'

    try {
        let account = await Account.findById(accountId);

        if (!account) {
            return res.status(404).json({ msg: "Không tìm thấy tài khoản" });
        }

        account.status = status;

        await account.save();
        res.json({
            msg: `Tài khoản đã được ${status === 'blocked' ? 'chặn' : 'bỏ chặn'} thành công`,
            account,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Lỗi máy chủ");
    }
};
const Account = require('../../models/account');
const Coach = require('../../models/coach');
const Course = require('../../models/course');


// tạo mới hlv
exports.createCoach = async (req, res) => {
    const { accountId, introduce, selfImage, contract, certificate, experience } = req.body;
    try {
        // Kiểm tra nếu accountId đã tồn tại
        const existingAccount = await Account.findById(accountId);
        if (!existingAccount) {
            return res.status(404).json({ msg: 'Không tìm thấy tài khoản' });
        }

        // Kiểm tra nếu accountId đã tồn tại trong bảng Coach
        const existingCoach = await Coach.findOne({ accountId });
        if (existingCoach) {
            return res.status(201).json({ msg: 'Hlv đã tông tại cho accountId này' });
        }

        // Tạo coach mới
        const newCoach = new Coach({ accountId, introduce, selfImage, contract, certificate, experience });
        await newCoach.save();
        res.status(201).json({ msg: 'Tạo mới HLV thành công', coach: newCoach });
    } catch (err) {
        res.status(500).json({ msg: 'Tạo mới HLV thất bại', error: err.message });
    }
};


// Lấy tất cả hlv
exports.getAllCoaches = async (req, res) => {
    try {
        // Lấy tất cả các tài khoản có role là 'coach'
        const accounts = await Account.find({ role: 'coach' });

        if (!accounts.length) {
            return res.status(404).json({ msg: 'Không tìm tháy HLV' });
        }

        // Lấy tất cả các coach từ database dựa trên accountId
        const coaches = await Coach.find({ accountId: { $in: accounts.map(account => account._id) } })
            .populate('accountId', 'email gender address role dob phone name avatar status ');

        // Tạo mảng hợp nhất các thông tin từ Account và Coach
        const mergedCoaches = coaches.map(coach => {
            return {
                _id: coach._id,
                accountId: coach.accountId._id,
                email: coach.accountId.email,
                name: coach.accountId.name,
                avatar: coach.accountId.avatar,
                status: coach.accountId.status,
                gender: coach.accountId.gender,
                dob: coach.accountId.dob,
                address: coach.accountId.address,
                phone: coach.accountId.phone,
                introduce: coach.introduce,
                selfImage: coach.selfImage,
                contract: coach.contract,
                certificate: coach.certificate,
                experience: coach.experience,
                createdAt: coach.createdAt,
                updatedAt: coach.updatedAt,
            };
        });

        const totalCoaches = accounts.length;

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const todayCoachesCount = await Coach.countDocuments({
            createdAt: { $gte: startOfDay, $lte: endOfDay },
        });

        const blockedCoaches = await Account.countDocuments({
            role: "coach",
            status: "blocked",
        });
        const activateCoaches = await Account.countDocuments({
            role: "coach",
            status: "activate",
        });
        const nonActivateCoaches = await Account.countDocuments({
            role: "coach",
            status: "non-activate",
        });

        res.status(200).json({ msg: 'Hlv đã được lấy lại thành công', coaches: mergedCoaches, totalCoaches, todayCoachesCount, blockedCoaches, activateCoaches, nonActivateCoaches });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Không thể lấy lại hlv', error: err.message });
    }
};



// lấy thông tin chi tiết về huấn luyện viên theo ID tài khoản
exports.getCoachById = async (req, res) => {
    try {
        // Lấy coach từ DB và populate thông tin account
        const coach = await Coach.findById(req.params.id)
            .populate('accountId', 'email name avatar gender dob phone address') // Lấy các trường từ Account
            .exec();

        if (!coach) {
            return res.status(404).json({ message: 'Không tìm thấy hlv' });
        }

        return res.status(200).json(coach);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Lỗi khi lấy thông tin chi tiết về hlv' });
    }
};


// Edit coach information 
exports.editCoach = async (req, res) => {
    const { accountId, name, avatar, gender, dob, phone, address, introduce, selfImage, contract, certificate, experience } = req.body;

    try {
        // Cập nhật thông tin tài khoản (Account) - không thay đổi email, chỉ có thể chỉnh sửa name, avatar, phone, gender, dob, address
        const updatedAccount = await Account.findByIdAndUpdate(accountId, {
            name,
            avatar,
            gender,
            dob,
            phone,
            address
        }, { new: true });

        if (!updatedAccount) {
            return res.status(404).json({ msg: 'Không tìm thấy tài khoản' });
        }

        // Cập nhật thông tin huấn luyện viên (Coach) - bao gồm giới thiệu, ảnh selfImage, hợp đồng (contract), chứng chỉ (certificate), và kinh nghiệm (experience)
        const updatedCoach = await Coach.findOneAndUpdate({ accountId }, {
            introduce,
            selfImage,  // Cập nhật selfImage (URL ảnh)
            contract,   // Cập nhật contract (URL hợp đồng)
            certificate, // Cập nhật certificate (URL chứng chỉ)
            experience  // Cập nhật kinh nghiệm
        }, { new: true });

        if (!updatedCoach) {
            return res.status(404).json({ msg: 'Không tìm thấy hlv' });
        }

        // Trả về thông tin đã cập nhật
        res.status(200).json({ msg: 'Cập nhập hlv thành công', account: updatedAccount, coach: updatedCoach });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Cập nhập hlv thất bại' });
    }
};



exports.blockUnblockCoach = async (req, res) => {
    const { coachId } = req.body;

    try {
        console.log('Received ID:', coachId);

        // Tìm kiếm tài khoản dựa trên coachId
        const account = await Account.findById(coachId);
        if (!account) {
            console.error('Không tìm thấy tài khoản cho ID:', coachId);
            return res.status(404).json({ msg: 'Không tìm thấy tài khoản' });
        }

        // Toggle status (block/unblock)
        const previousStatus = account.status;
        account.status = account.status === 'activate' ? 'blocked' : 'activate';

        // Nếu tài khoản bị block, tìm và cập nhật tất cả các khóa học có coachId trùng với accountId
        if (account.status === 'blocked' && previousStatus === 'activate') {
            const courses = await Course.find({ coachId: coachId });

            // Cập nhật trạng thái của tất cả các khóa học có coachId trùng với coachId
            for (let course of courses) {
                course.status = 'rejected'; // Set status = deny
                await course.save(); // Lưu lại khóa học
            }
            console.log(`${courses.length}khóa học cập nhật là 'rejected'`);
        }

        // Lưu thay đổi tài khoản (block/unblock)
        await account.save();
        console.log('Trạng thái tài khoản sau cập nhập', account.status);

        res.status(200).json({ msg: 'Trạng thái huấn luyện viên đã được cập nhật thành công', status: account.status });
    } catch (err) {
        console.error('Lỗi khi cập nhật trạng thái huấn luyện viên:', err);
        res.status(500).json({ msg: 'Không thể block hlv đang có khóa học được sử dụng' });
    }
};

// exports.changeRoleToUser = async (req, res) => {
//     const { coachId } = req.body;

//     try {
//         console.log('ID đã nhận:', coachId);

//         const account = await Account.findById(coachId);
//         if (!account) {
//             console.error('Không tìm thấy tài khoản với ID:', coachId);
//             return res.status(404).json({ msg: 'Không tìm thấy tài khoản' });
//         }

//         if (account.role !== 'user') {
//             account.role = 'user';
//             await account.save();
//         }

//         const courses = await Course.find({ coachId: coachId });

//         if (courses.length > 0) {
//             for (let course of courses) {
//                 course.status = 'rejected';
//                 await course.save();
//             }
//             console.log(`${courses.length} khóa học cập nhật là 'rejected'`);
//         } else {
//             console.log('Không tìm thấy khóa học nào cho huấn luyện viên này.');
//         }

//         // Trả về phản hồi thành công
//         res.status(200).json({ msg: 'Vai trò hlv đã được cập nhật thành công', role: account.role });
//     } catch (err) {
//         console.error('Lỗi khi cập nhật vai trò hlv:', err);
//         res.status(500).json({ msg: 'Không cập nhật được vai trò hlv' });
//     }
// };
exports.changeRoleToUser = async (req, res) => {
    const { coachId } = req.body;

    try {
        console.log('ID đã nhận:', coachId);

        const account = await Account.findById(coachId);
        if (!account) {
            console.error('Không tìm thấy tài khoản với ID:', coachId);
            return res.status(404).json({ msg: 'Không tìm thấy tài khoản' });
        }

        if (account.role === 'coach') {
            account.role = 'user';
            await account.save();

            // Xóa huấn luyện viên khỏi bảng Coach
            const deletedCoach = await Coach.findOneAndDelete({ accountId: coachId });
            if (deletedCoach) {
                console.log(`Huấn luyện viên với ID tài khoản ${coachId} đã bị xóa khỏi bảng Coach.`);
            } else {
                console.log(`Không tìm thấy huấn luyện viên trong bảng Coach với ID tài khoản ${coachId}.`);
            }

            const courses = await Course.find({ coachId: coachId });

            if (courses.length > 0) {
                for (let course of courses) {
                    course.status = 'rejected';
                    await course.save();
                }
                console.log(`${courses.length} khóa học cập nhật là 'rejected'`);
            } else {
                console.log('Không tìm thấy khóa học nào cho huấn luyện viên này.');
            }

            // Trả về phản hồi thành công
            res.status(200).json({ msg: 'Vai trò hlv đã được cập nhật thành công và đã xóa khỏi bảng Coach', role: account.role });
        } else if (account.role === 'user') {
            res.status(200).json({ msg: 'Tài khoản này đã là người dùng', role: account.role });
        } else {
            res.status(400).json({ msg: 'Vai trò không hợp lệ để chuyển đổi thành người dùng', role: account.role });
        }

    } catch (err) {
        console.error('Lỗi khi cập nhật vai trò hlv:', err);
        res.status(500).json({ msg: 'Không cập nhật được vai trò hlv' });
    }
};

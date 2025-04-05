const Account = require("../../models/account");
const bcrypt = require("bcryptjs");

const Survey = require("../../models/survey")

// Get profile user Controller
const getUserProfile = async (req, res) => {
  // console.log(">>> req.account.id >>> ", req.account.id);

  try {
    const user = await Account.findById(req.account.id);
    // console.log('>>> user: ', user);

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Edit profile
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

  // Validation
  // if (!name || !email || !gender) {
  //     console.log("Please provide all required fields: name, email, and gender");
  //     return res.status(400).json({ msg: 'Please provide all required fields: name, email, and gender' });
  // }

  try {
    // Find the user by userId (you should validate the userId before using it)
    const user = await Account.findById(req.account.id);
    // console.log('>>> User Edit Profile: ', user);

    if (!user) {
      console.log("User not found");
      return res.status(400).json({ msg: "User not found" });
    }

    // Update the user profile
    user.name = name;
    user.gender = gender;
    user.address = address;
    user.phone = phone;
    user.dob = dob;

    await user.save();
    console.log("Profile updated successfully");

    res.status(200).json({ msg: "Profile updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Change password
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
      return res.status(400).json({ msg: "Account not found" });
    }

    const salt = await bcrypt.genSalt(10);

    // Nếu login google
    if (account.password === "") {
      account.password = await bcrypt.hash(newPassword, salt);
      await account.save();
      return res.status(200).json({ msg: "Password created successfully" });
    }

    // Kiểm tra mật khẩu hiện tại
    const isMatch = await bcrypt.compare(currentPassword, account.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Incorrect current password" });
    }

    // Cập nhật mật khẩu mới
    account.password = await bcrypt.hash(newPassword, salt);
    await account.save();
    return res.status(200).json({ msg: "Password updated successfully" });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server error");
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

    // Lưu survey vào cơ sở dữ liệu
    const savedSurvey = await newSurvey.save();
    console.log('Survey created successfully')
    return res.status(201).json({
      message: 'Survey created successfully',
      survey: savedSurvey,
    });
  } catch (error) {
    console.error("Error saving survey: ", error.message);
    res.status(500).send({ error: error.message });
  }
};

module.exports = {
  getUserProfile,
  editUserProfile,
  changePassword,
  createSurvey
};

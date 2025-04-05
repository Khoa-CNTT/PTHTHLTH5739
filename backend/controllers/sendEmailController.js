const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/sendEmail");

const sendEmailFunc = async (req, res) => {
  console.log("Request Body:", req.body);
  const { email, subject, text } = req.body;
  console.log(">>> email: ", email);

  const to = email;
  // const subject = 'Welcome to our website'
  // const text = 'This is a plain text message'

  if (!to || !subject || !text) {
    console.log("Please provide email, subject, and content");
    return res
      .status(400)
      .json({ error: "Please provide email, subject, and content" });
  }

  try {
    await sendEmail(to, subject, text);
    return res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Error sending email" });
  }
};

module.exports = { sendEmailFunc };

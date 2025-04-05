const express = require("express");
const router = express.Router();
const { sendEmailFunc } = require("../controllers/sendEmailController");

router.post("/send", sendEmailFunc);

module.exports = router;

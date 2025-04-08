const multer = require('multer');

// Sử dụng bộ nhớ tạm trong RAM thay vì lưu file trên ổ đĩa
const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = upload;


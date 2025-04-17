const jwt = require('jsonwebtoken');
const Account = require('../models/account');

const authMiddleware = (roles = []) => {
  return async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    //Kiểm tra xem token có tồn tại hay không.
    if (!token) {
      return res.status(401).json({ msg: 'Authorization token bị thiếu' });
    }

    try {
      //Xác minh tính hợp lệ của token bằng jwt.verify và secret key.
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      //Tìm kiếm account tương ứng với ID trong token từ database.
      const account = await Account.findById(decoded.id);

      //Kiểm tra xem account có tồn tại hay không.
      if (!account) {
        return res.status(401).json({ msg: 'Không tìm thấy tài khoản' });
      }

      // Kiểm tra xem vai trò của account có nằm trong các roles cho phép ko
      if (roles.length && !roles.includes(account.role)) {
        return res.status(403).json({ msg: 'Truy cập bị từ chối: không đủ quyền' });
      }

      //Nếu tất cả các bước trên thành công, gán thông tin account vào req.account và gọi next() để chuyển quyền điều khiển.
      req.account = account;
      next();
    } catch (err) {
      console.error(err);
      return res.status(401).json({ msg: 'Token không hợp lệ' });
    }
  };
};

module.exports = authMiddleware;
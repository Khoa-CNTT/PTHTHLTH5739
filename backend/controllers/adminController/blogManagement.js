const express = require("express");
const bodyParser = require("body-parser");

const Blog = require("../../models/blog");

const adminRouter = express.Router();
adminRouter.use(bodyParser.json());

// Các hoạt động CRUD cho Blog

// Lấy một blog theo ID (cho người dùng cuối)
const getBlogById = async (req, res) => {
  // Lấy một blog cụ thể theo ID để hiển thị cho người dùng cuối
  try {
    // Tìm blog theo ID được truyền qua params và điền thông tin của tác giả, thể loại
    const blog = await Blog.findById(req.params.blogId).populate("author", "name").populate('category', 'catName');

    // Kiểm tra nếu blog tồn tại
    if (blog) {
      res.status(200).json(blog);
    } else {
      res.status(404).json({ message: `Không tìm thấy Blog ${req.params.blogId}` });
    }
  } catch (err) {
    // Nếu có lỗi xảy ra trong quá trình truy vấn, trả về response với mã trạng thái 500 (Lỗi máy chủ)
    res.status(500).json({ message: "Lỗi máy chủ", error: err.message });
  }
};

// Các chức năng dành cho Admin

// Lấy tất cả các blog (bao gồm cả blog chưa được phê duyệt)
const getAllBlogsByAdmin = async (req, res) => {
  // Lấy tất cả các blog (bao gồm cả các blog chưa được phê duyệt) để quản lý bởi admin
  try {
    // Tìm tất cả các blog và điền thông tin của tác giả, thể loại
    const blogs = await Blog.find({}).populate("author", "name").populate('category', 'catName');

    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ message: "Lỗi máy chủ", error: err.message });
  }
};

// Phê duyệt blog
const approveBlog = async (req, res) => {
  // Phê duyệt một blog (chỉ dành cho admin)
  try {
    // Lấy blogId từ params
    const { blogId } = req.params;

    // Tìm và cập nhật trạng thái của blog thành "approved" và xóa lý do từ chối nếu có
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      { status: "approved", $unset: { reasonReject: 1 } },// Sử dụng $unset để xóa trường reasonReject
      { new: true } // Trả về blog đã được cập nhật
    );
    // Nếu không tìm thấy blog, trả về lỗi 404
    if (!blog) return res.status(404).json({ message: "Không tìm thấy blog" });
    // Trả về response với mã trạng thái 200 (OK) và thông tin của blog đã được phê duyệt
    res.status(200).json(blog);
  } catch (err) {
    // Nếu có lỗi xảy ra trong quá trình cập nhật, trả về response với mã trạng thái 500 (Lỗi máy chủ)
    res.status(500).json({ message: "Lỗi máy chủ", error: err.message });
  }
};

// Từ chối blog
const rejectBlog = async (req, res) => {
  // Từ chối một blog (chỉ dành cho admin)
  try {
    // Lấy blogId từ params
    const { blogId } = req.params;
    console.log(blogId); // Log blogId (có thể để debug)

    // Tìm và cập nhật trạng thái của blog thành "rejected" và lưu lý do từ chối
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      { status: "rejected", reasonReject: req.body.reasonReject },
      { new: true } // Trả về blog đã được cập nhật
    );
    // Nếu không tìm thấy blog, trả về lỗi 404
    if (!blog) return res.status(404).json({ message: "Không tìm thấy blog" });
    // Trả về response với mã trạng thái 200 (OK) và thông tin của blog đã bị từ chối
    res.status(200).json(blog);
  } catch (err) {
    // Nếu có lỗi xảy ra trong quá trình cập nhật, trả về response với mã trạng thái 500 (Lỗi máy chủ)
    res.status(500).json({ message: "Lỗi máy chủ", error: err.message });
  }
};

module.exports = {
  getBlogById,
  getAllBlogsByAdmin,
  rejectBlog,
  approveBlog,
};
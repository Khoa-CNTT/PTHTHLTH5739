const Comment = require('../../models/comment');
const Blog = require("../../models/blog");
const Category = require("../../models/category");


// Các hoạt động CRUD cho Blog

// Lấy tất cả các blog đã được phê duyệt cho người dùng
const getAllBlogsByUser = async (req, res) => {
    try {
        // Tìm tất cả các blog có trạng thái 'approved', sắp xếp theo thời gian tạo mới nhất
        const blogs = await Blog.find({ status: 'approved' })
            .populate('author', 'name') // Lấy thông tin tên tác giả
            .populate('category', 'catName') // Lấy thông tin tên danh mục
            .sort({ createdAt: -1 });
        console.log(blogs);

        res.status(200).json(blogs);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: err.message });
    }
};


// Lấy một blog theo ID
const getBlogById = async (req, res) => {
    try {
        // Tìm blog theo ID và populate thông tin tác giả và danh mục
        const blog = await Blog.findById(req.params.blogId)
            .populate('author', 'name') // Lấy thông tin tên tác giả
            .populate('category', 'catName'); // Lấy thông tin tên danh mục

        if (blog) {
            res.status(200).json(blog);
        } else {
            res.status(404).json({ message: `Không tìm thấy Blog có ID ${req.params.blogId}` });
        }
    } catch (err) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: err.message });
    }
};


// Lấy tất cả danh mục blog
const getAllBlogCategory = async (req, res) => {
    try {
        // Tìm tất cả các danh mục blog
        const blogCategory = await Category.find({});
        const totalBlogTypes = blogCategory.length; // Tổng số lượng danh mục blog
        res.status(200).json({ blogCategory, totalBlogTypes });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: err.message });
    }
};


module.exports = {
    getAllBlogsByUser,
    getBlogById,
    getAllBlogCategory,
};
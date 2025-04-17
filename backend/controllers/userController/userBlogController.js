const Comment = require('../../models/comment');
const Blog = require("../../models/blog");
const Category = require("../../models/category");

// Các hoạt động CRUD cho Blog

// Lấy tất cả Blog cho Người dùng
const getAllBlogsByUser = async (req, res) => {
    try {
        const blogs = await Blog.find({ status: 'approved' })
            .populate('author', 'name')
            .populate('category', 'catName');
        console.log(blogs);

        res.status(200).json(blogs);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: err.message });
    }
};


// Lấy một Blog theo ID
const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.blogId)
            .populate('author', 'name')
            .populate('category', 'catName');

        if (blog) {
            res.status(200).json(blog);
        } else {
            res.status(404).json({ message: `Không tìm thấy Blog có ID ${req.params.blogId}` });
        }
    } catch (err) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: err.message });
    }
};


// Danh mục Blog

const getAllBlogCategory = async (req, res) => {
    try {
        const blogCategory = await Category.find({});
        const totalBlogTypes = blogCategory.length; // Tổng số lượng loại blog
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
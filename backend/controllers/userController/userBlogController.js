const Comment = require('../../models/comment');
const Blog = require("../../models/blog");
const Category = require("../../models/category");


// CRUD operations for Blog

//User Blog
const getAllBlogsByUser = async (req, res) => {
    try {
        const blogs = await Blog.find({ status: 'approved' })
            .populate('author', 'name')
            .populate('category', 'catName');
        console.log(blogs);

        res.status(200).json(blogs);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};



// Get a blog by ID
const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.blogId)
            .populate('author', 'name')
            .populate('category', 'catName');

        if (blog) {
            res.status(200).json(blog);
        } else {
            res.status(404).json({ message: `Blog ${req.params.blogId} not found` });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};



// Blog Category

const getAllBlogCategory = async (req, res) => {
    try {
        const blogCategory = await Category.find({});
        const totalBlogTypes = blogCategory.length; // Tổng số lượng product type
        res.status(200).json({ blogCategory, totalBlogTypes });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};



module.exports = {
    getAllBlogsByUser,
    getBlogById,

    getAllBlogCategory,
};
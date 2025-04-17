const Blog = require("../../models/blog");
const axios = require("axios");

// Gửi bài viết bởi huấn luyện viên để quản trị viên phê duyệt
const submitBlogByCoach = async (req, res) => {
    try {
        const coachId = req.account.id;
        const { title, image, content, category } = req.body;

        // Tạo một bài viết mới với trạng thái 'pending' (chờ duyệt)
        const newBlog = await Blog.create({
            title,
            image,
            content,
            category,
            author: coachId,
            status: "pending",
        });

        res.status(201).json({
            blog: newBlog
        });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: err.message });
    }
};

// Lấy tất cả các bài viết được gửi bởi huấn luyện viên đã đăng nhập
const getCoachBlogs = async (req, res) => {
    const coachId = req.account.id;
    try {
        const blogs = await Blog.find({ author: coachId }).populate('category', 'catName');
        if (blogs.length === 0) {
            return res.status(200).json({ message: 'Không có bài viết nào được gửi bởi huấn luyện viên này' });
        }
        res.status(200).json(blogs);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: err.message });
    }
};

const getCoachBlogsById = async (req, res) => {
    const coachId = req.account.id;
    const { blogId } = req.params;

    // Kiểm tra xem blogId có phải là một ObjectId hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
        return res.status(400).json({ message: 'ID bài viết không hợp lệ' });
    }


    try {
        const blog = await Blog.findOne({ _id: blogId, author: coachId });
        if (!blog) {
            return res.status(200).json({ message: 'Không có bài viết nào được gửi bởi huấn luyện viên này' });
        }
        res.status(200).json(blogs);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: err.message });
    }
};

// Cập nhật bài viết bởi huấn luyện viên
const updateCoachBlog = async (req, res) => {
    const coachId = req.account.id;
    const { blogId } = req.params;
    const { title, image, content, category } = req.body;

    try {
        // Tìm bài viết theo ID và tác giả
        const blog = await Blog.findOne({ _id: blogId, author: coachId });

        if (!blog) {
            return res.status(404).json({ message: 'Không tìm thấy bài viết hoặc bạn không có quyền cập nhật bài viết này' });
        }


        // Cập nhật các trường của bài viết
        blog.title = title || blog.title;
        blog.image = image || blog.image;
        blog.content = content || blog.content;
        blog.status = "pending";
        blog.category = category || blog.category;


        const updatedBlog = await blog.save();

        res.status(200).json({
            message: 'Bài viết được cập nhật thành công',
            blog: updatedBlog
        });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: err.message });
    }
};


// Xóa bài viết bởi huấn luyện viên
const deleteCoachBlog = async (req, res) => {
    const coachId = req.account.id;
    const { blogId } = req.params;

    try {
        // Tìm bài viết theo ID và tác giả
        const blog = await Blog.findOne({ _id: blogId, author: coachId });

        if (!blog) {
            return res.status(404).json({ message: 'Không tìm thấy bài viết hoặc bạn không có quyền xóa bài viết này' });
        }

        await Blog.findByIdAndDelete(blogId);

        res.status(200).json({ message: 'Bài viết đã xóa thành công' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: err.message });
    }
};


module.exports = {
    submitBlogByCoach,
    updateCoachBlog,
    deleteCoachBlog,
    getCoachBlogs,
    getCoachBlogsById,
};
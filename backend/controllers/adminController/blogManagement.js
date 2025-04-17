const express = require("express");
const bodyParser = require("body-parser");

const Comment = require("../../models/comment");
const Blog = require("../../models/blog");
const blog = require("../../models/blog"); // Lặp lại import, có thể bỏ
const Category = require("../../models/category");

const adminRouter = express.Router();
adminRouter.use(bodyParser.json());

// Các hoạt động CRUD cho Blog

// Blog của người dùng
const getAllBlogsByUser = async (req, res) => {
  // Lấy tất cả các blog đã được phê duyệt để hiển thị cho người dùng cuối
  try {
    // Tìm tất cả các blog có trạng thái là "approved" và điền thông tin của tác giả (chỉ lấy trường 'name')
    const blogs = await Blog.find({ status: "approved" }).populate(
      "author",
      "name"
    );
    console.log(blog);

    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ message: "Lỗi máy chủ", error: err.message });
  }
};

// Lấy một blog theo ID
const getBlogById = async (req, res) => {
  // Lấy một blog cụ thể theo ID để hiển thị cho người dùng cuối
  try {
    // Tìm blog theo ID được truyền qua params và điền thông tin của tác giả, thể loại
    const blog = await Blog.findById(req.params.blogId).populate("author","name").populate('category', 'catName');

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

// Blog của Admin

// Tạo một blog mới
const createBlog = async (req, res) => {
  // Tạo một blog mới (chỉ dành cho admin)
  try {
    // Lấy dữ liệu từ body của request
    const { title, description, content, image } = req.body;
    // Lấy userId từ đối tượng req.account (được thêm bởi middleware xác thực)
    const userId = req.account.id;
    // Tạo một blog mới trong database với trạng thái "approved" và gán tác giả là userId
    const newBlog = await Blog.create({
      title,
      description,
      content,
      image,
      status: "approved",
      author: userId,
    });

    // Trả về response với mã trạng thái 201 (Đã tạo) và thông tin của blog vừa tạo
    res.status(201).json({
      _id: newBlog._id,
      title: newBlog.title,
      description: newBlog.description,
      content: newBlog.content,
      image: newBlog.image,
      status: newBlog.status,
      author: newBlog.author,
    });
  } catch (error) {
    // Nếu có lỗi xảy ra trong quá trình tạo blog, trả về response với mã trạng thái 500 (Lỗi máy chủ)
    res.status(500).json({
      message: "Lỗi khi tạo bài blog",
      error: error.message,
    });
  }
};

// Lấy tất cả các blog
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

const getBlogByIdAdmin = async (req, res) => {
  // Lấy một blog cụ thể theo ID để quản lý bởi admin
  try {
    // Tìm blog theo ID được truyền qua params và điền thông tin của tác giả, thể loại
    const blog = await Blog.findById(req.params.blogId).populate("author","name").populate('category', 'catName');

    // Kiểm tra nếu blog tồn tại
    if (blog) {
      res.status(200).json(blog);
    } else {
      res.status(404).json({ message: `Không tìm thấy Blog ${req.params.blogId}` });
    }
  } catch (err) {
    res.status(500).json({ message: "Lỗi máy chủ", error: err.message });
  }
};

// Cập nhật một blog theo ID
const updateBlog = async (req, res) => {
  // Cập nhật thông tin của một blog theo ID (chỉ dành cho admin)
  try {
    // Lấy blogId từ params và dữ liệu cập nhật từ body của request
    const { blogId } = req.params;
    const { title, description, content, image } = req.body;

    // Tìm blog theo ID
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Không tìm thấy bài blog" });
    }

    // Cập nhật các trường của blog nếu có giá trị mới được cung cấp
    blog.title = title || blog.title;
    blog.description = description || blog.description;
    blog.content = content || blog.content;
    blog.image = image || blog.image;

    const updatedBlog = await blog.save();

    res.status(200).json({
      _id: updatedBlog._id,
      title: updatedBlog.title,
      description: updatedBlog.description,
      content: updatedBlog.content,
      image: updatedBlog.image,
    });
    console.log("update success");
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi cập nhật bài blog", error: error.message });
  }
};

// Xóa một blog theo ID
const deleteBlog = async (req, res) => {
  // Xóa một blog theo ID (chỉ dành cho admin)
  try {
    // Lấy blogId từ params
    const { blogId } = req.params;

    // Tìm blog theo ID và xóa
    const blog = await Blog.findByIdAndDelete(blogId);

    if (!blog) {
      return res.status(404).json({ message: "Không tìm thấy bài blog" });
    }
    res.status(200).json({ message: "Bài blog đã được xóa" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi xóa bài blog", error: error.message });
  }
};

// Danh mục Blog
const createBlogCategory = async (req, res) => {
  // Tạo một danh mục blog mới (chỉ dành cho admin)
  try {
    // Lấy tên danh mục từ body của request
    const { catName } = req.body;
    // Tạo một danh mục mới trong database
    const newCategory = await Category.create({
      catName,
    });

    res.status(201).json({
      _id: newCategory._id,
      catName: newCategory.catName,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi tạo danh mục",
      error: error.message,
    });
  }
};

const getAllBlogCategory = async (req, res) => {
  // Lấy tất cả các danh mục blog để hiển thị (cho cả người dùng và admin)
  try {
    // Tìm tất cả các danh mục blog trong database
    const blogCategory = await Category.find({});
    // Tính tổng số lượng danh mục
    const totalBlogTypes = blogCategory.length;
    res.status(200).json({ blogCategory, totalBlogTypes });
  } catch (err) {
    res.status(500).json({ message: "Lỗi máy chủ", error: err.message });
  }
};

// Cập nhật một danh mục blog theo ID
const updateBlogCategory = async (req, res) => {
  // Cập nhật tên của một danh mục blog theo ID (chỉ dành cho admin)
  try {
    // Lấy blogCategoryId từ params và tên danh mục mới từ body của request
    const { blogCategoryId } = req.params;
    const { catName } = req.body;
    // Tìm danh mục blog theo ID
    const blogCategory = await Category.findById(blogCategoryId);
    if (!blogCategory) {
      return res.status(404).json({ message: "Không tìm thấy phân loại blog" });
    }
    // Cập nhật tên danh mục nếu có giá trị mới được cung cấp
    blogCategory.catName = catName || blogCategory.catName;

    // Lưu các thay đổi vào database
    const updatedBlogCategory = await blogCategory.save();

    res.status(200).json({
      _id: updatedBlogCategory._id,
      catName: updatedBlogCategory.catName,
    });
    console.log("update success");
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi cập nhật phân loại blog",
      error: error.message,
    });
  }
};

// Xóa một danh mục blog theo ID
const deleteBlogCategory = async (req, res) => {
  // Xóa một danh mục blog theo ID (chỉ dành cho admin)
  try {
    // Lấy blogCategoryId từ params
    const { blogCategoryId } = req.params;

    // Tìm danh mục blog theo ID và xóa
    const blogCategory = await Category.findByIdAndDelete(blogCategoryId);

    if (!blogCategory) {
      return res.status(404).json({ message: "Không tìm thấy phân loại blog" });
    }
    res.status(200).json({ message: "Phân loại blog đã được xóa" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi xóa phân loại blog", error: error.message });
  }
};

// Tạo một bình luận mới cho một blog
const createComment = async (req, res) => {
  // Tạo một bình luận mới cho một blog cụ thể
  const { blogId } = req.params; // Lấy ID của blog từ params
  const userId = req.account.id; // Lấy ID của người dùng từ đối tượng req.account (được thêm bởi middleware xác thực)
  const { content, parentCommentId } = req.body; // Nhận nội dung bình luận và ID của bình luận cha (nếu là phản hồi)

  try {
    // Tạo bình luận mới trong database
    const comment = await Comment.create({
      userId,
      blogId,
      content,
      parentCommentId,
    });

    // Kiểm tra nếu đây là một phản hồi cho một bình luận khác
    if (parentCommentId) {
      // Tìm bình luận cha và thêm ID của bình luận mới vào mảng 'replies'
      await Comment.findByIdAndUpdate(parentCommentId, {
        $push: { replies: comment._id },
      });
    } else {
      // Nếu đây là một bình luận gốc (không có parentCommentId), thêm ID của bình luận vào mảng 'comments' của blog
      await Blog.findByIdAndUpdate(
        blogId,
        { $push: { comments: comment._id } },
        { new: true } // Trả về blog đã được cập nhật
      );
    }

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: "Lỗi máy chủ", error: err.message });
  }
};

// Lấy tất cả các bình luận cho một blog
const getAllCommentsByBlog = async (req, res) => {
  // Lấy tất cả các bình luận (gốc và phản hồi) cho một blog cụ thể
  const { blogId } = req.params; // Lấy ID của blog từ params

  try {
    // Tìm tất cả các bình luận thuộc về blogId và không có parentCommentId (là bình luận gốc)
    const comments = await Comment.find({ blogId, parentCommentId: null })
      // Điền thông tin của người dùng đã tạo bình luận (chỉ lấy trường 'name')
      .populate("userId", "name")
      // Điền thông tin của các phản hồi (các bình luận có parentCommentId là ID của bình luận gốc)
      .populate({
        path: "replies",
        populate: { path: "userId", select: "name" }, // Điền thông tin của người dùng cho từng trả lời (chỉ lấy trường 'name')
      });

    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: "Lỗi máy chủ", error: err.message });
  }
};

// Cập nhật một bình luận theo ID
const updateComment = async (req, res) => {
  // Cập nhật nội dung của một bình luận theo ID
  const { commentId } = req.params; // Lấy ID của bình luận từ params

  try {
    // Tìm và cập nhật bình luận theo ID với dữ liệu
    const comment = await Comment.findByIdAndUpdate(
      commentId,
      { $set: req.body },
      { new: true } // Trả về bình luận đã được cập nhật
    );
    // Kiểm tra nếu bình luận tồn tại
    if (comment) {
      res.status(200).json(comment);
    } else {
      res.status(404).json({ message: `Không tìm thấy bình luận ${commentId}` });
    }
  } catch (err) {
    res.status(500).json({ message: "Lỗi máy chủ", error: err.message });
  }
};

// Xóa một bình luận theo ID
const deleteComment = async (req, res) => {
  // Xóa một bình luận theo ID
  const { commentId } = req.params; // Lấy ID của bình luận từ params

  try {
    // Tìm và xóa bình luận theo ID
    const comment = await Comment.findByIdAndDelete(commentId);
    if (!comment) {
      return res
        .status(404)
        .json({ message: `Không tìm thấy bình luận ${commentId}` });
    }

    // Kiểm tra nếu đây là một phản hồi cho một bình luận khác
    if (comment.parentCommentId) {
      // Tìm bình luận cha và xóa ID của bình luận này khỏi mảng 'replies'
      await Comment.findByIdAndUpdate(comment.parentCommentId, {
        $pull: { replies: commentId },
      });
    } else {
      // Nếu đây là một bình luận gốc, xóa tất cả các phản hồi của nó
      await Comment.deleteMany({ parentCommentId: commentId });
      // Xóa ID của bình luận này khỏi mảng 'comments' của blog
      await Blog.findByIdAndUpdate(comment.blogId, {
        $pull: { comments: commentId },
      });
    }

    res.status(200).json({ message: "Bình luận đã được xóa thành công" });
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

    // Tìm và cập nhật trạng thái của blog thành "approved"
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
  getAllBlogsByUser,
  getBlogById,

  createBlogCategory,
  createBlog,
  deleteBlog,
  updateBlog,
  getBlogByIdAdmin,
  getAllBlogsByAdmin,
  getAllBlogCategory,
  deleteBlogCategory,
  updateBlogCategory,

  getAllCommentsByBlog,
  createComment,
  updateComment,
  deleteComment,

  rejectBlog,
  approveBlog,
};
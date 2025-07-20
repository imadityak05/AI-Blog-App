import jwt from "jsonwebtoken";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";


//admin login
export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email!=process.env.ADMIN_EMAIL || password!=process.env.ADMIN_PASSWORD) {
            return res.json({  success:false , message: "Invalid credentials" });
        }

        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });
        return res.json({ success:true , token , message: "Login successful" });
    } catch (error) {
        return res.json({ success:false , message: error.message });
    }
}


//get all blogs admin
export const getAllBlogs = async (req, res) => {
    try {
      const blogs = await Blog.find().sort({ createdAt: -1 });
      res.status(200).json({ success: true, blogs });
    } catch (error) {
      console.error("Error in getAllBlogs:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  };

//to see all comments
export const getAllComments = async (req, res) => {
    try {
        const comments = await Comment.find({}).populate("blog").sort({createdAt:-1});
        return res.json({ success: true, comments });
    } catch (error) {
        return res.json({ success: false, error: error.message });
    }
}

//get dashboadr
export const getDashboard = async (req, res) => {
    try {
        // Get all blogs for debugging
        const allBlogs = await Blog.find({});
        console.log('All blogs:', allBlogs.map(b => ({
            _id: b._id,
            title: b.title,
            isPublished: b.isPublished,
            createdAt: b.createdAt
        })));

        const recentBlogs = await Blog.find({}).sort({createdAt:-1}).limit(5);
        const totalBlogs = await Blog.countDocuments();
        const totalComments = await Comment.countDocuments();
        const draftBlogs = await Blog.countDocuments({isPublished: false});

        console.log('Dashboard counts:', {
            totalBlogs,
            totalComments,
            draftBlogs,
            recentBlogsCount: recentBlogs.length
        });

        const dashboardData = {
            recentBlogs,
            totalBlogs,
            totalComments,
            draftBlogs
        }
        return res.json({ success: true, dashboardData });
    } catch (error) {
        return res.json({ success: false, error: error.message });
    }
}
//delete comment by id
export const deleteCommentById = async (req, res) => {
    try {
        const {id} = req.body;
        const comment = await Comment.findByIdAndDelete(id);
        if (!comment) {
            return res.json({ success: false, message: "Comment not found" });
        }
        return res.json({ success: true, message: "Comment deleted successfully" });
    } catch (error) {
        return res.json({ success: false, error: error.message });
    }
}


//approve comment by id
export const approveCommentById = async (req, res) => {
    try {
        const {id} = req.body;
        const comment = await Comment.findByIdAndUpdate(id,{isApproved:true});
        if (!comment) {
            return res.json({ success: false, message: "Comment not found" });
        }
        return res.json({ success: true, message: "Comment approved successfully" });
    } catch (error) {
        return res.json({ success: false, error: error.message });
    }
}



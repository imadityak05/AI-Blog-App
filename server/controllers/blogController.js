import mongoose from 'mongoose';
import Blog from "../models/Blog.js";
import fs from "fs";
import imageKit from "../configs/imageKit.js";
import Comment from "../models/Comment.js";
import main from "../configs/gemini.js";

export const addBlog = async (req, res) => {
    try {
        const { title, subTitle, description, category, isPublished } =JSON.parse(req.body.blog);
        const imageFile = req.file;
        //check if all feilds are present

        if (!title || !subTitle || !description || !category || !imageFile) {
            return res.json({ success: false, message: "All fields are required" });
        }
        const fileBuffer = fs.readFileSync(imageFile.path);

        //upload image to imagekit
        const response = await imageKit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: "/blogs",
        });
        
        //optimise and transform image
        const optimisedImageUrl = imageKit.url({
            path: response.filePath,
            transformations: [
                {quality: "auto"},
                {format: "webp"},
                {width: 1280},
            ],
        });
        
        const image = optimisedImageUrl;
        await Blog.create({ title, subTitle, description, category, image, isPublished });
        return res.json({ success: true, message: "Blog added successfully" });
    } catch (error) {
        return res.json({ success: false, error: error.message });
    }
}

//get all blogs (admin view - shows all blogs)
export const getAllBlogs = async (req, res) => {
    try {
        // For admin view, we want to see all blogs regardless of publish status
        const blogs = await Blog.find({});
        return res.json({ success: true, blogs: blogs });
    } catch (error) {
        return res.json({ success: false, error: error.message });
    }
}

//get published blogs (public view - shows only published blogs)
export const getPublishedBlogs = async (req, res) => {
    try {
        console.log('Fetching published blogs...');
        const query = { isPublished: true };
        console.log('MongoDB query:', JSON.stringify(query));
        
        const blogs = await Blog.find(query).sort({ createdAt: -1 });
        console.log(`Found ${blogs.length} published blogs`);
        
        // Log each blog's ID and published status for debugging
        blogs.forEach(blog => {
            console.log(`Blog ID: ${blog._id}, Title: ${blog.title}, isPublished: ${blog.isPublished}`);
        });
        
        // Debug: Log all categories found in published blogs
        const allCategories = [];
        blogs.forEach(blog => {
            if (blog.category) allCategories.push(blog.category);
            if (blog.catogry) allCategories.push(blog.catogry);
        });
        console.log('All categories in published blogs:', [...new Set(allCategories)]);
        
        return res.json({ success: true, blogs });
    } catch (error) {
        console.error('Error getting published blogs:', error);
        return res.json({ 
            success: false, 
            message: 'Failed to fetch published blogs',
            error: error.message 
        });
    }
};

// Get all unique categories
export const getCategories = async (req, res) => {
    try {
        // First, log all categories in the database for debugging
        const allBlogs = await Blog.find({}, 'category');
        console.log('All blog categories in DB:', allBlogs.map(b => b.category));
        
        // Get distinct categories
        const categories = await Blog.distinct('category');
        const filteredCategories = categories.filter(Boolean); // Filter out any null/undefined values
        
        console.log('Distinct categories found:', filteredCategories);
        
        return res.json({ 
            success: true, 
            categories: filteredCategories
        });
    } catch (error) {
        console.error('Error getting categories:', error);
        return res.json({ 
            success: false, 
            message: 'Failed to fetch categories',
            error: error.message 
        });
    }
};

//get blogs by id
export const getBlogById = async (req, res) => {
    try {
        const { blogId } = req.params; // Changed from id to blogId to match the route parameter
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.json({ success: false, message: "Blog not found" });
        }
        return res.json({ success: true, blog });
    } catch (error) {
        return res.json({ success: false, error: error.message });
    }
}

//delete blog
export const deleteBlogById = async (req, res) => {
    try {
        const { id } = req.body;
        const blog = await Blog.findByIdAndDelete(id);
        if (!blog) {
            return res.json({ success: false, message: "Blog not found" });
        }
        await Comment.deleteMany({ blog: id });
        return res.json({ success: true, message: "Blog deleted successfully" });
    } catch (error) {
        return res.json({ success: false, error: error.message });
    }
}



//toggle publish
// when unpublished the blog should not disappear from the list instead it should be marked as unpublished status 
export const togglePublish = async (req, res) => {
    try {
        console.log('Toggle publish request body:', req.body);
        console.log('Request headers:', req.headers);
        
        // First check if body exists and has content
        if (!req.body) {
            console.error('No request body received');
            return res.status(400).json({ 
                success: false, 
                message: "No data received" 
            });
        }

        // Get the ID from the request body
        const id = req.body.id || req.body.blogId;
        
        if (!id) {
            console.error('No blog ID provided in request body. Body:', req.body);
            return res.status(400).json({ 
                success: false, 
                message: "Blog ID is required",
                receivedBody: req.body
            });
        }

        console.log('Looking for blog with ID:', id);
        
        // Add validation for MongoDB ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.error('Invalid blog ID format:', id);
            return res.status(400).json({ 
                success: false, 
                message: "Invalid blog ID format",
                receivedId: id
            });
        }

        const blog = await Blog.findById(id);
        
        if (!blog) {
            console.error(`Blog with ID ${id} not found`);
            return res.status(404).json({ 
                success: false, 
                message: "Blog not found" 
            });
        }
        
        console.log('Found blog:', { id: blog._id, currentStatus: blog.isPublished });
        
        // Toggle the publish status
        const newStatus = !blog.isPublished;
        blog.isPublished = newStatus;
        
        console.log('Attempting to save with new status:', newStatus);
        
        const savedBlog = await blog.save();
        console.log('Save result:', { id: savedBlog._id, newStatus: savedBlog.isPublished });
        
        console.log(`Blog ${blog._id} publish status updated to: ${newStatus}`);
        
        return res.json({ 
            success: true, 
            message: `Blog ${newStatus ? 'published' : 'unpublished'} successfully`,
            isPublished: newStatus,
            blog: savedBlog
        });
        
    } catch (error) {
        console.error('Error in togglePublish:', {
            message: error.message,
            stack: error.stack,
            name: error.name,
            code: error.code,
            keyPattern: error.keyPattern,
            keyValue: error.keyValue
        });
        return res.status(500).json({ 
            success: false, 
            message: "Failed to update blog status",
            error: error.message,
            code: error.code || 'UNKNOWN_ERROR'
        });
    }
}

 
// Add a new comment
export const addComment = async (req, res) => {
   try {
       const {blog, name, content} = req.body;
       await Comment.create({blog, name, content});
       return res.json({ success: true, message: "Comment added for review" });
    } catch (error) {
        return res.json({ success: false, error: error.message });
    }
}

// Get blog comments (only approved for non-admin users)
export const getBlogComments = async (req, res) => {
    try {
        const { id } = req.params;
        const isAdmin = req.user?.role === 'admin';
        
        let query = { blog: id };
        if (!isAdmin) {
            query.isApproved = true; // Only show approved comments to non-admin users
        }
        
        const comments = await Comment.find(query).sort({ createdAt: -1 });
        return res.json({ success: true, comments });
    } catch (error) {
        return res.json({ success: false, error: error.message });
    }
}

// Approve a comment (admin only)
export const approveComment = async (req, res) => {
    try {
        const { id } = req.params;
        const comment = await Comment.findByIdAndUpdate(
            id, 
            { isApproved: true },
            { new: true }
        );
        
        if (!comment) {
            return res.status(404).json({ success: false, message: 'Comment not found' });
        }
        
        return res.json({ 
            success: true, 
            message: 'Comment approved successfully',
            comment 
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

// Get all comments for admin review
export const getAllComments = async (req, res) => {
    try {
        // Fetch all comments and populate blog details
        const comments = await Comment.find({})
            .populate('blog', 'title') // Only get the blog title
            .sort({ createdAt: -1 }); // Newest first
            
        return res.json({ 
            success: true, 
            comments 
        });
    } catch (error) {
        console.error('Error fetching comments:', error);
        return res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch comments' 
        });
    }
};

// Delete a comment (admin only)
export const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const comment = await Comment.findByIdAndDelete(id);
        
        if (!comment) {
            return res.status(404).json({ success: false, message: 'Comment not found' });
        }
        
        return res.json({ 
            success: true, 
            message: 'Comment deleted successfully' 
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}


//generate content
export const generateContent = async (req, res) => {
    try {
        const { prompt } = req.body;
        const content = await main(prompt +'Generate a Blog Content for me in the simple language and easy to understand');
        return res.json({ success: true, content });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}
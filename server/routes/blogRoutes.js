import express from "express";
import { 
  addBlog, 
  deleteBlogById, 
  getAllBlogs, 
  getBlogById, 
  togglePublish, 
  getPublishedBlogs, 
  addComment, 
  getBlogComments, 
  getCategories,
  approveComment,
  deleteComment,
  getAllComments,
  generateContent
} from "../controllers/blogController.js";
import upload from "../middleware/multer.js";
import auth from "../middleware/auth.js";

const blogRouter = express.Router();

blogRouter.post("/add", auth, upload.single("image"), addBlog);
blogRouter.get("/all", getAllBlogs);  // Admin view - all blogs
blogRouter.get("/published", getPublishedBlogs);  // Public view - only published blogs
blogRouter.get("/categories", getCategories);  // Get all unique categories
blogRouter.get("/:blogId", getBlogById);
blogRouter.post("/delete", auth , deleteBlogById);
blogRouter.post("/toggle-publish", auth , togglePublish);
blogRouter.post("/add-comment", auth , addComment);
// Comment routes
blogRouter.get("/comments/:id", getBlogComments);
blogRouter.patch("/comments/:id/approve", auth, approveComment);
blogRouter.delete("/comments/:id", auth, deleteComment);

blogRouter.post("/generate", auth, generateContent);

// Admin comment management
blogRouter.get("/admin/comments", auth, getAllComments);

export default blogRouter;
 
import express from "express";
import { adminLogin  ,getDashboard,deleteCommentById,approveCommentById,getAllComments ,getAllBlogs} from "../controllers/adminController.js";
import auth from "../middleware/auth.js";
 
const adminRouter = express.Router();



adminRouter.post("/login", adminLogin);
adminRouter.get("/comment", auth , getAllComments);
adminRouter.get("/blog", auth , getAllBlogs);
adminRouter.post("/delete-comment", auth , deleteCommentById);
adminRouter.post("/approve-comment", auth , approveCommentById);
adminRouter.get("/dashboard", auth , getDashboard);

export default adminRouter;

import express from 'express'
import { createBlogController, deleteBlogController, getAllBlogsController, getBlogByIdController, getSavedBlogsController, LikeBlogController, publishBlogController,SaveBlogController, unpublishBlogController, updateBlogController } from './Controller/Blogs.Controller';
import { uploadS3 } from '../../../Middlewares/Multers/S3Uploads/Uploads';
import { checkAuth } from '../../../Middlewares/Auth/ValidateCokkies'
import {checkRole} from '../../../Middlewares/Auth/CheckDesignation'

const router =express.Router();


router.post("/create",uploadS3.single("image") , checkAuth,checkRole(["Employee"]), createBlogController);
router.get("/", getAllBlogsController);
router.get("/:id" ,getBlogByIdController);
router.post("/like/:id", checkAuth ,LikeBlogController);
router.post("/save/:id",checkAuth, SaveBlogController);
router.get("/get-all/saved",  checkAuth, getSavedBlogsController);
router.delete("/:blogId",  checkAuth, deleteBlogController);
router.put("/:id/publish",checkAuth,checkRole(["Employee"]), publishBlogController);
router.put("/:id/unpublish", checkAuth, checkRole(["Employee"]),  unpublishBlogController);

router.put("/:blogId/update",uploadS3.single("image") , checkAuth,checkRole(["Employee"]), updateBlogController);





export default router
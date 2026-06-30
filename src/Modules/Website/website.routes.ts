import express from "express";
import TestMonialsRoutes from './TestMonials/Routes'
import BlogRoutes from './Blogs/Routes'
import CareersRoutes from './Careers/Routes'
import SupportRoutes from './Support/Routes'
import GalleryRoutes from "./Gallery/Routes"

const router=express.Router();




router.use("/testmonials",TestMonialsRoutes)
router.use("/blog",BlogRoutes)
router.use("/careers",CareersRoutes)
router.use("/gallery",GalleryRoutes)
router.use("/support",SupportRoutes)






export default router;

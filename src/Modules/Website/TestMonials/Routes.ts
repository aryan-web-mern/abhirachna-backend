import {checkAuth } from "../../../Middlewares/Auth/ValidateCokkies"
// Testimonials/Routes.ts
import express from "express";
import { createTestimonialController, getApprovedTestimonialsController, getAllTestimonialsController, approveTestimonialController,  unpublishTestimonialController, deleteTestimonialController, updateTestimonialController } from "./Controllers/TestMonials.Controllers";
import requireParameters from "../../../Middlewares/Global/requireParameters";
import { uploadCloudinaryTestimonial } from "../../../Middlewares/Multers/Cloudinary/Uploads";
import { checkRole } from "../../../Middlewares/Auth/CheckDesignation";


const router = express.Router();

router.post(
    "/create",
    uploadCloudinaryTestimonial.fields([
        { name: "image", maxCount: 1 },
        { name: "video", maxCount: 1 },
    ]),
    requireParameters("fullName", "phoneNumber"),
    createTestimonialController
);
router.get("/approved", getApprovedTestimonialsController);
router.get("/get-all", getAllTestimonialsController);
router.put("/:id/approve",checkAuth,checkRole(["Employee"]), approveTestimonialController);
router.put("/:id/unpublish", checkAuth, checkRole(["Employee"]),  unpublishTestimonialController);
router.delete("/delete/:id",checkAuth,checkRole(["Employee"]), deleteTestimonialController);
router.put("/:id/update", checkAuth, checkRole(["Employee"]),uploadCloudinaryTestimonial.fields([
        { name: "image", maxCount: 1 },
        { name: "video", maxCount: 1 },
    ]), updateTestimonialController);

export default router;

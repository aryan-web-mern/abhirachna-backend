"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ValidateCokkies_1 = require("../../../Middlewares/Auth/ValidateCokkies");
// Testimonials/Routes.ts
const express_1 = __importDefault(require("express"));
const TestMonials_Controllers_1 = require("./Controllers/TestMonials.Controllers");
const requireParameters_1 = __importDefault(require("../../../Middlewares/Global/requireParameters"));
const Uploads_1 = require("../../../Middlewares/Multers/S3Uploads/Uploads");
const CheckDesignation_1 = require("../../../Middlewares/Auth/CheckDesignation");
const router = express_1.default.Router();
router.post("/create", Uploads_1.uploadS3.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
]), (0, requireParameters_1.default)("fullName", "phoneNumber"), TestMonials_Controllers_1.createTestimonialController);
router.get("/approved", TestMonials_Controllers_1.getApprovedTestimonialsController);
router.get("/get-all", TestMonials_Controllers_1.getAllTestimonialsController);
router.put("/:id/approve", ValidateCokkies_1.checkAuth, (0, CheckDesignation_1.checkRole)(["Employee"]), TestMonials_Controllers_1.approveTestimonialController);
router.put("/:id/unpublish", ValidateCokkies_1.checkAuth, (0, CheckDesignation_1.checkRole)(["Employee"]), TestMonials_Controllers_1.unpublishTestimonialController);
router.delete("/delete/:id", ValidateCokkies_1.checkAuth, (0, CheckDesignation_1.checkRole)(["Employee"]), TestMonials_Controllers_1.deleteTestimonialController);
router.put("/:id/update", ValidateCokkies_1.checkAuth, (0, CheckDesignation_1.checkRole)(["Employee"]), Uploads_1.uploadS3.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
]), TestMonials_Controllers_1.updateTestimonialController);
exports.default = router;

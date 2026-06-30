"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//
const express_1 = __importDefault(require("express"));
const Careers_Controllers_1 = require("./Controllers/Careers.Controllers");
const requireParameters_1 = __importDefault(require("../../../Middlewares/Global/requireParameters"));
const Uploads_1 = require("../../../Middlewares/Multers/Cloudinary/Uploads");
const ValidateCokkies_1 = require("../../../Middlewares/Auth/ValidateCokkies");
const CheckDesignation_1 = require("../../../Middlewares/Auth/CheckDesignation");
const router = express_1.default.Router();
router.post("/job-create", ValidateCokkies_1.checkAuth, (0, requireParameters_1.default)("jobTitle", "jobLocation", "jobType", "experience", "requirements", "responsibilities"), Careers_Controllers_1.createJobController);
router.put("/:id", ValidateCokkies_1.checkAuth, Careers_Controllers_1.editJobController);
router.get("/get-all-jobs", Careers_Controllers_1.getAllJobsController);
router.get("/get-job/:id", Careers_Controllers_1.getJobByIdController);
router.post('/apply-job', Uploads_1.uploadCloudinaryCareer.single("resume"), Careers_Controllers_1.applyJobController);
router.delete("/:id", ValidateCokkies_1.checkAuth, Careers_Controllers_1.deleteJobController);
router.put("/job/:id/publish", ValidateCokkies_1.checkAuth, (0, CheckDesignation_1.checkRole)(["Employee"]), Careers_Controllers_1.publishJobController);
router.put("/job/:id/unpublish", ValidateCokkies_1.checkAuth, (0, CheckDesignation_1.checkRole)(["Employee"]), Careers_Controllers_1.unpublishJobController);
router.get("/applied-jobs/:id", ValidateCokkies_1.checkAuth, (0, CheckDesignation_1.checkRole)(["Employee"]), Careers_Controllers_1.getAppliedJobsController);
router.delete("/applied-job/:id", ValidateCokkies_1.checkAuth, Careers_Controllers_1.deleteAppliedJobController);
exports.default = router;

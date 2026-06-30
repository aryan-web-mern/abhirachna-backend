//
import express from "express";
import { applyJobController, createJobController, deleteAppliedJobController, deleteJobController, editJobController, getAllJobsController, getAppliedJobsController, getJobByIdController, publishJobController, unpublishJobController } from "./Controllers/Careers.Controllers";
import requireParameters from "../../../Middlewares/Global/requireParameters";
import { uploadS3 } from "../../../Middlewares/Multers/S3Uploads/Uploads";
import { checkAuth } from "../../../Middlewares/Auth/ValidateCokkies"
import { checkRole } from "../../../Middlewares/Auth/CheckDesignation";

const router = express.Router();

router.post("/job-create", checkAuth, requireParameters("jobTitle", "jobLocation", "jobType", "experience", "requirements", "responsibilities"), createJobController);
router.put("/:id", checkAuth, editJobController);
router.get("/get-all-jobs", getAllJobsController);
router.get("/get-job/:id", getJobByIdController);
router.post('/apply-job', uploadS3.single("resume"), applyJobController)
router.delete("/:id", checkAuth, deleteJobController);
router.put("/job/:id/publish",checkAuth,checkRole(["Employee"]), publishJobController);
router.put("/job/:id/unpublish", checkAuth, checkRole(["Employee"]),  unpublishJobController);
router.get("/applied-jobs/:id", checkAuth, checkRole(["Employee"]),  getAppliedJobsController);
router.delete("/applied-job/:id", checkAuth, deleteAppliedJobController);


export default router;
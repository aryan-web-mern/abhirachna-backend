"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppliedJobModel = exports.JobModel = void 0;
const mongoose_1 = require("mongoose");
const JobSchema = new mongoose_1.Schema({
    jobTitle: { type: String, required: true },
    jobLocation: { type: String, required: true },
    jobType: { type: String, required: true },
    experience: { type: String, required: true },
    requirements: [{ type: String, required: true }],
    responsibilities: [{ type: String, required: true }],
    perksAndBenefits: [{ type: String }],
    salary: { type: String },
    bonus: [{ type: String }],
    summary: { type: String, required: true },
    department: { type: String, required: true },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "Emplooye", required: true },
    jobKey: { type: String, required: true },
    published: { type: Boolean, default: false },
    draft: { type: Boolean, default: true }
}, { timestamps: true });
exports.JobModel = (0, mongoose_1.model)("Job", JobSchema);
const appliedJobSchema = new mongoose_1.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    contact: { type: String, required: true },
    fileName: { type: String, required: true },
    fileKey: { type: String, required: true },
    role: { type: String },
    jobId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Job" },
    appliedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });
exports.AppliedJobModel = (0, mongoose_1.model)("AppliedJob", appliedJobSchema);

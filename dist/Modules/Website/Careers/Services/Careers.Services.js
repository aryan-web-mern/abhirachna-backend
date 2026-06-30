"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAppliedJobService = exports.getAppliedJobsService = exports.unpublishJobService = exports.publishJobService = exports.deleteJobService = exports.applyJobService = exports.getJobByIdService = exports.getAllJobsService = exports.editJobService = exports.createJobService = void 0;
const Careers_Repository_1 = require("../Repositroy/Careers.Repository");
const createJobService = async (data) => {
    try {
        return await (0, Careers_Repository_1.createJobRepository)(data);
    }
    catch (err) {
        throw new Error("Service error: " + err.message);
    }
};
exports.createJobService = createJobService;
const editJobService = async (data, id) => {
    try {
        return await (0, Careers_Repository_1.editJobRepository)(data, id);
    }
    catch (err) {
        throw new Error("Service error: " + err.message);
    }
};
exports.editJobService = editJobService;
const getAllJobsService = async (reqFromLead, page, limit, draft, published) => {
    try {
        return await (0, Careers_Repository_1.getAllJobsRepository)(reqFromLead, page, limit, draft, published);
    }
    catch (err) {
        throw new Error("Service error: " + err.message);
    }
};
exports.getAllJobsService = getAllJobsService;
const getJobByIdService = async (id) => {
    try {
        const job = await (0, Careers_Repository_1.getJobByIdRepository)(id);
        if (!job) {
            throw new Error("No JOb found");
        }
        return job;
    }
    catch (err) {
        throw new Error("Service error: " + err.message);
    }
};
exports.getJobByIdService = getJobByIdService;
const applyJobService = async (data) => {
    console.log(data);
    try {
        return await (0, Careers_Repository_1.applyJobRepository)(data);
    }
    catch (err) {
        throw new Error("Service error: " + err.message);
    }
};
exports.applyJobService = applyJobService;
const deleteJobService = async (jobId) => {
    try {
        await (0, Careers_Repository_1.deleteJobRepo)(jobId);
        return "Job Deleted Successfully!";
    }
    catch (err) {
        throw new Error("Service error: " + err.message);
    }
};
exports.deleteJobService = deleteJobService;
const publishJobService = async (id, published, draft) => {
    try {
        await (0, Careers_Repository_1.publishJobRepo)(id, published, draft);
        return "Job Published Successfully!";
    }
    catch (err) {
        throw new Error("Service error: " + err.message);
    }
};
exports.publishJobService = publishJobService;
const unpublishJobService = async (id, published, draft) => {
    try {
        await (0, Careers_Repository_1.unpublishJobRepo)(id, published, draft);
        return "Job Unpublished Successfully!";
    }
    catch (err) {
        throw new Error("Service error: " + err.message);
    }
};
exports.unpublishJobService = unpublishJobService;
const getAppliedJobsService = async (id) => {
    try {
        const appliedJobs = await (0, Careers_Repository_1.getAppliedJobsRepository)(id);
        return appliedJobs;
    }
    catch (err) {
        throw new Error("Service error: " + err.message);
    }
};
exports.getAppliedJobsService = getAppliedJobsService;
const deleteAppliedJobService = async (jobId) => {
    try {
        await (0, Careers_Repository_1.deleteAppliedJobRepo)(jobId);
        return "Applied Job Deleted Successfully!";
    }
    catch (err) {
        throw new Error("Service error: " + err.message);
    }
};
exports.deleteAppliedJobService = deleteAppliedJobService;

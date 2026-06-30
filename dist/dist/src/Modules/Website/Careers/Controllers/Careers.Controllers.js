"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAppliedJobController = exports.getAppliedJobsController = exports.unpublishJobController = exports.publishJobController = exports.deleteJobController = exports.applyJobController = exports.getJobByIdController = exports.getAllJobsController = exports.editJobController = exports.createJobController = void 0;
const Careers_Services_1 = require("../Services/Careers.Services");
const Api_1 = require("../../../../Api");
const createJobController = async (req, res, next) => {
    try {
        const createdBy = req?.user?._id;
        const draft = req?.query?.isDraft === "true" ? true : false;
        const published = draft ? false : true;
        const job = await (0, Careers_Services_1.createJobService)({ ...req.body, createdBy, published, draft });
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, "Job Created");
    }
    catch (err) {
        next(err);
    }
};
exports.createJobController = createJobController;
const editJobController = async (req, res, next) => {
    try {
        const id = req?.params?.id;
        const job = await (0, Careers_Services_1.editJobService)({ ...req.body }, id);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, "Job updated successfully!");
    }
    catch (err) {
        next(err);
    }
};
exports.editJobController = editJobController;
const getAllJobsController = async (req, res, next) => {
    try {
        const { isDraft = "false" } = req.query;
        const draft = isDraft === "true";
        const published = !draft;
        const reqFromLead = (req.headers["x-upload-type"] === "Lead") ? true : false;
        const { page = 1, limit = 10 } = req.query;
        const jobs = await (0, Careers_Services_1.getAllJobsService)(reqFromLead, Number(page), Number(limit), draft, published);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, jobs);
    }
    catch (err) {
        next(err);
    }
};
exports.getAllJobsController = getAllJobsController;
const getJobByIdController = async (req, res, next) => {
    try {
        const job = await (0, Careers_Services_1.getJobByIdService)(req.params.id);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, job);
    }
    catch (err) {
        next(err);
    }
};
exports.getJobByIdController = getJobByIdController;
const applyJobController = async (req, res, next) => {
    try {
        const fileName = req.file?.originalname;
        const fileKey = req.file?.key;
        const job = await (0, Careers_Services_1.applyJobService)({ ...req.body, fileKey, fileName });
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, { ...job.toObject(), fileKey });
    }
    catch (err) {
        next(err);
    }
};
exports.applyJobController = applyJobController;
const deleteJobController = async (req, res, next) => {
    try {
        const userId = req?.user?._id;
        const { id } = req.params;
        if (!userId) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.UNAUTHORIZED, "You are not logged in.");
        }
        ;
        if (!id) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.NOT_FOUND, "Job Id not found");
        }
        ;
        const result = await (0, Careers_Services_1.deleteJobService)(id);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, result);
    }
    catch (err) {
        next(err);
    }
};
exports.deleteJobController = deleteJobController;
const publishJobController = async (req, res, next) => {
    try {
        if (!req.params.id) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.NOT_FOUND, "Job Id not found");
        }
        const updated = await (0, Careers_Services_1.publishJobService)(req.params.id, true, false);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, "Job approved");
    }
    catch (error) {
        next(error);
    }
};
exports.publishJobController = publishJobController;
const unpublishJobController = async (req, res, next) => {
    try {
        if (!req.params.id) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.NOT_FOUND, "Job Id not found");
        }
        const updated = await (0, Careers_Services_1.unpublishJobService)(req.params.id, false, true);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, "Job unpublished");
    }
    catch (error) {
        next(error);
    }
};
exports.unpublishJobController = unpublishJobController;
const getAppliedJobsController = async (req, res, next) => {
    try {
        if (!req.params.id) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.NOT_FOUND, "Job Id not found");
        }
        if (!req?.user?._id) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.UNAUTHORIZED, "You are not logged in.");
        }
        const appliedJobs = await (0, Careers_Services_1.getAppliedJobsService)(req.params.id);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, appliedJobs);
    }
    catch (error) {
        next(error);
    }
};
exports.getAppliedJobsController = getAppliedJobsController;
const deleteAppliedJobController = async (req, res, next) => {
    try {
        const userId = req?.user?._id;
        const { id } = req.params;
        if (!userId) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.UNAUTHORIZED, "You are not logged in.");
        }
        ;
        if (!id) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.NOT_FOUND, "Applied Job Id not found");
        }
        ;
        const result = await (0, Careers_Services_1.deleteAppliedJobService)(id);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, result);
    }
    catch (err) {
        next(err);
    }
};
exports.deleteAppliedJobController = deleteAppliedJobController;

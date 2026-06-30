"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAppliedJobRepo = exports.getAppliedJobsRepository = exports.unpublishJobRepo = exports.publishJobRepo = exports.deleteJobRepo = exports.applyJobRepository = exports.getJobByIdRepository = exports.getAllJobsRepository = exports.editJobRepository = exports.createJobRepository = void 0;
const Careers_Modals_1 = require("../Modals/Careers.Modals");
const createJobRepository = async (data) => {
    try {
        return await Careers_Modals_1.JobModel.create(data);
    }
    catch (err) {
        throw new Error("Repo error: " + err.message);
    }
};
exports.createJobRepository = createJobRepository;
const editJobRepository = async (data, id) => {
    try {
        const job = await Careers_Modals_1.JobModel.findByIdAndUpdate(id, { $set: data });
        if (!job)
            throw new Error("Job not existed");
    }
    catch (err) {
        throw new Error("Repo error: " + err.message);
    }
};
exports.editJobRepository = editJobRepository;
const getAllJobsRepository = async (reqFromLead, page, limit, draft, published) => {
    try {
        let jobs = [];
        let query = Careers_Modals_1.JobModel.find({ draft, published });
        if (!reqFromLead) {
            jobs = query.select("jobTitle _id experience jobKey");
        }
        else {
            jobs = await Careers_Modals_1.JobModel.aggregate([
                {
                    $lookup: {
                        from: 'appliedjobs',
                        localField: '_id',
                        foreignField: 'jobId',
                        as: 'appliedCandidates'
                    }
                },
                {
                    $addFields: {
                        appliedCount: { $size: '$appliedCandidates' }
                    }
                },
                {
                    $project: {
                        appliedCandidates: 0
                    }
                },
                {
                    $sort: { updatedAt: -1 }
                },
                {
                    $match: { draft: draft, published: published }
                },
                {
                    $skip: (page - 1) * limit
                },
                {
                    $limit: limit
                }
            ]);
        }
        ;
        return jobs;
    }
    catch (err) {
        throw new Error("Repo error: " + err.message);
    }
};
exports.getAllJobsRepository = getAllJobsRepository;
const getJobByIdRepository = async (id) => {
    try {
        return await Careers_Modals_1.JobModel.findById(id);
    }
    catch (err) {
        throw new Error("Repo error: " + err.message);
    }
};
exports.getJobByIdRepository = getJobByIdRepository;
const applyJobRepository = async (data) => {
    try {
        return await Careers_Modals_1.AppliedJobModel.create(data);
    }
    catch (err) {
        throw new Error("Repo error: " + err.message);
    }
};
exports.applyJobRepository = applyJobRepository;
const deleteJobRepo = async (jobId) => {
    try {
        const gal = await Careers_Modals_1.JobModel.findById(jobId);
        if (!gal)
            throw new Error("Job not found!");
        await gal.deleteOne();
        return "Job deleted successfully!";
    }
    catch (err) {
        throw new Error(err.message);
    }
};
exports.deleteJobRepo = deleteJobRepo;
const publishJobRepo = async (id, published, draft) => {
    try {
        return await Careers_Modals_1.JobModel.findByIdAndUpdate(id, { published, draft });
    }
    catch (err) {
        throw new Error("Repo error: " + err.message);
    }
};
exports.publishJobRepo = publishJobRepo;
const unpublishJobRepo = async (id, published, draft) => {
    try {
        return await Careers_Modals_1.JobModel.findByIdAndUpdate(id, { published, draft });
    }
    catch (error) {
    }
};
exports.unpublishJobRepo = unpublishJobRepo;
const getAppliedJobsRepository = async (jobId) => {
    try {
        const jobs = Careers_Modals_1.AppliedJobModel.find({ jobId });
        return jobs;
    }
    catch (err) {
        throw new Error("Repo error: " + err.message);
    }
};
exports.getAppliedJobsRepository = getAppliedJobsRepository;
const deleteAppliedJobRepo = async (appliedJobId) => {
    try {
        const job = await Careers_Modals_1.AppliedJobModel.findById(appliedJobId);
        if (!job)
            throw new Error("Job not found!");
        await job.deleteOne();
        return "Applied Job deleted successfully!";
    }
    catch (err) {
        throw new Error(err.message);
    }
};
exports.deleteAppliedJobRepo = deleteAppliedJobRepo;

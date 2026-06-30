"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEstimateByLeadIdService = exports.updateExitingLeadEstimateService = exports.createExitingLeadEstimateService = exports.createLeadWithEstimateService = exports.updateDesignOptionService = exports.deleteDesignOptionService = exports.getSingleDesignOptionService = exports.getAllDesignOptionsService = exports.createDesignOptionService = void 0;
const sendEstimateTomail_1 = require("../../../../Services/sendEstimateTomail");
const Estimate_Modals_1 = require("../Modals/Estimate.Modals");
const Estimate_Repository_1 = require("../Repository/Estimate.Repository");
const createDesignOptionService = async (data) => {
    try {
        return await (0, Estimate_Repository_1.createDesignOptionRepository)(data);
    }
    catch (err) {
        throw new Error("Service error (createDesignOption): " + err.message);
    }
};
exports.createDesignOptionService = createDesignOptionService;
const getAllDesignOptionsService = async () => {
    try {
        return await (0, Estimate_Repository_1.getAllDesignOptionsRepository)();
    }
    catch (err) {
        throw new Error("Service error (getAllDesignOptions): " + err.message);
    }
};
exports.getAllDesignOptionsService = getAllDesignOptionsService;
const getSingleDesignOptionService = async (id) => {
    try {
        return await (0, Estimate_Repository_1.getSingleDesignOptionRepository)(id);
    }
    catch (err) {
        throw new Error("Service error (getSingleDesignOption): " + err.message);
    }
};
exports.getSingleDesignOptionService = getSingleDesignOptionService;
const deleteDesignOptionService = async (id) => {
    try {
        return await (0, Estimate_Repository_1.deleteDesignOptionRepository)(id);
    }
    catch (err) {
        throw new Error("Service error (deleteDesignOption): " + err.message);
    }
};
exports.deleteDesignOptionService = deleteDesignOptionService;
const updateDesignOptionService = async (id, data) => {
    try {
        return await (0, Estimate_Repository_1.updateDesignOptionRepository)(id, data);
    }
    catch (err) {
        throw new Error("Service error (updateDesignOption): " + err.message);
    }
};
exports.updateDesignOptionService = updateDesignOptionService;
const createLeadWithEstimateService = async (data) => {
    try {
        const { estimate } = await (0, Estimate_Repository_1.createLeadWithEstimateRepository)(data);
        return estimate._id;
    }
    catch (err) {
        throw new Error("Service Error (createLeadWithEstimate): " + err.message);
    }
};
exports.createLeadWithEstimateService = createLeadWithEstimateService;
const createExitingLeadEstimateService = async (data) => {
    try {
        const { estimate } = await (0, Estimate_Repository_1.createEstimateForExistingLeadRepo)(data);
        return estimate._id;
    }
    catch (err) {
        throw new Error("Service Error (createLeadWithEstimate): " + err.message);
    }
};
exports.createExitingLeadEstimateService = createExitingLeadEstimateService;
const updateExitingLeadEstimateService = async (estimateId, data) => {
    try {
        await (0, Estimate_Repository_1.updateForExistingLeadRepo)(estimateId, data);
    }
    catch (err) {
        throw new Error("Service Error (updateLeadWithEstimate): " + err.message);
    }
};
exports.updateExitingLeadEstimateService = updateExitingLeadEstimateService;
const getEstimateByLeadIdService = async (estimateId) => {
    const estimate = await Estimate_Modals_1.EstimateModel.findOne({ _id: estimateId })
        .populate("selectedDesignOptions")
        .populate("createdBy");
    (0, sendEstimateTomail_1.sendEstimateToAdmin)(estimate);
    // console.log(estimate?.createdBy,'check for estimmate')
    //  sendEmail(mailPayload);
    return estimate;
};
exports.getEstimateByLeadIdService = getEstimateByLeadIdService;

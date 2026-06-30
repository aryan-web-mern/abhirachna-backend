"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSurveyorLeadsController = exports.createLeadController = exports.approveLeadBySurveyorController = void 0;
const Api_1 = require("../../../../Api");
const Leads_Services_1 = require("../../Leads/Services/Leads.Services");
const approveLeadBySurveyorController = async (req, res, next) => {
    try {
        if (!req.params.id) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.NOT_FOUND, "Lead Id not found");
        }
        if (!req.query.isApproved) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.NOT_FOUND, "Approval status not found");
        }
        const approvedBySurveyor = req.query.isApproved === 'true' ? true : false;
        if (!req.user || !req.user._id) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.UNAUTHORIZED, "User not authenticated");
        }
        const loggedInUserId = req.user?._id;
        const updated = await (0, Leads_Services_1.approveLeadBySurveyorService)(req.params.id, approvedBySurveyor, loggedInUserId);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, "Lead updated Successfully");
    }
    catch (error) {
        next(error);
    }
};
exports.approveLeadBySurveyorController = approveLeadBySurveyorController;
const createLeadController = async (req, res, next) => {
    try {
        const leaddata = req.body;
        if (!req.user || !req.user._id) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.UNAUTHORIZED, "User not authenticated");
        }
        const userId = req.user._id;
        const data = { ...leaddata, createdBy: userId, leadtype: "manual" };
        const newLead = await (0, Leads_Services_1.createLeadService)(data);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, "Lead created successfully");
    }
    catch (error) {
        next(error);
    }
};
exports.createLeadController = createLeadController;
const getSurveyorLeadsController = async (req, res, next) => {
    const userId = req?.user?._id;
    const isApproved = req?.query?.isApproved ? req?.query?.isApproved === "true" ? true : false : "";
    const page = req?.query?.page;
    const limit = req?.query?.limit;
    try {
        if (!userId) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.UNAUTHORIZED, "User not authenticated");
        }
        const leads = await (0, Leads_Services_1.getSurveyorLeadsService)(userId, isApproved, Number(page), Number(limit));
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, leads);
    }
    catch (error) {
        next(error);
    }
};
exports.getSurveyorLeadsController = getSurveyorLeadsController;

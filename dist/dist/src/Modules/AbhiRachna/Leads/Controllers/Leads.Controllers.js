"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLastDiscountReq = exports.approvedDiscountReqManually = exports.approvedDiscountReq = exports.addDiscount = exports.createDiscountRequest = exports.removeCollaboratorsController = exports.getLeadLogsCountController = exports.createLeadIssueController = exports.getFilteredLeadsController = exports.getUpdatedLeadByIdController = exports.getTop3LeadMembersController = exports.addCollaboratorsController = exports.restoreLeadController = exports.approvedDesignByDesignerController = exports.getLeadStatsController = exports.getLeadByIdController = exports.getAllLeadMemberControler = exports.getAllLeads = exports.getAllLeadWithByStatus = exports.assignLeadController = exports.updateEstimateController = exports.updateLeadController = exports.createLeadController = void 0;
const Api_1 = require("../../../../Api");
const Leads_Services_1 = require("../Services/Leads.Services");
const Leads_Repository_1 = require("../Repository/Leads.Repository");
const createLeadController = async (req, res, next) => {
    try {
        const leaddata = req.body;
        if (!req.user || !req.user._id) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.UNAUTHORIZED, "User not authenticated");
        }
        const userId = req.user._id;
        const data = { ...leaddata, createdBy: userId };
        const newLead = await (0, Leads_Services_1.createLeadService)(data);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, "Lead created successfully");
    }
    catch (error) {
        next(error);
    }
};
exports.createLeadController = createLeadController;
const updateLeadController = async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.UNAUTHORIZED, "User not authenticated");
        }
        const userId = req.user._id;
        const leadId = req.params.id;
        const updates = req.body;
        if (!leadId) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.BAD_REQUEST, "Lead ID is required");
        }
        if (!updates) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.BAD_REQUEST, "Provide Some Data for update");
        }
        await (0, Leads_Services_1.updateLeadService)(leadId, updates, userId);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, "Lead updated successfully");
    }
    catch (error) {
        next(error);
    }
};
exports.updateLeadController = updateLeadController;
const updateEstimateController = async (req, res, next) => {
    try {
        const leadId = req.params.id;
        if (!req.user || !req.user._id) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.UNAUTHORIZED, "User not authenticated");
        }
        const userId = req.user._id;
        const { estimateDone } = req.body;
        if (!leadId) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.BAD_REQUEST, "Lead ID is required");
        }
        const updatedLead = await (0, Leads_Services_1.updateEstimateService)(leadId, estimateDone, userId);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, "Estimate updated successfully");
    }
    catch (error) {
        next(error);
    }
};
exports.updateEstimateController = updateEstimateController;
const assignLeadController = async (req, res, next) => {
    try {
        const leadId = req.params.id;
        if (!req.user || !req.user._id) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.UNAUTHORIZED, "User not authenticated");
        }
        const assignedBy = req.user._id;
        const { assignedTo } = req.body;
        const result = await (0, Leads_Services_1.assignLeadService)({ leadId, assignedTo, assignedBy });
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, "Lead assigned successfully");
    }
    catch (error) {
        next(error);
    }
};
exports.assignLeadController = assignLeadController;
const getAllLeadWithByStatus = async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.UNAUTHORIZED, "User not authenticated");
        }
        const userId = req?.user?._id;
        const userDesignation = req?.user?.designationId?.name;
        const { key, page, limit, approved } = req.query;
        const pageNumber = parseInt(page);
        const pageLimit = parseInt(limit);
        let filterIds = [];
        if (typeof req.query?.userIds === "string") {
            filterIds = req.query.userIds.split(",");
        }
        const leads = await (0, Leads_Services_1.getAllLeadServiceByStatus)(userDesignation, key, pageNumber, pageLimit, userId, filterIds, approved);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, leads);
    }
    catch (error) {
        next(error);
    }
};
exports.getAllLeadWithByStatus = getAllLeadWithByStatus;
const getAllLeads = async (req, res, next) => {
    try {
        console.log("reqdede", req);
        console.log("req.user", req.user);
        if (!req.user || !req.user._id) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.UNAUTHORIZED, "User not authenticated");
        }
        const { page, limit } = req.query;
        const pageNumber = parseInt(page);
        const pageLimit = parseInt(limit);
        const userId = req.user._id;
        const leads = await (0, Leads_Services_1.getAllUserLeadService)(pageNumber, pageLimit, userId);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, { data: leads });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllLeads = getAllLeads;
const getAllLeadMemberControler = async (req, res, next) => {
    try {
        const { leadId } = req.query;
        const membersdata = await (0, Leads_Services_1.getAllLeadMemberService)(leadId);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, membersdata);
    }
    catch (error) {
        next(error);
    }
};
exports.getAllLeadMemberControler = getAllLeadMemberControler;
const getLeadByIdController = async (req, res, next) => {
    try {
        const { leadId } = req.query;
        if (!leadId) {
            (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.BAD_REQUEST, "Must Be Provide Lead Id");
        }
        if (!req.user || !req.user._id) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.UNAUTHORIZED, "User not authenticated");
        }
        const userId = req?.user?._id;
        const leadResult = await (0, Leads_Services_1.getLeadByIdService)(leadId, userId);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, leadResult);
    }
    catch (error) {
        next(error);
    }
};
exports.getLeadByIdController = getLeadByIdController;
const getLeadStatsController = async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.UNAUTHORIZED, "User not authenticated");
        }
        const userDesignation = req?.user?.designationId?.name;
        const userId = req?.user?._id;
        const chart = req.query?.chart;
        const { filter = "weekly" } = req?.query;
        if (!chart)
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.BAD_REQUEST, "unable to find chart type");
        const leadResult = await (0, Leads_Services_1.getLeadStatsService)(userDesignation, userId, chart, filter);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, leadResult);
    }
    catch (error) {
        next(error);
    }
};
exports.getLeadStatsController = getLeadStatsController;
const approvedDesignByDesignerController = async (req, res, next) => {
    try {
        const leadId = req.params.id;
        const userId = req?.user?._id;
        if (!userId) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.UNAUTHORIZED, "User not authenticated");
        }
        if (!leadId) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.BAD_REQUEST, "Lead ID is required");
        }
        const updatedLead = await (0, Leads_Services_1.approvedDesignByDesignerService)(leadId, userId);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, "Approved");
    }
    catch (error) {
        next(error);
    }
};
exports.approvedDesignByDesignerController = approvedDesignByDesignerController;
const restoreLeadController = async (req, res, next) => {
    try {
        const leadId = req.params.id;
        const userId = req?.user?._id;
        if (!userId) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.UNAUTHORIZED, "User not authenticated");
        }
        if (!leadId) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.BAD_REQUEST, "Lead ID is required");
        }
        const updatedLead = await (0, Leads_Services_1.restoreLeadService)(leadId, userId);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, "Approved");
    }
    catch (error) {
        next(error);
    }
};
exports.restoreLeadController = restoreLeadController;
const addCollaboratorsController = async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.UNAUTHORIZED, "User not authenticated");
        }
        const { leadId, userIds } = req.body;
        const loggedInUserId = req.user?._id;
        if (!leadId || !Array.isArray(userIds) || userIds.length === 0) {
            return (0, Api_1.ErrorResponse)(res, 400, "leadId and userIds[] are required");
        }
        const result = await (0, Leads_Services_1.addCollaboratorsService)(leadId, userIds, loggedInUserId);
        return (0, Api_1.SuccessResponse)(res, 201, result);
    }
    catch (error) {
        next(error);
    }
};
exports.addCollaboratorsController = addCollaboratorsController;
const getTop3LeadMembersController = async (req, res, next) => {
    try {
        const { leadId } = req.params;
        if (!leadId) {
            return (0, Api_1.ErrorResponse)(res, 400, "leadId is required");
        }
        if (!req.user || !req.user._id) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.UNAUTHORIZED, "User not authenticated");
        }
        const userId = req.user?._id;
        const members = await (0, Leads_Services_1.getTop3LeadMembersService)(leadId, userId);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, members);
    }
    catch (error) {
        return (0, Api_1.ErrorResponse)(res, 500, error.message || "Something went wrong");
    }
};
exports.getTop3LeadMembersController = getTop3LeadMembersController;
const getUpdatedLeadByIdController = async (req, res, next) => {
    try {
        const { leadId } = req.params;
        if (!leadId) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.BAD_REQUEST, "Must Provide Lead Id");
        }
        if (!req.user || !req.user._id) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.UNAUTHORIZED, "User not authenticated");
        }
        const userId = req.user._id;
        const leadResult = await (0, Leads_Services_1.getUpdateLeadByIdService)(leadId, userId);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, leadResult);
    }
    catch (error) {
        next(error);
    }
};
exports.getUpdatedLeadByIdController = getUpdatedLeadByIdController;
const getFilteredLeadsController = async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.UNAUTHORIZED, "User not authenticated");
        }
        const { type, key } = req.query;
        const userDesignation = req?.user?.designationId?.name;
        const userId = req.user._id;
        const leadResult = await (0, Leads_Services_1.getFilteredLeadsService)(key, type, userId, userDesignation);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, leadResult);
    }
    catch (error) {
        next(error);
    }
};
exports.getFilteredLeadsController = getFilteredLeadsController;
const createLeadIssueController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { isIssue } = req.body;
        const issIssueBool = isIssue === true;
        if (!id) {
            return (0, Api_1.ErrorResponse)(res, 400, "Lead ID is required");
        }
        if (!req.user || !req.user._id) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.UNAUTHORIZED, "User not authenticated");
        }
        const userId = req.user._id;
        const userRole = req?.user?.designationId?.name;
        const result = await (0, Leads_Services_1.createLeadIssueService)(id, userId, issIssueBool, userRole);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, "Issue created successfully");
    }
    catch (error) {
        next(error);
    }
};
exports.createLeadIssueController = createLeadIssueController;
const getLeadLogsCountController = async (req, res, next) => {
    try {
        if (!req?.user) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.UNAUTHORIZED, "User not authenticated");
        }
        const { _id: userId, designationId } = req.user || {};
        const userDesignation = designationId?.name;
        const result = await (0, Leads_Repository_1.getLeadLogsCountRepository)(userId, userDesignation);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, result);
    }
    catch (error) {
        next(error);
    }
};
exports.getLeadLogsCountController = getLeadLogsCountController;
const removeCollaboratorsController = async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.UNAUTHORIZED, "User not authenticated");
        }
        const userId = req.user._id;
        const { leadId, collaboratorId } = req.body;
        if (!leadId || !collaboratorId) {
            return (0, Api_1.ErrorResponse)(res, 400, "Lead ID and Collaborator ID are required");
        }
        const result = await (0, Leads_Services_1.removeCollaboratorsService)(leadId, collaboratorId, userId);
        return (0, Api_1.SuccessResponse)(res, 200, "Collaborator removed successfully");
    }
    catch (error) {
        next(error);
    }
};
exports.removeCollaboratorsController = removeCollaboratorsController;
const createDiscountRequest = async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.UNAUTHORIZED, "User not authenticated");
        }
        const { quotation, discountPercent, leadName } = req.body;
        const requestedBy = req.user?._id;
        const leadId = req?.params?.id;
        if (!leadId)
            throw new Error("Lead Id not found");
        const result = await (0, Leads_Services_1.createDiscountRequestService)(leadId, requestedBy, Number(discountPercent), leadName, Number(quotation));
        return (0, Api_1.SuccessResponse)(res, 200, "Discount request Created succesfully!");
    }
    catch (error) {
        next(error);
    }
};
exports.createDiscountRequest = createDiscountRequest;
const addDiscount = async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.UNAUTHORIZED, "User not authenticated");
        }
        const { quotedPrice: quotation, totalDiscountPercentage: discountPercent } = req.body;
        const leadId = req?.params?.id;
        if (!leadId)
            throw new Error("Lead Id not found");
        const result = await (0, Leads_Services_1.addDiscountService)(leadId, Number(discountPercent), Number(quotation), req?.user?.designationId?.name);
        return (0, Api_1.SuccessResponse)(res, 200, "Discount added succesfully!");
    }
    catch (error) {
        next(error);
    }
};
exports.addDiscount = addDiscount;
// use for both approved and reject-- in reject case pass reject in payload
const approvedDiscountReq = async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.UNAUTHORIZED, "User not authenticated");
        }
        const ReqId = req?.params?.id;
        const reject = req?.query?.reject === "true" ? true : false;
        if (!ReqId)
            throw new Error("Request Id Id not found");
        const result = await (0, Leads_Services_1.approvedDiscountReqService)(ReqId, reject);
        return (0, Api_1.SuccessResponse)(res, 200, "Discount approved succesfully!");
    }
    catch (error) {
        next(error);
    }
};
exports.approvedDiscountReq = approvedDiscountReq;
const approvedDiscountReqManually = async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.UNAUTHORIZED, "User not authenticated");
        }
        const { leadId, discountBysalesman, discountByDirector, Quatation } = req.body;
        const ReqId = req?.params?.id;
        if (!ReqId)
            throw new Error("Request Id Id not found");
        const result = await (0, Leads_Services_1.approveDiscountReqManuallyService)(leadId, ReqId, Number(discountBysalesman), Number(discountByDirector), Number(Quatation));
        return (0, Api_1.SuccessResponse)(res, 200, "Discount approved succesfully!");
    }
    catch (error) {
        next(error);
    }
};
exports.approvedDiscountReqManually = approvedDiscountReqManually;
const getLastDiscountReq = async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.UNAUTHORIZED, "User not authenticated");
        }
        const leadId = req?.params?.id;
        if (!leadId)
            throw new Error("Lead Id Id not found");
        const result = await (0, Leads_Services_1.getLastDiscountReqService)(leadId);
        return (0, Api_1.SuccessResponse)(res, 200, result || null);
    }
    catch (error) {
        next(error);
    }
};
exports.getLastDiscountReq = getLastDiscountReq;

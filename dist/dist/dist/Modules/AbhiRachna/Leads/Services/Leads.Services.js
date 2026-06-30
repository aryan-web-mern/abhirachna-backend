"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLastDiscountReqService = exports.approveDiscountReqManuallyService = exports.approvedDiscountReqService = exports.addDiscountService = exports.createDiscountRequestService = exports.removeCollaboratorsService = exports.createLeadIssueService = exports.getLeadLogsCountService = exports.getUpdateLeadByIdService = exports.getTop3LeadMembersService = exports.addCollaboratorsService = exports.getFilteredLeadsService = exports.restoreLeadService = exports.approvedDesignByDesignerService = exports.getLeadStatsService = exports.getLeadByIdService = exports.getAllLeadMemberService = exports.getAllUserLeadService = exports.getAllLeadServiceByStatus = exports.assignLeadService = exports.updateEstimateService = exports.updateLeadService = exports.createLeadService = void 0;
const Leads_Repository_1 = require("../Repository/Leads.Repository");
const createLeadService = async (leadData) => {
    try {
        const lead = await (0, Leads_Repository_1.createLeadRepository)(leadData);
        return lead;
    }
    catch (error) {
        throw new Error("Error during creating lead in service layer: " + error.message);
    }
};
exports.createLeadService = createLeadService;
const updateLeadService = async (leadId, updates, userId) => {
    try {
        await (0, Leads_Repository_1.updateLeadRepository)(leadId, updates, userId);
        if ("referenceType" in updates) {
            await (0, Leads_Repository_1.updateReferenceDetailsRepository)(leadId, updates.referenceType, updates.referenceBy, updates?.refereeName, updates?.refrenceNumber);
        }
        if ("alternativeDetails" in updates && updates.alternativeDetails) {
            await (0, Leads_Repository_1.updateAltDetailsRepository)(leadId, updates.alternativeDetails);
        }
        if ("status" in updates) {
            await (0, Leads_Repository_1.updateLeadRepository)(leadId, updates, userId);
        }
        return;
    }
    catch (error) {
        console.log(error, 'check for error>>');
        throw new Error("Error during lead update in service layer");
    }
};
exports.updateLeadService = updateLeadService;
const updateEstimateService = async (leadId, estimateDone = true, userId) => {
    try {
        return await (0, Leads_Repository_1.updateEstimateRepository)(leadId, estimateDone, userId);
    }
    catch (error) {
        throw new Error("Error during estimate update in service layer");
    }
};
exports.updateEstimateService = updateEstimateService;
const assignLeadService = async ({ leadId, assignedTo, assignedBy, }) => {
    try {
        return await (0, Leads_Repository_1.assignLeadRepository)(leadId, assignedTo, assignedBy);
    }
    catch (error) {
        throw new Error("Error while assigning lead Service layer");
    }
};
exports.assignLeadService = assignLeadService;
const getAllLeadServiceByStatus = async (userDesignation, key, page, limit, userId, filterIds, approved) => {
    try {
        return await (0, Leads_Repository_1.getAllLeadRepoByStatus)(userDesignation, key, page, limit, userId, filterIds, approved);
    }
    catch (error) {
        throw new Error("Error While getting Lead With Status");
    }
};
exports.getAllLeadServiceByStatus = getAllLeadServiceByStatus;
const getAllUserLeadService = async (page, limit, userId) => {
    try {
        return await (0, Leads_Repository_1.getAllUserLeadRepo)(page, limit, userId);
    }
    catch (error) {
        throw new Error("Error While getting Lead With Status");
    }
};
exports.getAllUserLeadService = getAllUserLeadService;
const getAllLeadMemberService = async (leadId) => {
    try {
        return await (0, Leads_Repository_1.getAllLeadMemberRepo)(leadId);
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.getAllLeadMemberService = getAllLeadMemberService;
const getLeadByIdService = async (leadId, userId) => {
    try {
        return await (0, Leads_Repository_1.getLeadByIdRepo)(leadId, userId);
    }
    catch (error) {
        throw new Error("Error While getting Lead Details");
    }
};
exports.getLeadByIdService = getLeadByIdService;
const getLeadStatsService = async (userDesignation, userId, chart, filter) => {
    try {
        return await (0, Leads_Repository_1.getLeadStatsRepo)(userDesignation, userId, chart, filter);
    }
    catch (error) {
        throw new Error("Error While getting Lead stats");
    }
};
exports.getLeadStatsService = getLeadStatsService;
const approvedDesignByDesignerService = async (leadId, userId) => {
    try {
        return await (0, Leads_Repository_1.approvedDesignByDesignerRepository)(leadId, userId);
    }
    catch (error) {
        throw new Error(error?.message || "Error during estimate update in service layer");
    }
};
exports.approvedDesignByDesignerService = approvedDesignByDesignerService;
const restoreLeadService = async (leadId, userId) => {
    try {
        return await (0, Leads_Repository_1.restoreLeadRepository)(leadId, userId);
    }
    catch (error) {
        throw new Error(error?.message || "Error during estimate update in service layer");
    }
};
exports.restoreLeadService = restoreLeadService;
const getFilteredLeadsService = async (key, type, userId, userDesignation) => {
    try {
        return await (0, Leads_Repository_1.getFilteredLeadsRepo)(key, type, userId, userDesignation);
    }
    catch (error) {
        console.log(error);
        throw new Error(error?.message || "Error during fetching leads");
    }
};
exports.getFilteredLeadsService = getFilteredLeadsService;
const addCollaboratorsService = async (leadId, userIds, loggedInUserId) => {
    try {
        if (!leadId || userIds.length === 0) {
            throw new Error("LeadId and userIds are required");
        }
        return await (0, Leads_Repository_1.addCollaboratorsRepo)(leadId, userIds, loggedInUserId);
    }
    catch (error) {
        throw error;
    }
};
exports.addCollaboratorsService = addCollaboratorsService;
const getTop3LeadMembersService = async (leadId, userId) => {
    try {
        return await (0, Leads_Repository_1.getTop3LeadMembersRepo)(leadId, userId);
    }
    catch (error) {
        throw new Error(error.message || "Service failed while fetching members");
    }
};
exports.getTop3LeadMembersService = getTop3LeadMembersService;
const getUpdateLeadByIdService = async (leadId, userId) => {
    try {
        return await (0, Leads_Repository_1.getupdatedLeadByIdRepo)(leadId, userId);
    }
    catch (error) {
        throw new Error("Error while getting Lead Details (Service Layer)");
    }
};
exports.getUpdateLeadByIdService = getUpdateLeadByIdService;
const getLeadLogsCountService = async (userId, userDesignation) => {
    try {
        return await (0, Leads_Repository_1.getLeadLogsCountRepository)(userId, userDesignation);
    }
    catch (error) {
        throw new Error("Error during estimate update in service layer");
    }
};
exports.getLeadLogsCountService = getLeadLogsCountService;
const createLeadIssueService = async (leadId, userId, issIssueBool, userRole) => {
    try {
        return await (0, Leads_Repository_1.createLeadIssueRepository)(leadId, userId, issIssueBool, userRole);
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.createLeadIssueService = createLeadIssueService;
const removeCollaboratorsService = async (leadId, userIds, loggedInUserId) => {
    try {
        if (!leadId || userIds.length === 0) {
            throw new Error("LeadId and userIds are required");
        }
        return await (0, Leads_Repository_1.removeCollaboratorsRepo)(leadId, userIds, loggedInUserId);
    }
    catch (error) {
        throw new Error(error?.message || "Error while removing collaborators (Service Layer)");
    }
};
exports.removeCollaboratorsService = removeCollaboratorsService;
const createDiscountRequestService = async (leadId, requestedBy, discountPercent, leadName, quotation) => {
    try {
        return await (0, Leads_Repository_1.createDiscountRequestRepo)(leadId, requestedBy, discountPercent, leadName, quotation);
    }
    catch (error) {
        console.log(error);
        throw new Error("Error While adding request");
    }
};
exports.createDiscountRequestService = createDiscountRequestService;
const addDiscountService = async (leadId, discountPercent, quotation, userDesignation) => {
    try {
        return await (0, Leads_Repository_1.addDiscountRepo)(leadId, discountPercent, quotation, userDesignation);
    }
    catch (error) {
        console.log(error);
        throw new Error(error?.message || "Error While adding discount");
    }
};
exports.addDiscountService = addDiscountService;
const approvedDiscountReqService = async (id, reject) => {
    try {
        return await (0, Leads_Repository_1.approvedDiscountReqRepo)(id, reject);
    }
    catch (error) {
        console.log(error);
        throw new Error(error?.message || "Error While adding request");
    }
};
exports.approvedDiscountReqService = approvedDiscountReqService;
const approveDiscountReqManuallyService = async (leadId, reqId, discountBysalesman, discountByDirector, Quatation) => {
    try {
        return await (0, Leads_Repository_1.approveDiscountReqManuallyRepo)(leadId, reqId, discountBysalesman, discountByDirector, Quatation);
    }
    catch (error) {
        console.log(error);
        throw new Error(error?.message || "Error While adding request");
    }
};
exports.approveDiscountReqManuallyService = approveDiscountReqManuallyService;
const getLastDiscountReqService = async (leadId) => {
    try {
        return await (0, Leads_Repository_1.getLastDiscountReqRepo)(leadId);
    }
    catch (error) {
        console.log(error);
        throw new Error(error?.message || "Error While adding request");
    }
};
exports.getLastDiscountReqService = getLastDiscountReqService;

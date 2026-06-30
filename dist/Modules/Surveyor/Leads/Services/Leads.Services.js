"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSurveyorLeadsService = exports.createLeadService = exports.approveLeadBySurveyorService = void 0;
const Leads_Repository_1 = require("../Repository/Leads.Repository");
const approveLeadBySurveyorService = async (id, approvedBySurveyor, loggedInUserId) => {
    try {
        await (0, Leads_Repository_1.approveLeadBySurveyorRepo)(id, approvedBySurveyor, loggedInUserId);
        return "Lead updated Successfully!";
    }
    catch (err) {
        throw new Error(err.message);
    }
};
exports.approveLeadBySurveyorService = approveLeadBySurveyorService;
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
const getSurveyorLeadsService = async (surveyorId, isApproved, page = 1, limit = 10) => {
    try {
        const leads = await (0, Leads_Repository_1.getSurveyorLeadsRepository)(surveyorId, isApproved, page, limit);
        return leads;
    }
    catch (error) {
        throw new Error("Error during fetching leads in service layer: " + error.message);
    }
};
exports.getSurveyorLeadsService = getSurveyorLeadsService;

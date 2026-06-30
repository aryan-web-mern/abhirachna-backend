"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.approveNegoByDirectorRepository = exports.approveDesigningByDirectorRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Leads_Modals_1 = require("../../../AbhiRachna/Leads/Modals/Leads.Modals");
const approveDesigningByDirectorRepository = async (leadId, userId, isToken) => {
    try {
        const leadDetails = await Leads_Modals_1.LeadBasicDetailsModel.findOne({ leadId });
        const lead = await Leads_Modals_1.LeadModel.findById(leadId);
        if (!leadDetails) {
            throw new Error("Lead details not found");
        }
        if (!lead) {
            throw new Error("Lead details not found");
        }
        if (lead.status.toLowerCase() !== "designing") {
            throw new Error("Lead status is not Designing");
        }
        if (!leadDetails.tokenReceived) {
            throw new Error("Token not received. Cannot approve.");
        }
        if (leadDetails.approvedTokenBydirector) {
            throw new Error("Already Approved");
        }
        leadDetails.approvedTokenBydirector = isToken;
        lead.updatedBy = new mongoose_1.default.Types.ObjectId(userId);
        await leadDetails.save();
        await lead.save();
        return leadDetails;
    }
    catch (error) {
        throw new Error("Repository Error (approveDesigningByDirector): " + error.message);
    }
};
exports.approveDesigningByDirectorRepository = approveDesigningByDirectorRepository;
const approveNegoByDirectorRepository = async (leadId, userId, isToken) => {
    try {
        const leadDetails = await Leads_Modals_1.LeadBasicDetailsModel.findOne({ leadId });
        const lead = await Leads_Modals_1.LeadModel.findById(leadId);
        if (!leadDetails) {
            throw new Error("Lead details not found");
        }
        if (!lead) {
            throw new Error("Lead details not found");
        }
        if (lead.status.toLowerCase() !== "negotiation") {
            throw new Error("Lead status is not Designing");
        }
        if (leadDetails.negoApproved) {
            throw new Error("Already Approved");
        }
        leadDetails.negoApproved = isToken;
        lead.updatedBy = new mongoose_1.default.Types.ObjectId(userId);
        await leadDetails.save();
        await lead.save();
        return leadDetails;
    }
    catch (error) {
        throw new Error("Repository Error (approveDesigningByDirector): " + error.message);
    }
};
exports.approveNegoByDirectorRepository = approveNegoByDirectorRepository;

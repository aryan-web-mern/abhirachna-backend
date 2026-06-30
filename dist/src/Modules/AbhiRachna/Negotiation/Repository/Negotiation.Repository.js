"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLeadToNegotiationRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Leads_Modals_1 = require("../../Leads/Modals/Leads.Modals");
const TalkingLead_Modals_1 = require("../../TalkingLead/Modals/TalkingLead.Modals");
const updateLeadToNegotiationRepository = async (leadId, commentNegotiation, documents, Quatation, employeeId, role) => {
    try {
        const lead = await Leads_Modals_1.LeadModel.findById(leadId);
        if (!lead)
            throw new Error("Lead not found");
        if (lead.status.toLowerCase() !== "designing") {
            throw new Error("Lead must be in 'designing' state to move to negotiation");
        }
        const leadDetails = await Leads_Modals_1.LeadBasicDetailsModel.findOne({ leadId });
        if (!leadDetails?.approvedTokenBydirector && role !== "director") {
            throw new Error("Director has not approved this lead");
        }
        if (!leadDetails?.approvedDesignByDesigner) {
            throw new Error("Designer has not approved this lead");
        }
        const existingCollabs = await TalkingLead_Modals_1.CollaborationModel.find({ leadId });
        const memberIds = existingCollabs.map((c) => c.memberId.toString());
        // Change lead status
        lead.status = "negotiation";
        lead.updatedBy = new mongoose_1.default.Types.ObjectId(employeeId);
        await lead.save();
        // Update lead details
        leadDetails.commnetnNegatiation = commentNegotiation;
        leadDetails.Quatation = Quatation;
        if (documents?.length) {
            leadDetails.documents = documents;
        }
        await leadDetails.save();
        return { message: "Lead moved to negotiation and quotation added successfully" };
    }
    catch (error) {
        throw new Error("Repository Error (negotiation): " + error.message);
    }
};
exports.updateLeadToNegotiationRepository = updateLeadToNegotiationRepository;

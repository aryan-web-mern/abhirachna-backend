"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLeadToClosedRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Leads_Modals_1 = require("../../Leads/Modals/Leads.Modals");
const TalkingLead_Modals_1 = require("../../TalkingLead/Modals/TalkingLead.Modals");
const updateLeadToClosedRepository = async ({ Quatation, discountBysalesman, totalDiscount, amountAfterDiscount, discountByDirector, userDesignation, leadId, documents, employeeId, userId }) => {
    try {
        const lead = await Leads_Modals_1.LeadModel.findById(leadId);
        if (!lead)
            throw new Error("Lead not found");
        if (lead.status.toLowerCase() !== "negotiation") {
            throw new Error("Lead must be in 'negotiation' state to move to closed");
        }
        const leadDetails = await Leads_Modals_1.LeadBasicDetailsModel.findOne({ leadId });
        if (!leadDetails) {
            throw new Error("Lead Basic Details not found");
        }
        if (userDesignation.toLowerCase() !== "director") {
            if (!leadDetails?.approvedTokenBydirector) {
                throw new Error("Director has not approved this lead");
            }
            if (!leadDetails?.negoApproved) {
                throw new Error("Director has not approved this lead");
            }
            const existingCollabs = await TalkingLead_Modals_1.CollaborationModel.find({ leadId });
            const memberIds = existingCollabs.map((c) => c.memberId.toString());
            const isAuthorized = lead.assignedTo.toString() === employeeId.toString() ||
                memberIds.includes(employeeId.toString());
            if (!isAuthorized) {
                throw new Error("You are not authorized to update this lead to negotiation");
            }
        }
        if (userDesignation !== "director" && leadDetails.salesmanDiscount < discountBysalesman)
            throw new Error(`You have already given the ${leadDetails.salesmanDiscount}% discount.`);
        leadDetails.discountBysalesman = discountBysalesman;
        leadDetails.amountAfterDiscount = amountAfterDiscount;
        leadDetails.Quatation = Quatation;
        leadDetails.totalDiscount = totalDiscount;
        if (userDesignation === "director") {
            leadDetails.addDiscountByDirector = true;
            leadDetails.discountByDirector = discountByDirector;
        }
        leadDetails.employeeId = new mongoose_1.default.Types.ObjectId(employeeId);
        if (documents?.length) {
            leadDetails.closedDocuments = documents;
        }
        // Change lead status
        lead.status = "closed";
        lead.updatedBy = new mongoose_1.default.Types.ObjectId(userId);
        const res = await leadDetails.save();
        await lead.save();
        return;
    }
    catch (error) {
        console.log(error);
        throw new Error("Repository Error (closed): " + error.message);
    }
};
exports.updateLeadToClosedRepository = updateLeadToClosedRepository;

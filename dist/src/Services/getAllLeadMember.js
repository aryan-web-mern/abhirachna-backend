"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllLeadMembers = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Leads_Modals_1 = require("../Modules/AbhiRachna/Leads/Modals/Leads.Modals");
const TalkingLead_Modals_1 = require("../Modules/AbhiRachna/TalkingLead/Modals/TalkingLead.Modals");
const getAllLeadMembers = async (leadId) => {
    const leadObjectId = mongoose_1.default.Types.ObjectId.isValid(leadId)
        ? new mongoose_1.default.Types.ObjectId(leadId)
        : leadId;
    const lead = await TalkingLead_Modals_1.CollaborationModel.find({ leadId: leadObjectId });
    const leadDoc = await Leads_Modals_1.LeadModel.findOne({ _id: leadObjectId });
    const assignedMemberIds = Array.isArray(leadDoc?.assignedTo)
        ? leadDoc.assignedTo.map((id) => id.toString())
        : leadDoc?.assignedTo
            ? [leadDoc.assignedTo.toString()]
            : [];
    const collaboratorIds = lead.map((member) => member.memberId.toString());
    const uniqueMemberIds = [...new Set([...collaboratorIds, ...assignedMemberIds])];
    return uniqueMemberIds;
};
exports.getAllLeadMembers = getAllLeadMembers;

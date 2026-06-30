"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateToTalkingRepository = void 0;
const Leads_Modals_1 = require("../../../AbhiRachna/Leads/Modals/Leads.Modals");
const mongoose_1 = __importDefault(require("mongoose"));
const TalkingLead_Modals_1 = require("../Modals/TalkingLead.Modals");
const updateToTalkingRepository = async (leadId, userId, leadQuality, commentsTalking, memberIds = [], assignedSurveyor, role) => {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const lead = await Leads_Modals_1.LeadModel.findById(leadId).session(session);
        if (!lead) {
            throw new Error("Lead not found");
        }
        // if (lead?.assignedTo?.toString() !== userId?.toString()) {
        //   throw new Error("Only assigned user can update this lead");
        // }
        if (role === "director") {
            throw new Error("Director Dont Move Lead To Talking");
        }
        if (lead.status.toLowerCase() !== "assigned") {
            throw new Error("Lead is not in assigned state");
        }
        if (!lead.estimateDone) {
            throw new Error("Estimate must be completed before moving to talking");
        }
        lead.status = "talking";
        lead.updatedBy = new mongoose_1.default.Types.ObjectId(userId);
        if (assignedSurveyor)
            lead.assignedSurveyor = new mongoose_1.default.Types.ObjectId(assignedSurveyor);
        await lead.save({ session });
        const approvedBySurveyor = assignedSurveyor ? false : true;
        await Leads_Modals_1.LeadBasicDetailsModel.create([{
                leadId,
                leadQuality,
                commentsTalking,
                approvedBySurveyor
            }], { session });
        //check for user
        if (!memberIds.includes(userId)) {
            memberIds.push(userId);
        }
        const collaborationDocs = memberIds.map(memberId => ({
            leadId,
            memberId,
            addedBy: userId,
        }));
        await TalkingLead_Modals_1.CollaborationModel.insertMany(collaborationDocs, { session });
        await session.commitTransaction();
        session.endSession();
    }
    catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw new Error(`Repository Error: ${error.message}`);
    }
};
exports.updateToTalkingRepository = updateToTalkingRepository;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDesigningStatusRepository = void 0;
const Leads_Modals_1 = require("../../../AbhiRachna/Leads/Modals/Leads.Modals");
const TalkingLead_Modals_1 = require("../../../AbhiRachna/TalkingLead/Modals/TalkingLead.Modals");
const mongoose_1 = __importDefault(require("mongoose"));
const updateDesigningStatusRepository = async (leadId, designerIds, tokenReceived, employeeId, role) => {
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const leadAltDetail = await Leads_Modals_1.LeadBasicDetailsModel.findOne({
            leadId,
        }).populate("leadId");
        const lead = leadAltDetail?.leadId;
        if (!leadAltDetail?.approvedBySurveyor)
            throw new Error("Yet Surveyor not updated the status of this lead");
        if (!lead)
            throw new Error("Lead not found");
        if (lead.status.toLowerCase() !== "talking") {
            throw new Error("Lead must be in talking state");
        }
        const existingCollabs = await TalkingLead_Modals_1.CollaborationModel.find({ leadId }).session(session);
        const memberIds = existingCollabs.map((collab) => collab.memberId.toString());
        lead.status = "designing";
        lead.updatedBy = new mongoose_1.default.Types.ObjectId(employeeId);
        lead.assignedDesigner = new mongoose_1.default.Types.ObjectId(designerIds[0]);
        await lead.save({ session });
        await Leads_Modals_1.LeadBasicDetailsModel.updateOne({ leadId }, {
            $set: { tokenReceived, approvedTokenBydirector: role === "director" },
            // $addToSet: {
            //   designers: { $each: designerIds },
            // },//if create issue than uncomment this code
        }, { session });
        const collabDocs = designerIds.map((designerId) => ({
            leadId,
            addedBy: employeeId,
            memberId: designerId,
        }));
        await TalkingLead_Modals_1.CollaborationModel.insertMany(collabDocs, { session });
        await session.commitTransaction();
        session.endSession();
        return {
            message: "Status updated to designing, designers added, and log created successfully",
        };
    }
    catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw new Error("Error during repository operation: " + error.message);
    }
};
exports.updateDesigningStatusRepository = updateDesigningStatusRepository;

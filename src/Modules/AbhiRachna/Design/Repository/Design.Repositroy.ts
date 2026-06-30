import {
  ILead,
  LeadBasicDetailsModel,
  LeadUpdateLogsModel,
} from "../../../AbhiRachna/Leads/Modals/Leads.Modals";
import { CollaborationModel } from "../../../AbhiRachna/TalkingLead/Modals/TalkingLead.Modals";

import mongoose from "mongoose";

export const updateDesigningStatusRepository = async (
  leadId: string,
  designerIds: string[],
  tokenReceived: boolean,
  employeeId: string,
  role: string
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const leadAltDetail = await LeadBasicDetailsModel.findOne({
      leadId,
    }).populate("leadId");
    const lead = leadAltDetail?.leadId as ILead | undefined;

    if (!leadAltDetail?.approvedBySurveyor)
      throw new Error("Yet Surveyor not updated the status of this lead");
    if (!lead) throw new Error("Lead not found");

    if (lead.status.toLowerCase() !== "talking") {
      throw new Error("Lead must be in talking state");
    }

    const existingCollabs = await CollaborationModel.find({ leadId }).session(
      session
    );
    const memberIds = existingCollabs.map((collab) =>
      collab.memberId.toString()
    );

    lead.status = "designing";
    lead.updatedBy = new mongoose.Types.ObjectId(employeeId);
    lead.assignedDesigner = new mongoose.Types.ObjectId(designerIds[0]);
    await lead.save({ session });

    await LeadBasicDetailsModel.updateOne(
      { leadId },
      {
        $set: { tokenReceived, approvedTokenBydirector: role === "director" },
        // $addToSet: {
        //   designers: { $each: designerIds },
        // },//if create issue than uncomment this code
      },
      { session }
    );

    const collabDocs = designerIds.map((designerId) => ({
      leadId,
      addedBy: employeeId,
      memberId: designerId,
    }));
    await CollaborationModel.insertMany(collabDocs, { session });

    await session.commitTransaction();
    session.endSession();

    return {
      message:
        "Status updated to designing, designers added, and log created successfully",
    };
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new Error("Error during repository operation: " + error.message);
  }
};

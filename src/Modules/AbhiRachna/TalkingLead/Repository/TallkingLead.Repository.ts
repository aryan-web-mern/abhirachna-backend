import { LeadBasicDetailsModel, LeadModel } from "../../../AbhiRachna/Leads/Modals/Leads.Modals";
import { ErrorResponse, STATUS_CODE } from "../../../../Api"

import mongoose from "mongoose";
import { CollaborationModel } from "../Modals/TalkingLead.Modals";


export const updateToTalkingRepository = async (
  leadId: string,
  userId: string,
  leadQuality: "cold" | "hot" | "medium",
  commentsTalking: string,
  memberIds: string[] = [],
  assignedSurveyor: string,
  role?:string
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const lead = await LeadModel.findById(leadId).session(session);
    if (!lead) {
      throw new Error("Lead not found");
    }

    // if (lead?.assignedTo?.toString() !== userId?.toString()) {
    //   throw new Error("Only assigned user can update this lead");
    // }

  if(role==="director"){
    throw new Error("Director Dont Move Lead To Talking")
  }

    if (lead.status.toLowerCase() !== "assigned") {
      throw new Error("Lead is not in assigned state");
    }

    if (!lead.estimateDone) {
      throw new Error("Estimate must be completed before moving to talking");
    }



    lead.status = "talking";
    lead.updatedBy=new mongoose.Types.ObjectId(userId);
    if(assignedSurveyor) lead.assignedSurveyor = new mongoose.Types.ObjectId(assignedSurveyor);

    await lead.save({ session });

         const approvedBySurveyor=assignedSurveyor?false:true;
    await LeadBasicDetailsModel.create([{
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



    await CollaborationModel.insertMany(collaborationDocs, { session });

    await session.commitTransaction();
    session.endSession();
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(`Repository Error: ${error.message}`);
  }
};

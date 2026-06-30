
import mongoose from "mongoose";
import { LeadModel } from "../Modules/AbhiRachna/Leads/Modals/Leads.Modals";
import { CollaborationModel } from "../Modules/AbhiRachna/TalkingLead/Modals/TalkingLead.Modals";



export const getAllLeadMembers = async (leadId: string) => {
  const leadObjectId = mongoose.Types.ObjectId.isValid(leadId)
    ? new mongoose.Types.ObjectId(leadId)
    : leadId;


  const lead = await CollaborationModel.find({ leadId: leadObjectId });


  const leadDoc = await LeadModel.findOne({ _id: leadObjectId });


  const assignedMemberIds = Array.isArray(leadDoc?.assignedTo)
    ? leadDoc.assignedTo.map((id: any) => id.toString())
    : leadDoc?.assignedTo
    ? [leadDoc.assignedTo.toString()]
    : [];

 
  const collaboratorIds = lead.map((member: any) => member.memberId.toString());


  const uniqueMemberIds = [...new Set([...collaboratorIds, ...assignedMemberIds])];

  return uniqueMemberIds; 
};


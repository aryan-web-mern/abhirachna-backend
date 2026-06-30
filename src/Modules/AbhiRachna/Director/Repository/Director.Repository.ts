import mongoose from "mongoose";
import {
  LeadBasicDetailsModel,
  LeadModel,
} from "../../../AbhiRachna/Leads/Modals/Leads.Modals";

export const approveDesigningByDirectorRepository = async (
  leadId: string,
  userId: string,
  isToken: boolean
) => {
  try {
    const leadDetails = await LeadBasicDetailsModel.findOne({ leadId });
    const lead = await LeadModel.findById(leadId);

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
    lead.updatedBy = new mongoose.Types.ObjectId(userId);
    await leadDetails.save();
    await lead.save();

    return leadDetails;
  } catch (error: any) {
    throw new Error(
      "Repository Error (approveDesigningByDirector): " + error.message
    );
  }
};

export const approveNegoByDirectorRepository = async (
  leadId: string,
  userId: string,
  isToken: boolean
) => {
  try {
    const leadDetails = await LeadBasicDetailsModel.findOne({ leadId });
    const lead = await LeadModel.findById(leadId);

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
    lead.updatedBy = new mongoose.Types.ObjectId(userId);
    await leadDetails.save();
    await lead.save();

    return leadDetails;
  } catch (error: any) {
    throw new Error(
      "Repository Error (approveDesigningByDirector): " + error.message
    );
  }
};

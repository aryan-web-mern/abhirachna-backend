import mongoose from "mongoose";
import { LeadBasicDetailsModel, LeadModel } from "../../Leads/Modals/Leads.Modals";
import { CollaborationModel } from "../../TalkingLead/Modals/TalkingLead.Modals";

export const updateLeadToNegotiationRepository = async (
  leadId: string,
  commentNegotiation: string,
  documents: string[] | undefined,
  Quatation: number,
  employeeId: string,
  role?:string
) => {
  try {
    const lead = await LeadModel.findById(leadId);
    if (!lead) throw new Error("Lead not found");

    if (lead.status.toLowerCase() !== "designing") {
      throw new Error("Lead must be in 'designing' state to move to negotiation");
    }

    const leadDetails = await LeadBasicDetailsModel.findOne({ leadId });
    if (!leadDetails?.approvedTokenBydirector && role!=="director") {
      throw new Error("Director has not approved this lead");
    }

    if (!leadDetails?.approvedDesignByDesigner) {
      throw new Error("Designer has not approved this lead");
    }

    const existingCollabs = await CollaborationModel.find({ leadId });
    const memberIds = existingCollabs.map((c) => c.memberId.toString());



    // Change lead status
    lead.status = "negotiation";
    lead.updatedBy=new mongoose.Types.ObjectId(employeeId)
    await lead.save();

    // Update lead details
    leadDetails.commnetnNegatiation = commentNegotiation;
    leadDetails.Quatation = Quatation;

    if (documents?.length) {
      leadDetails.documents = documents;
    }

    await leadDetails.save();

    return { message: "Lead moved to negotiation and quotation added successfully" };
  } catch (error: any) {
    throw new Error("Repository Error (negotiation): " + error.message);
  }
};

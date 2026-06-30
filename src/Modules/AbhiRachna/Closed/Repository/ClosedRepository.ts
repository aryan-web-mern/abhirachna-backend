import mongoose from "mongoose";
import { LeadBasicDetailsModel, LeadModel } from "../../Leads/Modals/Leads.Modals";
import { CollaborationModel } from "../../TalkingLead/Modals/TalkingLead.Modals";

import { IupdateLeadToClosed } from "../Services/ClosedServices";

export const updateLeadToClosedRepository = async ({
  Quatation,
  discountBysalesman,
  totalDiscount,
  amountAfterDiscount,
  discountByDirector,
  userDesignation,
  leadId,
  documents,
  employeeId,
  userId
}: IupdateLeadToClosed

) => {
  try {
    const lead = await LeadModel.findById(leadId);
    if (!lead) throw new Error("Lead not found");

    if (lead.status.toLowerCase() !== "negotiation") {
      throw new Error("Lead must be in 'negotiation' state to move to closed");
    }

    const leadDetails = await LeadBasicDetailsModel.findOne({ leadId });

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

      const existingCollabs = await CollaborationModel.find({ leadId });
      const memberIds = existingCollabs.map((c) => c.memberId.toString());

      const isAuthorized =
        lead.assignedTo.toString() === employeeId.toString() ||
        memberIds.includes(employeeId.toString());

      if (!isAuthorized) {
        throw new Error("You are not authorized to update this lead to negotiation");
      }
    }

    if (userDesignation !== "director" && leadDetails.salesmanDiscount < discountBysalesman) throw new Error(`You have already given the ${leadDetails.salesmanDiscount}% discount.`)

    leadDetails.discountBysalesman = discountBysalesman;
    leadDetails.amountAfterDiscount = amountAfterDiscount;
    leadDetails.Quatation = Quatation;
    leadDetails.totalDiscount = totalDiscount;
    
    if (userDesignation === "director") {
      leadDetails.addDiscountByDirector = true;
      leadDetails.discountByDirector = discountByDirector;
    }
    leadDetails.employeeId = new mongoose.Types.ObjectId(employeeId)

    if (documents?.length) {
      leadDetails.closedDocuments = documents;
    }


    // Change lead status
    lead.status = "closed";
    lead.updatedBy = new mongoose.Types.ObjectId(userId);

    const res = await leadDetails.save();
    await lead.save();
    return;
  } catch (error: any) {
    console.log(error);
    throw new Error("Repository Error (closed): " + error.message);
  }
};

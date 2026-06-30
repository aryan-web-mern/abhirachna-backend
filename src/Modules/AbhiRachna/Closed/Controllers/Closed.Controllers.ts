import { ErrorResponse, STATUS_CODE, SuccessResponse } from "../../../../Api"
import { LeadBasicDetailsModel, LeadModel } from "../../Leads/Modals/Leads.Modals";
import { CollaborationModel } from "../../TalkingLead/Modals/TalkingLead.Modals";
import { updateLeadToClosedService } from "../Services/ClosedServices";
import { NextFunction, Request, Response } from "express";

export const updateLeadToClosedController = async (req: Request & { user?: { _id: string } }, res: Response, next: NextFunction): Promise<any> => {

  if (!req.user || !req.user._id || !req.user.designationId) {
    return ErrorResponse(res, STATUS_CODE.UNAUTHORIZED, "User not authenticated");
  }

  const userId = req.user._id;
  const { leadId } = req.params;
  const { finalAmount: Quatation,
    discount: discountBysalesman,
    totalDiscountPercentage: totalDiscount,
    amountAfterDiscount,
    directorDiscount: discountByDirector
  } = req.body;

  const files = req.files as {
    [fieldname: string]: Express.MulterS3.File[];
  };

  const filesList = files?.documents || [];

  const documents = filesList?.map((file) => file.key)

  if (!req.user || !req.user._id) {
    return ErrorResponse(res, STATUS_CODE.UNAUTHORIZED, "User not authenticated");
  }
  const employeeId = req.user._id;

  try {


    const result = await updateLeadToClosedService({
      Quatation,
      discountBysalesman,
      totalDiscount,
      amountAfterDiscount,
      discountByDirector,
      userDesignation: req.user.designationId.name,
      leadId,
      documents,
      employeeId,
      userId
    }
    );

    SuccessResponse(res, STATUS_CODE.OK, "Lead Close SuccessFully")
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

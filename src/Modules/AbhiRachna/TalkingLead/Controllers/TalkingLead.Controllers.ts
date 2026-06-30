import { Request, Response, NextFunction } from "express";
import { updateToTalkingService } from "../Services/TalkingLead.Services";
import { ErrorResponse, STATUS_CODE, SuccessResponse } from "../../../../Api";


export const updateToTalkingController = async (req: Request & { user?: { _id: string } }, res: Response, next: NextFunction): Promise<any> => {
  try {
    const leadId = req.params.id;

    if (!req.user || !req.user._id) {
      return ErrorResponse(res, STATUS_CODE.UNAUTHORIZED, "User not authenticated");
    }
    if (!req.body?.commentsTalking) {
      return ErrorResponse(res, STATUS_CODE.BAD_REQUEST, "Please provide comments for talking");
    }

    const userId = req.user._id;
       const role= req?.user?.designationId?.name;

    const { leadQuality, commentsTalking, memberIds, assignedSurveyor } = req.body;

    await updateToTalkingService({ leadId, userId, leadQuality, commentsTalking, memberIds, assignedSurveyor ,role});

    return SuccessResponse(res, STATUS_CODE.OK, "Lead updated to talking successfully");
  } catch (error) {
    return next(error);
  }
};

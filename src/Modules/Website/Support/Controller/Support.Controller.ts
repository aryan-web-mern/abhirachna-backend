import { Request, Response, NextFunction } from "express";
import { saveUserMsgService, scheduleMeetingService } from "../Services/Support.Services";
import { ErrorResponse, STATUS_CODE, SuccessResponse } from "../../../../Api"


export const saveUserMsgController = async (req: Request, res: Response, next: NextFunction):Promise<any>=> {
  try {
    const msg = await saveUserMsgService(req.body);
    return SuccessResponse(res, STATUS_CODE.OK, "Message Sent Successfully!");
  } catch (err) {
  next(err);
  }
};
export const scheduleMeetingController = async (req: Request, res: Response, next: NextFunction):Promise<any>=> {
  try {
    const msg = await scheduleMeetingService(req.body);
    return SuccessResponse(res, STATUS_CODE.OK, {msg: "Message Sent Successfully!", data: msg});
  } catch (err) {
  next(err);
  }
};
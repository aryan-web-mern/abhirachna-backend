import { ErrorResponse, STATUS_CODE, SuccessResponse } from  "../../../../Api"
import { NextFunction, Request, Response } from "express";
import { updateStatusToDesigningService } from "../Services/Design.Services";


export const changeToDesigningStatus = async (req: Request & { user?: { _id: string }}, res: Response,next:NextFunction):Promise<any> => {
  try {
    
    const { leadId } = req.params;
    const { designerIds, tokenReceived } = req.body;
       if (!req.user || !req.user._id) {
              return ErrorResponse(res, STATUS_CODE.UNAUTHORIZED, "User not authenticated");
            }
            
    const employeeId = req.user._id;
    const role= req?.user?.designationId?.name

    if(!role){
    return ErrorResponse(res, STATUS_CODE.BAD_REQUEST, "Role is missing");
    }

    await updateStatusToDesigningService(leadId, designerIds, tokenReceived, employeeId,role);

 
      SuccessResponse(res,STATUS_CODE.OK,"Lead status updated to designing")
  } catch (error) {
next(error);
  }
};

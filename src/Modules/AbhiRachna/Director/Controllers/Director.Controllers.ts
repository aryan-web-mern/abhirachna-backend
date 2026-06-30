import { STATUS_CODE, SuccessResponse } from "../../../../Api";
import { NextFunction, Request, Response } from "express";
import { approveDesigningByDirectorService, approveNegoByDirectorService } from "../Services/Director.Services";
import { ErrorResponse } from "../../../../Api";


export const approveDesigningByDirectorController = async (req: Request, res: Response,next:NextFunction):Promise<any> => {
  const { leadId } = req.params;

  let {isApproved}=req.query;

const isToken=isApproved==="true";
  


  try {
      if (!req.user || !req.user._id) {
      return ErrorResponse(res, STATUS_CODE.UNAUTHORIZED, "User not authenticated");
    }

    const userId = req.user._id;
    const result = await approveDesigningByDirectorService(leadId,userId,isToken);
  
    SuccessResponse(res,STATUS_CODE.OK,"Designing approved by director successfully")
  } catch (error: any) {
 next(error);
  }
};

export const approveNegoByDirectorController = async (req: Request, res: Response,next:NextFunction):Promise<any> => {
  const { leadId } = req.params;

  let {isApproved}=req.query;

  console.log(isApproved,'check for token controller')
const isToken=isApproved==="true";
  


  try {
      if (!req.user || !req.user._id) {
      return ErrorResponse(res, STATUS_CODE.UNAUTHORIZED, "User not authenticated");
    }
const userId = req.user._id;
    const result = await approveNegoByDirectorService(leadId,userId,isToken);
  
    SuccessResponse(res,STATUS_CODE.OK,"Designing approved by director successfully")
  } catch (error: any) {
 next(error);
  }
};

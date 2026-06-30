import { Request, Response, NextFunction } from "express";
import { ErrorResponse, STATUS_CODE, SuccessResponse } from "../../../../Api";
import { approveLeadBySurveyorService, createLeadService, getSurveyorLeadsService } from "../../Leads/Services/Leads.Services";

export const approveLeadBySurveyorController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    if (!req.params.id) {
      return ErrorResponse(res, STATUS_CODE.NOT_FOUND, "Lead Id not found");
    }
    if (!req.query.isApproved) {
      return ErrorResponse(res, STATUS_CODE.NOT_FOUND, "Approval status not found");
    }
    const approvedBySurveyor = req.query.isApproved === 'true' ? true : false;
        if (!req.user || !req.user._id) {
          return ErrorResponse(
            res,
            STATUS_CODE.UNAUTHORIZED,
            "User not authenticated"
          );
        }
    
    
        const loggedInUserId = req.user?._id;
    const updated = await approveLeadBySurveyorService(req.params.id, approvedBySurveyor,loggedInUserId);

    return SuccessResponse(res, STATUS_CODE.OK, "Lead updated Successfully");
  } catch (error) {
    next(error);
  }
};

export const createLeadController = async (
  req: Request & { user?: { _id: string } },
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const leaddata = req.body;
    if (!req.user || !req.user._id) {
      return ErrorResponse(
        res,
        STATUS_CODE.UNAUTHORIZED,
        "User not authenticated"
      );
    }

    const userId = req.user._id;
    const data = { ...leaddata, createdBy: userId, leadtype: "manual" };
    const newLead = await createLeadService(data);
    return SuccessResponse(res, STATUS_CODE.OK, "Lead created successfully");
  } catch (error) {
    next(error);
  }
};


export const getSurveyorLeadsController = async (
  req: Request & { user?: { _id: string } },
  res: Response,
  next: NextFunction
): Promise<any> => {
  const userId = req?.user?._id;
  const isApproved = req?.query?.isApproved ? req?.query?.isApproved === "true" ? true : false : "" as boolean | string;
  const page = req?.query?.page as string;
  const limit = req?.query?.limit as string;

  try {
    if (!userId) {
      return ErrorResponse(
        res,
        STATUS_CODE.UNAUTHORIZED,
        "User not authenticated"
      );
    }
    const leads = await getSurveyorLeadsService(userId, isApproved, Number(page), Number(limit));
    return SuccessResponse(res, STATUS_CODE.OK, leads);
  } catch (error) {
    next(error);
  }
};
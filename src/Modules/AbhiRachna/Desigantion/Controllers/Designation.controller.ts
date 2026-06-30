
import { Request, Response, NextFunction } from "express";
import { ErrorResponse, SuccessResponse, STATUS_CODE } from "../../../../Api"
import { IRootFields } from "src/Typedefination/Roottype";
import { addDesignationService, getAllDesignationsService } from "../Services/Designation.Services";
import { AuthenticatedRequest } from "src/types/types";

// Add designation 
const addDesignationController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const {
      DesignationName,
      Description
    } = req.body;

    // Validate input fields
    if (
      !DesignationName) {
      return ErrorResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        "Please provide valid data."
      );
    }

    // Create designation object
    const designationData: IRootFields = {
      name: DesignationName,
      Description: Description,
    };
    const response = await addDesignationService(designationData);
    return SuccessResponse(
      res,
      STATUS_CODE.OK,
      "Designation added successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const getAllDesignationsController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    if (!req.user || !req.user._id) {
      return ErrorResponse(res, STATUS_CODE.UNAUTHORIZED, "User Not Authorized");
    }

    const result = await getAllDesignationsService();

    return SuccessResponse(res, STATUS_CODE.OK, result);
  } catch (error: any) {
    return ErrorResponse(res, STATUS_CODE.BAD_REQUEST, error.message || "Something went wrong");
  }
};


// ----------------------------------------------------Aayush Malviya----------------------------------------------------------
export { addDesignationController }
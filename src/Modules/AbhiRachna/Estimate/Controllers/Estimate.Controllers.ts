import { Request, Response, NextFunction } from "express";
import { ErrorResponse, STATUS_CODE, SuccessResponse } from "../../../../Api";
import { createDesignOptionService, createExitingLeadEstimateService, createLeadWithEstimateService, deleteDesignOptionService, getAllDesignOptionsService, getEstimateByLeadIdService, getSingleDesignOptionService, updateDesignOptionService, updateExitingLeadEstimateService } from "../Services/Estimate.Services";
import { LeadModel } from "../../Leads/Modals/Leads.Modals";
import { EstimateModel } from "../Modals/Estimate.Modals";

export const createDesignOptionController = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const created = await createDesignOptionService(req.body);
    return SuccessResponse(res, STATUS_CODE.OK, "Design option created");
  } catch (err: any) {
    next(err);
  }
};

export const getAllDesignOptionsController = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const result = await getAllDesignOptionsService();
    return SuccessResponse(res, STATUS_CODE.OK, result);
  } catch (err: any) {
    next(err);

  }
};

export const getSingleDesignOptionController = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const result = await getSingleDesignOptionService(req.params.id);
    return SuccessResponse(res, STATUS_CODE.OK, result);
  } catch (err: any) {
    next(err);

  }
};




export const deleteDesignOptionController = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const id = req.params.id;
    await deleteDesignOptionService(id);
    return SuccessResponse(res, STATUS_CODE.OK, "Design option deleted");
  } catch (err: any) {
    next(err);
  }
};

export const updateDesignOptionController = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const id = req.params.id;
    const data = req.body;
    const updated = await updateDesignOptionService(id, data);
    return SuccessResponse(res, STATUS_CODE.OK, "Design option updated");
  } catch (err: any) {
    next(err);
  }
};


export const createLeadWithEstimateController = async (req: Request & { user?: { _id: string } }, res: Response, next: NextFunction): Promise<any> => {
  try {


    if (!req.user || !req.user._id) {
      return ErrorResponse(res, STATUS_CODE.UNAUTHORIZED, "User not authenticated");
    }
    const currentUser = req.user._id;
    const data = { createdBy: currentUser, ...req.body }
    const result = await createLeadWithEstimateService(data);
    return SuccessResponse(res, STATUS_CODE.OK, result);
  } catch (err) {
    next(err);
  }
};



export const createEstimateExitingLeadController = async (req: Request & { user?: { _id: string } }, res: Response, next: NextFunction): Promise<any> => {
  try {


    if (!req.user || !req.user._id) {
      return ErrorResponse(res, STATUS_CODE.UNAUTHORIZED, "User not authenticated");
    }
    const currentUser = req.user._id;
    const data = { createdBy: currentUser, ...req.body }
    const result = await createExitingLeadEstimateService(data);
    return SuccessResponse(res, STATUS_CODE.OK, result);
  } catch (err) {
    next(err);
  }
};

export const updateEstimateExitingLeadController = async (req: Request & { user?: { _id: string } }, res: Response, next: NextFunction): Promise<any> => {
  try {

    const estimateId = req?.params?.id as string;

    if (!req.user || !req.user._id) {
      return ErrorResponse(res, STATUS_CODE.UNAUTHORIZED, "User not authenticated");
    }
    if (!estimateId) {
      return ErrorResponse(res, STATUS_CODE.NOT_FOUND, "Estimate id not found");
    }
    const currentUser = req.user._id;
    const data = { createdBy: currentUser, ...req.body }
    await updateExitingLeadEstimateService(estimateId, data);
    return SuccessResponse(res, STATUS_CODE.OK, "Estimate updated successfully!");
  } catch (err) {
    next(err);
  }
};




export const getEstimateByLeadIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {

    let estimateId = '';
    if (req.headers["x-upload-type"] === "Lead") {
      const estimateDoc = await EstimateModel.findOne({ leadId: req.params?.estimateId });

      if (!estimateDoc) {
        return res.status(404).json({ success: false, message: "Estimate not found" });
      }
      estimateId = estimateDoc?._id?.toString() || '';

    } else {
      estimateId = req.params.estimateId;
    }
    const estimate = await getEstimateByLeadIdService(estimateId);

    if (!estimate) {
      return res.status(404).json({ success: false, message: "Estimate not found" });
    }

    res.status(200).json({ success: true, data: estimate });
  } catch (err) {
    next(err);
  }
};

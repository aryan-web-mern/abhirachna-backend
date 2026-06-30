
import { createJobService, getAllJobsService, getJobByIdService, applyJobService, deleteJobService, editJobService, publishJobService, unpublishJobService, getAppliedJobsService, deleteAppliedJobService } from "../Services/Careers.Services";
import { SuccessResponse, ErrorResponse, STATUS_CODE } from "../../../../Api";
import { NextFunction, Request, Response } from "express";

export const createJobController = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const createdBy = req?.user?._id;
    const draft = req?.query?.isDraft === "true" ? true: false
    const published =  draft ? false : true;
    const job = await createJobService({ ...req.body, createdBy, published, draft });
    return SuccessResponse(res, STATUS_CODE.OK, "Job Created");
  } catch (err: any) {
    next(err);
  }
};

export const editJobController = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const id = req?.params?.id as string;
    const job = await editJobService({ ...req.body }, id);
    return SuccessResponse(res, STATUS_CODE.OK, "Job updated successfully!");
  } catch (err: any) {
    next(err);
  }
};

export const getAllJobsController = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { isDraft = "false" } = req.query;
    const draft = isDraft === "true";
    const published = !draft;
    const reqFromLead = (req.headers["x-upload-type"] === "Lead") ? true : false
    const { page = 1, limit = 10 } = req.query;
    const jobs = await getAllJobsService(reqFromLead, Number(page), Number(limit), draft, published);
    return SuccessResponse(res, STATUS_CODE.OK, jobs);
  } catch (err: any) {
    next(err);
  }
};

export const getJobByIdController = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const job = await getJobByIdService(req.params.id);
    return SuccessResponse(res, STATUS_CODE.OK, job);
  } catch (err: any) {
    next(err);
  }
};

export const applyJobController = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const fileName = req.file?.originalname;
    const fileKey = (req.file as any)?.key;
    const job = await applyJobService({ ...req.body, fileKey, fileName });
    return SuccessResponse(res, STATUS_CODE.OK, { ...job.toObject(), fileKey });
  } catch (err: any) {
    next(err);
  }
};


export const deleteJobController = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const userId = req?.user?._id;
    const { id } = req.params as any;
    if (!userId) {
      return ErrorResponse(res, STATUS_CODE.UNAUTHORIZED, "You are not logged in.");
    };
    if (!id) {
      return ErrorResponse(res, STATUS_CODE.NOT_FOUND, "Job Id not found");
    };
    const result = await deleteJobService(id);
    return SuccessResponse(res, STATUS_CODE.OK, result);
  } catch (err) {
    next(err);
  }
};


export const publishJobController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    if (!req.params.id) {
      return ErrorResponse(res, STATUS_CODE.NOT_FOUND, "Job Id not found");
    }
    const updated = await publishJobService(req.params.id, true, false);

    return SuccessResponse(res, STATUS_CODE.OK, "Job approved");
  } catch (error) {
    next(error);
  }
};

export const unpublishJobController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    if (!req.params.id) {
      return ErrorResponse(res, STATUS_CODE.NOT_FOUND, "Job Id not found");
    }
    const updated = await unpublishJobService(req.params.id, false, true);
    return SuccessResponse(res, STATUS_CODE.OK, "Job unpublished");
  } catch (error) {
    next(error);
  }
};


export const getAppliedJobsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    if (!req.params.id) {
      return ErrorResponse(res, STATUS_CODE.NOT_FOUND, "Job Id not found");
    }
    if (!req?.user?._id) {
      return ErrorResponse(
        res,
        STATUS_CODE.UNAUTHORIZED,
        "You are not logged in."
      );
    }
    const appliedJobs = await getAppliedJobsService(req.params.id);
    return SuccessResponse(res, STATUS_CODE.OK, appliedJobs);
  } catch (error) {
    next(error);
  }
};

export const deleteAppliedJobController = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const userId = req?.user?._id;
    const { id } = req.params as any;
    if (!userId) {
      return ErrorResponse(res, STATUS_CODE.UNAUTHORIZED, "You are not logged in.");
    };
    if (!id) {
      return ErrorResponse(res, STATUS_CODE.NOT_FOUND, "Applied Job Id not found");
    };
    const result = await deleteAppliedJobService(id);
    return SuccessResponse(res, STATUS_CODE.OK, result);
  } catch (err) {
    next(err);
  }
};
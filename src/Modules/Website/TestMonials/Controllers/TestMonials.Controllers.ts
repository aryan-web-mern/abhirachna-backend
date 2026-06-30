// Testimonials/Controller.ts
import { Request, Response, NextFunction } from "express";
import {
  createTestimonialService,
  deleteTestimonialService,
  getAllTestimonialsService,
  getApprovedTestimonialsService,
  updateApprovalStatusService,
  updateTestimonialService,
} from "../Services/TestMonials.Services";
import { getUploadedFileUrl } from "../../../../Middlewares/Multers/uploadHelpers";
import { ErrorResponse, STATUS_CODE, SuccessResponse } from "../../../../Api";

interface UploadFiles {
  image?: Express.Multer.File[];
  video?: Express.Multer.File[];
}

export const createTestimonialController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const files = req.files as UploadFiles;
    let type = "visitor"
    if( req.headers["x-upload-type"] === "Lead") type = "manual";

    const { isAdmin, isDraft  } = req.query;

    const adminBool = isAdmin === "true";
    const draftBool = isDraft === "true";
    let approved = false;
    let draft = true;
    if (adminBool && !draftBool) {
      approved = true;
      draft = false;
    }

    const imageKey = getUploadedFileUrl(files?.image?.[0]);
    const videoKey = getUploadedFileUrl(files?.video?.[0]);
    const data = {
      ...req.body,
      image: imageKey,
      video: videoKey,
      approved,
      draft,
      type
    };

    const testimonial = await createTestimonialService(data);
    return SuccessResponse(
      res,
      STATUS_CODE.OK,
      "Testimonial submitted successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const getApprovedTestimonialsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const testimonials = await getApprovedTestimonialsService();
    return SuccessResponse(res, STATUS_CODE.OK, testimonials);
  } catch (error) {
    next(error);
  }
};

export const getAllTestimonialsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { isDraft = false} = req.query;
     
    const draftBool = isDraft === "true";

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

  

    const testimonials = await getAllTestimonialsService(
      page,
      limit,
     draftBool
    );
    return SuccessResponse(res, STATUS_CODE.OK, testimonials);
  } catch (error) {
    next(error);
  }
};

export const approveTestimonialController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const updated = await updateApprovalStatusService(
      req.params.id,
      true,
      false
    );

    return SuccessResponse(res, STATUS_CODE.OK, "Testimonial approved");
  } catch (error) {
    next(error);
  }
};

export const unpublishTestimonialController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const updated = await updateApprovalStatusService(
      req.params.id,
      false,
      true
    );
    return SuccessResponse(res, STATUS_CODE.OK, "Testimonial unpublished");
  } catch (error) {
    next(error);
  }
};

export const deleteTestimonialController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const userId = req?.user?._id;
    const { id } = req.params as any;
    if (!userId) {
      return ErrorResponse(
        res,
        STATUS_CODE.UNAUTHORIZED,
        "You are not logged in."
      );
    }
    if (!id) {
      return ErrorResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        "Testimonial Id not found"
      );
    }
    const result = await deleteTestimonialService(id);
    return SuccessResponse(res, STATUS_CODE.OK, result);
  } catch (err) {
    next(err);
  }
};

export const updateTestimonialController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const files = req.files as UploadFiles;
    const userId = req?.user?._id;
    const { id } = req.params as any;
    let data = req.body;
    const imageKey = getUploadedFileUrl(files?.image?.[0]);
    const videoKey = getUploadedFileUrl(files?.video?.[0]);

    if (imageKey) {
      data.image = imageKey;
    }
    if (videoKey) {
      data.video = videoKey;
    }
    if (!userId) {
      return ErrorResponse(
        res,
        STATUS_CODE.UNAUTHORIZED,
        "You are not logged in."
      );
    }
    if (!id) {
      return ErrorResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        "Testimonial Id not found"
      );
    }

    if (!data) {
      return ErrorResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        "No data provided for update"
      );
    }
    const result = await updateTestimonialService(id, data);
    return SuccessResponse(res, STATUS_CODE.OK, "Update SuccessFully");
  } catch (err) {
    next(err);
  }
};

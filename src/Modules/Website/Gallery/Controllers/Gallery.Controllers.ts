import mongoose from "mongoose";
import { ErrorResponse, STATUS_CODE, SuccessResponse } from "../../../../Api";
import { deleteGalleryService, getAllGalleryService, getFilteredGalleryService, getGalleryByIdService, likeGalleryService, publishGalleryService, saveGalleryService, unpublishGalleryService, updateGalleryService, uploadGalleryService } from "../Services/Gallery.Services";
import { NextFunction, Request, Response } from "express";
import { getUploadedFileUrl } from "../../../../Middlewares/Multers/uploadHelpers";
import { isValidObjectId } from "../../../../Config/db";
import { AuthenticatedRequest } from "src/types/types";

export const uploadGalleryController = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { isDraft } = req.query;

    const draft = isDraft === "true";
    const published = !draft;

    const userId = req?.user?._id;
    const { imageName, theme, storage, subheading } = req.body;
    const imageKey = getUploadedFileUrl(req.file);
    const gallery = await uploadGalleryService({ imageName, imageKey, theme, uploadedBy: userId, draft, published, storage: imageKey ? "cloudinary" : storage, subheading });
    return SuccessResponse(res, STATUS_CODE.OK, "Image uploaded");
  } catch (err: any) {
    next(err);
  }
};

export const getAllGalleryController = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { isDraft = "false" } = req.query;
    const draft = isDraft === "true";
    const published = !draft;
    const userId = req.query?.userId ? String(req.query?.userId) : ''
    const { page = 1, limit = 10 } = req.query;
    const galleries = await getAllGalleryService(userId, Number(page), Number(limit), draft, published);
    return SuccessResponse(res, STATUS_CODE.OK, galleries);
  } catch (err: any) {
    next(err);
  }
};

export const likeGalleryController = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const userId = "684be1723f1ebd9ec6c4bf38";
    const response = await likeGalleryService(req.params.id, userId);
    return SuccessResponse(res, STATUS_CODE.OK, "Like");
  } catch (err: any) {
    next(err);
  }
};

export const saveGalleryController = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return ErrorResponse(res, STATUS_CODE.UNAUTHORIZED, "You are not logged in.");
    };
    const response = await saveGalleryService(req.params.id, userId);
    return SuccessResponse(res, STATUS_CODE.OK, "Save");
  } catch (err: any) {
    next(err);
  }
};


export const getSaveAndLikeddGalleryController = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return ErrorResponse(res, STATUS_CODE.UNAUTHORIZED, "You are not logged in.");
    };
    const filter = req.query.filter?.toString() === 'saved' ? 'saved' : req.query.filter?.toString() === 'liked' ? 'liked' : '';
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await getFilteredGalleryService(userId, filter, page, limit);
    return SuccessResponse(res, STATUS_CODE.OK, result);
  } catch (err) {
    next(err);
  }
};

export const getGalleryByIdController = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid Id" })
    }

    const gallery = await getGalleryByIdService(id) || {};
    return SuccessResponse(res, STATUS_CODE.OK, gallery);
  } catch (err: any) {
    next(err);
  }
};



export const deleteGalleryController = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const userId = req?.user?._id;
    const { id } = req.params as any;
    if (!userId) {
      return ErrorResponse(res, STATUS_CODE.UNAUTHORIZED, "You are not logged in.");
    };
    if (!id) {
      return ErrorResponse(res, STATUS_CODE.NOT_FOUND, "Gallery Id not found");
    };
    const result = await deleteGalleryService(id);
    return SuccessResponse(res, STATUS_CODE.OK, result);
  } catch (err) {
    next(err);
  }
};

export const publishGalleryController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    if (!req.params.id) {
      return ErrorResponse(res, STATUS_CODE.NOT_FOUND, "Gallery Id not found");
    }
    const updated = await publishGalleryService(req.params.id, true, false);

    return SuccessResponse(res, STATUS_CODE.OK, "Gallery approved");
  } catch (error) {
    next(error);
  }
};

export const unpublishGalleryController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    if (!req.params.id) {
      return ErrorResponse(res, STATUS_CODE.NOT_FOUND, "Gallery Id not found");
    }
    const updated = await unpublishGalleryService(req.params.id, false, true);
    return SuccessResponse(res, STATUS_CODE.OK, "Gallery unpublished");
  } catch (error) {
    next(error);
  }
};

export const updateGalleryController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const userId = req?.user?._id;
    const { galleryId } = req.params as any;
    let updateData = req.body;

    const imageKey = getUploadedFileUrl(req.file);

    if (imageKey) {
      updateData = { ...updateData, imageKey, storage: "cloudinary" };
    }

    if (!userId) {
      return ErrorResponse(
        res,
        STATUS_CODE.UNAUTHORIZED,
        "You are not logged in."
      );
    }
    if (!galleryId) {
      return ErrorResponse(res, STATUS_CODE.NOT_FOUND, "Gallery Id not found");
    }

    if (!updateData) {
      return ErrorResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        "No update data provided"
      );
    }
    const result = await updateGalleryService(galleryId, userId, updateData);

    return SuccessResponse(res, STATUS_CODE.OK, result);
  } catch (err) {
    next(err);
  }
};
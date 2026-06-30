import { Request, Response, NextFunction } from "express";
import {
  createBlogService,
  deleteBlogService,
  getAllBlogsService,
  getBlogByIdService,
  getFilteredBlogsService,
  likeBlogService,
  publishBlogService,
  saveBlogService,
  unpublishBlogService,
  updateBlogService,
} from "../Services/Blogs.Services";
import { getUploadedFileUrl } from "../../../../Middlewares/Multers/uploadHelpers";
import { ErrorResponse, STATUS_CODE, SuccessResponse } from "../../../../Api";
import { AuthenticatedRequest } from "src/types/types";

export const createBlogController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    if (!req.user || !req.user._id) {
      return ErrorResponse(
        res,
        STATUS_CODE.UNAUTHORIZED,
        "User not authenticated"
      );
    }

    const { isDraft } = req.query;

    const draft = isDraft === "true";
    const published = !draft;

    const userId = req?.user?._id;
    const imageKey = getUploadedFileUrl(req.file);

    const blogData = {
      ...req.body,
      image: imageKey,
      createdBy: userId,
      published,
      draft,
    };
    const blog = await createBlogService(blogData);
    return SuccessResponse(res, STATUS_CODE.OK, "Blog created");
  } catch (err) {
    next(err);
  }
};

export const getAllBlogsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { isDraft = "false" } = req.query;
    const draft = isDraft === "true";
    const published = !draft;

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const userId = req.query?.userId ? String(req.query?.userId) : "";
    const result = await getAllBlogsService(
      page,
      limit,
      userId,
      draft,
      published
    );
    return SuccessResponse(res, STATUS_CODE.OK, result);
  } catch (err) {
    next(err);
  }
};

export const getBlogByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const userId = req.query?.userId ? String(req.query?.userId) : "";
    const blog = await getBlogByIdService(req.params.id, userId);
    if (!blog) {
      ErrorResponse(res, STATUS_CODE.NOT_FOUND, "Blog Not Found");
    }
    return SuccessResponse(res, STATUS_CODE.OK, blog);
  } catch (err) {
    next(err);
  }
};

export const LikeBlogController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const userId = req?.user?._id;
    if (!userId) {
      return ErrorResponse(
        res,
        STATUS_CODE.UNAUTHORIZED,
        "You are not logged in."
      );
    }
    const blog = await likeBlogService(req.params.id, userId);
    return SuccessResponse(res, STATUS_CODE.OK, "Blog liked");
  } catch (err) {
    next(err);
  }
};

export const SaveBlogController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const userId = req?.user?._id;
    if (!userId) {
      return ErrorResponse(
        res,
        STATUS_CODE.UNAUTHORIZED,
        "You are not logged in."
      );
    }
    const blog = await saveBlogService(req.params.id, userId);
    return SuccessResponse(res, STATUS_CODE.OK, "Blog saved");
  } catch (err) {
    next(err);
  }
};

export const getSavedBlogsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const userId = req?.user?._id;
    if (!userId) {
      return ErrorResponse(
        res,
        STATUS_CODE.UNAUTHORIZED,
        "You are not logged in."
      );
    }
    const filter = req.query.filter?.toString() || "save";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const result = await getFilteredBlogsService(
      userId.toString(),
      filter,
      page,
      limit
    );
    return SuccessResponse(res, STATUS_CODE.OK, result);
  } catch (err) {
    next(err);
  }
};

export const deleteBlogController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const userId = req?.user?._id;
    const { blogId } = req.params as any;
    if (!userId) {
      return ErrorResponse(
        res,
        STATUS_CODE.UNAUTHORIZED,
        "You are not logged in."
      );
    }
    if (!blogId) {
      return ErrorResponse(res, STATUS_CODE.NOT_FOUND, "Blog Id not found");
    }
    const result = await deleteBlogService(blogId);
    return SuccessResponse(res, STATUS_CODE.OK, result);
  } catch (err) {
    next(err);
  }
};

export const publishBlogController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    if (!req.params.id) {
      return ErrorResponse(res, STATUS_CODE.NOT_FOUND, "Blog Id not found");
    }
    const updated = await publishBlogService(req.params.id, true, false);

    return SuccessResponse(res, STATUS_CODE.OK, "Testimonial approved");
  } catch (error) {
    next(error);
  }
};

export const unpublishBlogController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    if (!req.params.id) {
      return ErrorResponse(res, STATUS_CODE.NOT_FOUND, "Blog Id not found");
    }
    const updated = await unpublishBlogService(req.params.id, false, true);
    return SuccessResponse(res, STATUS_CODE.OK, "Testimonial unpublished");
  } catch (error) {
    next(error);
  }
};

export const updateBlogController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const userId = req?.user?._id;
    const { blogId } = req.params as any;
    let updateData = req.body;

    const imageKey = getUploadedFileUrl(req.file);

    if (imageKey) {
      updateData = { ...updateData, image: imageKey };
    }

    if (!userId) {
      return ErrorResponse(
        res,
        STATUS_CODE.UNAUTHORIZED,
        "You are not logged in."
      );
    }
    if (!blogId) {
      return ErrorResponse(res, STATUS_CODE.NOT_FOUND, "Blog Id not found");
    }

    if (!updateData) {
      return ErrorResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        "No update data provided"
      );
    }
    const result = await updateBlogService(blogId, userId, updateData);

    return SuccessResponse(res, STATUS_CODE.OK, result);
  } catch (err) {
    next(err);
  }
};



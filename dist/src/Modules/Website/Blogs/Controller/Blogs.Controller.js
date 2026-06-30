"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBlogController = exports.unpublishBlogController = exports.publishBlogController = exports.deleteBlogController = exports.getSavedBlogsController = exports.SaveBlogController = exports.LikeBlogController = exports.getBlogByIdController = exports.getAllBlogsController = exports.createBlogController = void 0;
const Blogs_Services_1 = require("../Services/Blogs.Services");
const uploadHelpers_1 = require("../../../../Middlewares/Multers/uploadHelpers");
const Api_1 = require("../../../../Api");
const createBlogController = async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.UNAUTHORIZED, "User not authenticated");
        }
        const { isDraft } = req.query;
        const draft = isDraft === "true";
        const published = !draft;
        const userId = req?.user?._id;
        const imageKey = (0, uploadHelpers_1.getUploadedFileUrl)(req.file);
        const blogData = {
            ...req.body,
            image: imageKey,
            createdBy: userId,
            published,
            draft,
        };
        const blog = await (0, Blogs_Services_1.createBlogService)(blogData);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, "Blog created");
    }
    catch (err) {
        next(err);
    }
};
exports.createBlogController = createBlogController;
const getAllBlogsController = async (req, res, next) => {
    try {
        const { isDraft = "false" } = req.query;
        const draft = isDraft === "true";
        const published = !draft;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const userId = req.query?.userId ? String(req.query?.userId) : "";
        const result = await (0, Blogs_Services_1.getAllBlogsService)(page, limit, userId, draft, published);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, result);
    }
    catch (err) {
        next(err);
    }
};
exports.getAllBlogsController = getAllBlogsController;
const getBlogByIdController = async (req, res, next) => {
    try {
        const userId = req.query?.userId ? String(req.query?.userId) : "";
        const blog = await (0, Blogs_Services_1.getBlogByIdService)(req.params.id, userId);
        if (!blog) {
            (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.NOT_FOUND, "Blog Not Found");
        }
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, blog);
    }
    catch (err) {
        next(err);
    }
};
exports.getBlogByIdController = getBlogByIdController;
const LikeBlogController = async (req, res, next) => {
    try {
        const userId = req?.user?._id;
        if (!userId) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.UNAUTHORIZED, "You are not logged in.");
        }
        const blog = await (0, Blogs_Services_1.likeBlogService)(req.params.id, userId);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, "Blog liked");
    }
    catch (err) {
        next(err);
    }
};
exports.LikeBlogController = LikeBlogController;
const SaveBlogController = async (req, res, next) => {
    try {
        const userId = req?.user?._id;
        if (!userId) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.UNAUTHORIZED, "You are not logged in.");
        }
        const blog = await (0, Blogs_Services_1.saveBlogService)(req.params.id, userId);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, "Blog saved");
    }
    catch (err) {
        next(err);
    }
};
exports.SaveBlogController = SaveBlogController;
const getSavedBlogsController = async (req, res, next) => {
    try {
        const userId = req?.user?._id;
        if (!userId) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.UNAUTHORIZED, "You are not logged in.");
        }
        const filter = req.query.filter?.toString() || "save";
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const result = await (0, Blogs_Services_1.getFilteredBlogsService)(userId.toString(), filter, page, limit);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, result);
    }
    catch (err) {
        next(err);
    }
};
exports.getSavedBlogsController = getSavedBlogsController;
const deleteBlogController = async (req, res, next) => {
    try {
        const userId = req?.user?._id;
        const { blogId } = req.params;
        if (!userId) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.UNAUTHORIZED, "You are not logged in.");
        }
        if (!blogId) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.NOT_FOUND, "Blog Id not found");
        }
        const result = await (0, Blogs_Services_1.deleteBlogService)(blogId);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, result);
    }
    catch (err) {
        next(err);
    }
};
exports.deleteBlogController = deleteBlogController;
const publishBlogController = async (req, res, next) => {
    try {
        if (!req.params.id) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.NOT_FOUND, "Blog Id not found");
        }
        const updated = await (0, Blogs_Services_1.publishBlogService)(req.params.id, true, false);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, "Testimonial approved");
    }
    catch (error) {
        next(error);
    }
};
exports.publishBlogController = publishBlogController;
const unpublishBlogController = async (req, res, next) => {
    try {
        if (!req.params.id) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.NOT_FOUND, "Blog Id not found");
        }
        const updated = await (0, Blogs_Services_1.unpublishBlogService)(req.params.id, false, true);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, "Testimonial unpublished");
    }
    catch (error) {
        next(error);
    }
};
exports.unpublishBlogController = unpublishBlogController;
const updateBlogController = async (req, res, next) => {
    try {
        const userId = req?.user?._id;
        const { blogId } = req.params;
        let updateData = req.body;
        const imageKey = (0, uploadHelpers_1.getUploadedFileUrl)(req.file);
        if (imageKey) {
            updateData = { ...updateData, image: imageKey };
        }
        if (!userId) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.UNAUTHORIZED, "You are not logged in.");
        }
        if (!blogId) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.NOT_FOUND, "Blog Id not found");
        }
        if (!updateData) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.BAD_REQUEST, "No update data provided");
        }
        const result = await (0, Blogs_Services_1.updateBlogService)(blogId, userId, updateData);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, result);
    }
    catch (err) {
        next(err);
    }
};
exports.updateBlogController = updateBlogController;

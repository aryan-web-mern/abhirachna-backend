"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGalleryController = exports.unpublishGalleryController = exports.publishGalleryController = exports.deleteGalleryController = exports.getGalleryByIdController = exports.getSaveAndLikeddGalleryController = exports.saveGalleryController = exports.likeGalleryController = exports.getAllGalleryController = exports.uploadGalleryController = void 0;
const Api_1 = require("../../../../Api");
const Gallery_Services_1 = require("../Services/Gallery.Services");
const uploadHelpers_1 = require("../../../../Middlewares/Multers/uploadHelpers");
const db_1 = require("../../../../Config/db");
const uploadGalleryController = async (req, res, next) => {
    try {
        const { isDraft } = req.query;
        const draft = isDraft === "true";
        const published = !draft;
        const userId = req?.user?._id;
        const { imageName, theme, storage, subheading } = req.body;
        const imageKey = (0, uploadHelpers_1.getUploadedFileUrl)(req.file);
        const gallery = await (0, Gallery_Services_1.uploadGalleryService)({ imageName, imageKey, theme, uploadedBy: userId, draft, published, storage: imageKey ? "cloudinary" : storage, subheading });
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, "Image uploaded");
    }
    catch (err) {
        next(err);
    }
};
exports.uploadGalleryController = uploadGalleryController;
const getAllGalleryController = async (req, res, next) => {
    try {
        const { isDraft = "false" } = req.query;
        const draft = isDraft === "true";
        const published = !draft;
        const userId = req.query?.userId ? String(req.query?.userId) : '';
        const { page = 1, limit = 10 } = req.query;
        const galleries = await (0, Gallery_Services_1.getAllGalleryService)(userId, Number(page), Number(limit), draft, published);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, galleries);
    }
    catch (err) {
        next(err);
    }
};
exports.getAllGalleryController = getAllGalleryController;
const likeGalleryController = async (req, res, next) => {
    try {
        const userId = "684be1723f1ebd9ec6c4bf38";
        const response = await (0, Gallery_Services_1.likeGalleryService)(req.params.id, userId);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, "Like");
    }
    catch (err) {
        next(err);
    }
};
exports.likeGalleryController = likeGalleryController;
const saveGalleryController = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.UNAUTHORIZED, "You are not logged in.");
        }
        ;
        const response = await (0, Gallery_Services_1.saveGalleryService)(req.params.id, userId);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, "Save");
    }
    catch (err) {
        next(err);
    }
};
exports.saveGalleryController = saveGalleryController;
const getSaveAndLikeddGalleryController = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.UNAUTHORIZED, "You are not logged in.");
        }
        ;
        const filter = req.query.filter?.toString() === 'saved' ? 'saved' : req.query.filter?.toString() === 'liked' ? 'liked' : '';
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const result = await (0, Gallery_Services_1.getFilteredGalleryService)(userId, filter, page, limit);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, result);
    }
    catch (err) {
        next(err);
    }
};
exports.getSaveAndLikeddGalleryController = getSaveAndLikeddGalleryController;
const getGalleryByIdController = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!(0, db_1.isValidObjectId)(id)) {
            return res.status(400).json({ success: false, message: "Invalid Id" });
        }
        const gallery = await (0, Gallery_Services_1.getGalleryByIdService)(id) || {};
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, gallery);
    }
    catch (err) {
        next(err);
    }
};
exports.getGalleryByIdController = getGalleryByIdController;
const deleteGalleryController = async (req, res, next) => {
    try {
        const userId = req?.user?._id;
        const { id } = req.params;
        if (!userId) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.UNAUTHORIZED, "You are not logged in.");
        }
        ;
        if (!id) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.NOT_FOUND, "Gallery Id not found");
        }
        ;
        const result = await (0, Gallery_Services_1.deleteGalleryService)(id);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, result);
    }
    catch (err) {
        next(err);
    }
};
exports.deleteGalleryController = deleteGalleryController;
const publishGalleryController = async (req, res, next) => {
    try {
        if (!req.params.id) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.NOT_FOUND, "Gallery Id not found");
        }
        const updated = await (0, Gallery_Services_1.publishGalleryService)(req.params.id, true, false);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, "Gallery approved");
    }
    catch (error) {
        next(error);
    }
};
exports.publishGalleryController = publishGalleryController;
const unpublishGalleryController = async (req, res, next) => {
    try {
        if (!req.params.id) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.NOT_FOUND, "Gallery Id not found");
        }
        const updated = await (0, Gallery_Services_1.unpublishGalleryService)(req.params.id, false, true);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, "Gallery unpublished");
    }
    catch (error) {
        next(error);
    }
};
exports.unpublishGalleryController = unpublishGalleryController;
const updateGalleryController = async (req, res, next) => {
    try {
        const userId = req?.user?._id;
        const { galleryId } = req.params;
        let updateData = req.body;
        const imageKey = (0, uploadHelpers_1.getUploadedFileUrl)(req.file);
        if (imageKey) {
            updateData = { ...updateData, imageKey, storage: "cloudinary" };
        }
        if (!userId) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.UNAUTHORIZED, "You are not logged in.");
        }
        if (!galleryId) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.NOT_FOUND, "Gallery Id not found");
        }
        if (!updateData) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.BAD_REQUEST, "No update data provided");
        }
        const result = await (0, Gallery_Services_1.updateGalleryService)(galleryId, userId, updateData);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, result);
    }
    catch (err) {
        next(err);
    }
};
exports.updateGalleryController = updateGalleryController;

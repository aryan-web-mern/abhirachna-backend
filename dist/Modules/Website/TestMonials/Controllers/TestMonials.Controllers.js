"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTestimonialController = exports.deleteTestimonialController = exports.unpublishTestimonialController = exports.approveTestimonialController = exports.getAllTestimonialsController = exports.getApprovedTestimonialsController = exports.createTestimonialController = void 0;
const TestMonials_Services_1 = require("../Services/TestMonials.Services");
const Api_1 = require("../../../../Api");
const createTestimonialController = async (req, res, next) => {
    try {
        const files = req.files;
        let type = "visitor";
        if (req.headers["x-upload-type"] === "Lead")
            type = "manual";
        const { isAdmin, isDraft } = req.query;
        const adminBool = isAdmin === "true";
        const draftBool = isDraft === "true";
        let approved = false;
        let draft = true;
        if (adminBool && !draftBool) {
            approved = true;
            draft = false;
        }
        const imageKey = files?.image?.[0]?.key || "";
        const videoKey = files?.video?.[0]?.key || "";
        const data = {
            ...req.body,
            image: imageKey,
            video: videoKey,
            approved,
            draft,
            type
        };
        const testimonial = await (0, TestMonials_Services_1.createTestimonialService)(data);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, "Testimonial submitted successfully");
    }
    catch (error) {
        next(error);
    }
};
exports.createTestimonialController = createTestimonialController;
const getApprovedTestimonialsController = async (req, res, next) => {
    try {
        const testimonials = await (0, TestMonials_Services_1.getApprovedTestimonialsService)();
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, testimonials);
    }
    catch (error) {
        next(error);
    }
};
exports.getApprovedTestimonialsController = getApprovedTestimonialsController;
const getAllTestimonialsController = async (req, res, next) => {
    try {
        const { isDraft = false } = req.query;
        const draftBool = isDraft === "true";
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const testimonials = await (0, TestMonials_Services_1.getAllTestimonialsService)(page, limit, draftBool);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, testimonials);
    }
    catch (error) {
        next(error);
    }
};
exports.getAllTestimonialsController = getAllTestimonialsController;
const approveTestimonialController = async (req, res, next) => {
    try {
        const updated = await (0, TestMonials_Services_1.updateApprovalStatusService)(req.params.id, true, false);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, "Testimonial approved");
    }
    catch (error) {
        next(error);
    }
};
exports.approveTestimonialController = approveTestimonialController;
const unpublishTestimonialController = async (req, res, next) => {
    try {
        const updated = await (0, TestMonials_Services_1.updateApprovalStatusService)(req.params.id, false, true);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, "Testimonial unpublished");
    }
    catch (error) {
        next(error);
    }
};
exports.unpublishTestimonialController = unpublishTestimonialController;
const deleteTestimonialController = async (req, res, next) => {
    try {
        const userId = req?.user?._id;
        const { id } = req.params;
        if (!userId) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.UNAUTHORIZED, "You are not logged in.");
        }
        if (!id) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.NOT_FOUND, "Testimonial Id not found");
        }
        const result = await (0, TestMonials_Services_1.deleteTestimonialService)(id);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, result);
    }
    catch (err) {
        next(err);
    }
};
exports.deleteTestimonialController = deleteTestimonialController;
const updateTestimonialController = async (req, res, next) => {
    try {
        const files = req.files;
        const userId = req?.user?._id;
        const { id } = req.params;
        let data = req.body;
        const imageKey = files?.image?.[0]?.key || "";
        const videoKey = files?.video?.[0]?.key || "";
        if (imageKey) {
            data.image = imageKey;
        }
        if (videoKey) {
            data.video = videoKey;
        }
        if (!userId) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.UNAUTHORIZED, "You are not logged in.");
        }
        if (!id) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.NOT_FOUND, "Testimonial Id not found");
        }
        if (!data) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.BAD_REQUEST, "No data provided for update");
        }
        const result = await (0, TestMonials_Services_1.updateTestimonialService)(id, data);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, "Update SuccessFully");
    }
    catch (err) {
        next(err);
    }
};
exports.updateTestimonialController = updateTestimonialController;

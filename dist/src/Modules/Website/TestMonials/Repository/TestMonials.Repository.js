"use strict";
// Testimonials/Repository.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTestimonialRepo = exports.deleteTestimionialRepo = exports.updateApprovalStatusRepo = exports.getAllTestimonialsRepo = exports.getApprovedTestimonialsRepo = exports.createTestimonialRepo = void 0;
const Delete_1 = require("../../../../Middlewares/Multers/Cloudinary/Delete");
const TestMonials_Modals_1 = require("../Modals/TestMonials.Modals");
const createTestimonialRepo = async (data) => {
    try {
        return await TestMonials_Modals_1.TestimonialModel.create(data);
    }
    catch (err) {
        throw new Error("Repository Error: " + err.message);
    }
};
exports.createTestimonialRepo = createTestimonialRepo;
const getApprovedTestimonialsRepo = async () => {
    try {
        return await TestMonials_Modals_1.TestimonialModel.find({ approved: true, });
    }
    catch (err) {
        throw new Error("Repository Error: " + err.message);
    }
};
exports.getApprovedTestimonialsRepo = getApprovedTestimonialsRepo;
const getAllTestimonialsRepo = async (page = 1, limit = 10, isDraft) => {
    try {
        console.log(isDraft, "isdrsft");
        const skip = (page - 1) * limit;
        const query = isDraft ? { draft: true } : { approved: true };
        const total = await TestMonials_Modals_1.TestimonialModel.countDocuments(query);
        const testimonials = await TestMonials_Modals_1.TestimonialModel.find(query).sort({ updatedAt: -1 })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        return {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            testimonials,
        };
    }
    catch (err) {
        throw new Error("Repository Error: " + err.message);
    }
};
exports.getAllTestimonialsRepo = getAllTestimonialsRepo;
const updateApprovalStatusRepo = async (id, approved, draft) => {
    try {
        return await TestMonials_Modals_1.TestimonialModel.findByIdAndUpdate(id, { approved, draft }, { new: true });
    }
    catch (err) {
        throw new Error("Repository Error: " + err.message);
    }
};
exports.updateApprovalStatusRepo = updateApprovalStatusRepo;
const deleteTestimionialRepo = async (testimonialId) => {
    try {
        const gal = await TestMonials_Modals_1.TestimonialModel.findById(testimonialId);
        if (!gal)
            throw new Error("Testimonial not found!");
        await gal.deleteOne();
        return "Testimonial item deleted successfully!";
    }
    catch (err) {
        throw new Error(err.message);
    }
};
exports.deleteTestimionialRepo = deleteTestimionialRepo;
const updateTestimonialRepo = async (id, data) => {
    try {
        const testimonial = await TestMonials_Modals_1.TestimonialModel.findById(id);
        if (!testimonial)
            throw new Error("Testimonial not found");
        const oldImage = testimonial.image;
        const oldVideo = testimonial.video;
        if (data.image) {
            if (oldImage && oldImage !== data.image)
                await (0, Delete_1.deleteUploadedFile)(oldImage);
            if (oldVideo) {
                await (0, Delete_1.deleteUploadedFile)(oldVideo);
            }
            data.video = "";
        }
        else if (data.video) {
            if (oldVideo && oldVideo !== data.video)
                await (0, Delete_1.deleteUploadedFile)(oldVideo);
            if (oldImage) {
                await (0, Delete_1.deleteUploadedFile)(oldImage);
            }
            data.image = "";
        }
        await testimonial.updateOne(data);
        return await TestMonials_Modals_1.TestimonialModel.findById(id, { new: true });
    }
    catch (error) {
        throw new Error("Repository Error: " + error.message);
    }
};
exports.updateTestimonialRepo = updateTestimonialRepo;

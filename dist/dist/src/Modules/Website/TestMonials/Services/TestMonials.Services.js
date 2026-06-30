"use strict";
// Testimonials/Service.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTestimonialService = exports.deleteTestimonialService = exports.updateApprovalStatusService = exports.getAllTestimonialsService = exports.getApprovedTestimonialsService = exports.createTestimonialService = void 0;
const TestMonials_Repository_1 = require("../Repository/TestMonials.Repository");
const createTestimonialService = async (data) => {
    try {
        return await (0, TestMonials_Repository_1.createTestimonialRepo)(data);
    }
    catch (error) {
        throw new Error("Error in Service Layer (create): " + error.message);
    }
};
exports.createTestimonialService = createTestimonialService;
const getApprovedTestimonialsService = async () => {
    try {
        return await (0, TestMonials_Repository_1.getApprovedTestimonialsRepo)();
    }
    catch (error) {
        throw new Error("Error in Service Layer (get approved): " + error.message);
    }
};
exports.getApprovedTestimonialsService = getApprovedTestimonialsService;
const getAllTestimonialsService = async (page, limit, isDraft) => {
    try {
        return await (0, TestMonials_Repository_1.getAllTestimonialsRepo)(page, limit, isDraft);
    }
    catch (error) {
        throw new Error("Error in Service Layer (get all): " + error.message);
    }
};
exports.getAllTestimonialsService = getAllTestimonialsService;
const updateApprovalStatusService = async (id, approved, draft) => {
    try {
        return await (0, TestMonials_Repository_1.updateApprovalStatusRepo)(id, approved, draft);
    }
    catch (error) {
        throw new Error("Error in Service Layer (approval): " + error.message);
    }
};
exports.updateApprovalStatusService = updateApprovalStatusService;
const deleteTestimonialService = async (testimonialId) => {
    try {
        await (0, TestMonials_Repository_1.deleteTestimionialRepo)(testimonialId);
        return "Testimonial Deleted Successfully!";
    }
    catch (err) {
        throw new Error("Service error: " + err.message);
    }
};
exports.deleteTestimonialService = deleteTestimonialService;
const updateTestimonialService = async (id, data) => {
    try {
        return await (0, TestMonials_Repository_1.updateTestimonialRepo)(id, data);
    }
    catch (error) {
        throw new Error("Service error: " + error.message);
    }
};
exports.updateTestimonialService = updateTestimonialService;

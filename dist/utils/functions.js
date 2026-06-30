"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectionMap = void 0;
const Blogs_Modals_1 = require("../Modules/Website/Blogs/Modals/Blogs.Modals");
const Careers_Modals_1 = require("../Modules/Website/Careers/Modals/Careers.Modals");
const Gallery_Modals_1 = require("../Modules/Website/Gallery/Modals/Gallery.Modals");
const TestMonials_Modals_1 = require("../Modules/Website/TestMonials/Modals/TestMonials.Modals");
exports.collectionMap = {
    blog: Blogs_Modals_1.BlogModel,
    testimonial: TestMonials_Modals_1.TestimonialModel,
    gallery: Gallery_Modals_1.GalleryModel,
    job: Careers_Modals_1.JobModel
};

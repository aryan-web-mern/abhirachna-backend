"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalleryModel = exports.GallerySaveModel = exports.GalleryLikeModel = void 0;
const mongoose_1 = require("mongoose");
const GallerySchema = new mongoose_1.Schema({
    imageName: { type: String, required: true },
    imageKey: { type: String, required: true },
    theme: { type: String, required: true },
    published: { type: Boolean, default: false },
    draft: { type: Boolean, default: true },
    subheading: { type: String },
    storage: { type: String },
    uploadedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "Employee", required: true },
}, { timestamps: true });
const GalleryLikeSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Employee", required: true },
    galleryId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Gallery", required: true },
}, { timestamps: true });
exports.GalleryLikeModel = (0, mongoose_1.model)("GalleryLike", GalleryLikeSchema);
const GallerySaveSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Employee", required: true },
    galleryId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Gallery", required: true },
}, { timestamps: true });
exports.GallerySaveModel = (0, mongoose_1.model)("GallerySave", GallerySaveSchema);
GallerySchema.post("deleteOne", { document: true, query: false }, async function () {
    const galleryId = this._id;
    await exports.GalleryLikeModel.deleteMany({ galleryId });
    await exports.GallerySaveModel.deleteMany({ galleryId });
});
exports.GalleryModel = (0, mongoose_1.model)("Gallery", GallerySchema);

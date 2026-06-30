"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicIdFromCloudinaryUrl = getPublicIdFromCloudinaryUrl;
exports.deleteFromCloudinary = deleteFromCloudinary;
exports.deleteUploadedFile = deleteUploadedFile;
const cloudinary_config_1 = __importDefault(require("./cloudinary.config"));
const S3Delete_1 = require("../S3Delete/S3Delete");
function getPublicIdFromCloudinaryUrl(url) {
    if (!url?.includes("cloudinary.com")) {
        return null;
    }
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-zA-Z0-9]+)?$/);
    return match ? decodeURIComponent(match[1]) : null;
}
async function deleteFromCloudinary(urlOrPublicId) {
    if (!urlOrPublicId) {
        return;
    }
    const publicId = urlOrPublicId.includes("cloudinary.com")
        ? getPublicIdFromCloudinaryUrl(urlOrPublicId)
        : urlOrPublicId;
    if (!publicId) {
        throw new Error("Could not resolve Cloudinary public_id for delete.");
    }
    await cloudinary_config_1.default.uploader.destroy(publicId, { resource_type: "auto" });
}
async function deleteUploadedFile(urlOrKey) {
    if (!urlOrKey) {
        return;
    }
    if (urlOrKey.includes("cloudinary.com")) {
        await deleteFromCloudinary(urlOrKey);
        return;
    }
    await (0, S3Delete_1.deleteFromS3)(urlOrKey);
}

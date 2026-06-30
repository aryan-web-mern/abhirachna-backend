"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGalleryService = exports.unpublishGalleryService = exports.publishGalleryService = exports.deleteGalleryService = exports.getGalleryByIdService = exports.getFilteredGalleryService = exports.saveGalleryService = exports.likeGalleryService = exports.getAllGalleryService = exports.uploadGalleryService = void 0;
const Gallery_Repositroy_1 = require("../Repositroy/Gallery.Repositroy");
const uploadGalleryService = async (data) => {
    try {
        return await (0, Gallery_Repositroy_1.uploadGalleryRepository)(data);
    }
    catch (err) {
        throw new Error("Service error uploadGallery ");
    }
};
exports.uploadGalleryService = uploadGalleryService;
const getAllGalleryService = async (userId, page, limit, draft, published) => {
    try {
        return await (0, Gallery_Repositroy_1.getAllGalleryRepository)(userId, page, limit, draft, published);
    }
    catch (err) {
        throw new Error("Service error getAllGallery ");
    }
};
exports.getAllGalleryService = getAllGalleryService;
const likeGalleryService = async (id, userId) => {
    try {
        return await (0, Gallery_Repositroy_1.likeGalleryRepository)(id, userId);
    }
    catch (err) {
        throw new Error("Service error likeGallery ");
    }
};
exports.likeGalleryService = likeGalleryService;
const saveGalleryService = async (id, userId) => {
    try {
        return await (0, Gallery_Repositroy_1.saveGalleryRepository)(id, userId);
    }
    catch (err) {
        console.log(err, 'eror*****************************');
        throw new Error("Service error saveGallery ");
    }
};
exports.saveGalleryService = saveGalleryService;
const getFilteredGalleryService = async (userId, filter, page, limit) => {
    try {
        return await (0, Gallery_Repositroy_1.getFilteredGalleryRepository)(userId, page, limit, filter);
    }
    catch (err) {
        throw new Error("Service error saveGallery ");
    }
};
exports.getFilteredGalleryService = getFilteredGalleryService;
const getGalleryByIdService = async (id) => {
    try {
        return await (0, Gallery_Repositroy_1.getGalleryByIdRepository)(id);
    }
    catch (err) {
        throw new Error("Service error getAllGallery ");
    }
};
exports.getGalleryByIdService = getGalleryByIdService;
const deleteGalleryService = async (galleryId) => {
    try {
        await (0, Gallery_Repositroy_1.deleteGalleryRepo)(galleryId);
        return "Gallery Deleted Successfully!";
    }
    catch (err) {
        throw new Error("Service error: " + err.message);
    }
};
exports.deleteGalleryService = deleteGalleryService;
const publishGalleryService = async (id, published, draft) => {
    try {
        await (0, Gallery_Repositroy_1.publishGalleryRepo)(id, published, draft);
        return "Gallery Published Successfully!";
    }
    catch (err) {
        throw new Error("Service error: " + err.message);
    }
};
exports.publishGalleryService = publishGalleryService;
const unpublishGalleryService = async (id, published, draft) => {
    try {
        await (0, Gallery_Repositroy_1.unpublishGalleryRepo)(id, published, draft);
        return "Gallery Unpublished Successfully!";
    }
    catch (err) {
        throw new Error("Service error: " + err.message);
    }
};
exports.unpublishGalleryService = unpublishGalleryService;
const updateGalleryService = async (GalleryId, userId, updateData) => {
    try {
        return await (0, Gallery_Repositroy_1.updateGalleryRepo)(GalleryId, userId, updateData);
    }
    catch (err) {
        throw new Error("Service error: " + err.message);
    }
};
exports.updateGalleryService = updateGalleryService;

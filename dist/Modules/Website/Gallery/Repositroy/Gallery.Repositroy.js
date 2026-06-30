"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGalleryRepo = exports.unpublishGalleryRepo = exports.publishGalleryRepo = exports.deleteGalleryRepo = exports.getGalleryByIdRepository = exports.getFilteredGalleryRepository = exports.saveGalleryRepository = exports.likeGalleryRepository = exports.getAllGalleryRepository = exports.uploadGalleryRepository = void 0;
const S3Delete_1 = require("../../../../Middlewares/Multers/S3Delete/S3Delete");
const gallery_helper_1 = require("../Helpers/gallery.helper");
const Gallery_Modals_1 = require("../Modals/Gallery.Modals");
const uploadGalleryRepository = async (data) => {
    try {
        return await Gallery_Modals_1.GalleryModel.create(data);
    }
    catch (err) {
        throw new Error("Repo error (uploadGallery): " + err.message);
    }
};
exports.uploadGalleryRepository = uploadGalleryRepository;
const getAllGalleryRepository = async (userId, page = 1, limit = 10, draft, published) => {
    try {
        const skip = (page - 1) * limit;
        // Total gallery count
        const totalCount = await Gallery_Modals_1.GalleryModel.countDocuments({ draft, published });
        let galleryData = [];
        const all = galleryData = await Gallery_Modals_1.GalleryModel.find({ draft, published })
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(limit);
        galleryData = all;
        if (userId) {
            const liked = await Gallery_Modals_1.GalleryLikeModel.find({ userId });
            const saved = await Gallery_Modals_1.GallerySaveModel.find({ userId });
            galleryData = await Promise.all(all.map(async (img) => {
                const isLiked = liked.some((l) => l.galleryId.toString() === img._id.toString());
                const isSaved = saved.some((s) => s.galleryId.toString() === img._id.toString());
                return { ...img.toObject(), isLiked, isSaved };
            }));
        }
        return {
            total: totalCount,
            page,
            limit,
            galleries: galleryData,
        };
    }
    catch (err) {
        throw new Error("Repo error (getAllGallery): " + err.message);
    }
};
exports.getAllGalleryRepository = getAllGalleryRepository;
const likeGalleryRepository = async (galleryId, userId) => {
    try {
        const existing = await Gallery_Modals_1.GalleryLikeModel.findOne({ galleryId, userId });
        if (existing) {
            await Gallery_Modals_1.GalleryLikeModel.deleteOne({ _id: existing._id });
            return { liked: false };
        }
        else {
            await Gallery_Modals_1.GalleryLikeModel.create({ galleryId, userId });
            return { liked: true };
        }
    }
    catch (err) {
        throw new Error("Repo error (likeGallery): " + err.message);
    }
};
exports.likeGalleryRepository = likeGalleryRepository;
const saveGalleryRepository = async (galleryId, userId) => {
    try {
        const existing = await Gallery_Modals_1.GallerySaveModel.findOne({ galleryId, userId });
        if (existing) {
            await Gallery_Modals_1.GallerySaveModel.deleteOne({ _id: existing._id });
            return { saved: false };
        }
        else {
            await Gallery_Modals_1.GallerySaveModel.create({ galleryId, userId });
            return { saved: true };
        }
    }
    catch (err) {
        throw new Error("Repo error (saveGallery): " + err.message);
    }
};
exports.saveGalleryRepository = saveGalleryRepository;
const getFilteredGalleryRepository = async (userId, page = 1, limit = 10, filter = '') => {
    try {
        const skip = (page - 1) * limit;
        let Gallerydata = [];
        let totalCount = 0;
        if (filter === 'liked') {
            const [data, likedTotalCount] = await Promise.all([
                Gallery_Modals_1.GalleryLikeModel.find({ userId }).sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit).populate('galleryId'),
                Gallery_Modals_1.GalleryLikeModel.countDocuments({ userId }),
            ]);
            Gallerydata = data;
            totalCount = likedTotalCount;
        }
        else if (filter === 'saved') {
            const [data, savedtotalCount] = await Promise.all([
                Gallery_Modals_1.GallerySaveModel.find({ userId }).sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit).populate('galleryId'),
                Gallery_Modals_1.GallerySaveModel.countDocuments({ userId }),
            ]);
            Gallerydata = data;
            totalCount = savedtotalCount;
        }
        const likedIds = filter === 'saved' ? await (0, gallery_helper_1.getUserLikedGalleryIds)(userId) : [];
        const savedIds = filter === 'liked' ? await (0, gallery_helper_1.getUserSavedGalleryIds)(userId) : [];
        const galleryWithFlags = await Promise.all(Gallerydata.map(async (img) => {
            let isLiked = filter === 'liked' ? true : likedIds.includes(img._id);
            let isSaved = filter === 'saved' ? true : savedIds.includes(img._id);
            return { ...img.toObject().galleryId, isLiked, isSaved };
        }));
        return {
            total: totalCount,
            page,
            limit,
            galleries: galleryWithFlags,
        };
    }
    catch (err) {
        throw new Error("Repo error (getAllGallery): " + err.message);
    }
};
exports.getFilteredGalleryRepository = getFilteredGalleryRepository;
const getGalleryByIdRepository = async (galleryId) => {
    try {
        const data = await Gallery_Modals_1.GalleryModel.findById(galleryId);
        if (!data) {
            return null;
        }
        return data;
    }
    catch (err) {
        throw new Error("Repo error (likeGallery): " + err.message);
    }
};
exports.getGalleryByIdRepository = getGalleryByIdRepository;
const deleteGalleryRepo = async (galleryId) => {
    try {
        const gal = await Gallery_Modals_1.GalleryModel.findById(galleryId);
        if (!gal)
            throw new Error("Blog not found!");
        await gal.deleteOne();
        return "Gallery item deleted successfully!";
    }
    catch (err) {
        throw new Error(err.message);
    }
};
exports.deleteGalleryRepo = deleteGalleryRepo;
const publishGalleryRepo = async (id, published, draft) => {
    try {
        return await Gallery_Modals_1.GalleryModel.findByIdAndUpdate(id, { published, draft });
    }
    catch (err) {
        throw new Error("Repo error: " + err.message);
    }
};
exports.publishGalleryRepo = publishGalleryRepo;
const unpublishGalleryRepo = async (id, published, draft) => {
    try {
        return await Gallery_Modals_1.GalleryModel.findByIdAndUpdate(id, { published, draft });
    }
    catch (error) {
    }
};
exports.unpublishGalleryRepo = unpublishGalleryRepo;
const updateGalleryRepo = async (GalleryId, userId, updateData) => {
    try {
        const gallery = await Gallery_Modals_1.GalleryModel.findById(GalleryId);
        if (!gallery)
            throw new Error("Gallery not found or user not authorized");
        const oldGallery = gallery?.imageKey;
        await gallery.updateOne(updateData);
        if (updateData?.imageKey && oldGallery)
            await (0, S3Delete_1.deleteFromS3)(oldGallery);
        return gallery;
    }
    catch (err) {
        throw new Error("Repo error: " + err.message);
    }
};
exports.updateGalleryRepo = updateGalleryRepo;

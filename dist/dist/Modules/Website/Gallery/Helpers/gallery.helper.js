"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserSavedGalleryIds = exports.getUserLikedGalleryIds = void 0;
const Gallery_Modals_1 = require("../Modals/Gallery.Modals");
const getUserLikedGalleryIds = async (userId) => {
    const ids = await Gallery_Modals_1.GalleryLikeModel.distinct('galleryId', { userId });
    return ids.map((id) => id.toString());
};
exports.getUserLikedGalleryIds = getUserLikedGalleryIds;
const getUserSavedGalleryIds = async (userId) => {
    const ids = await Gallery_Modals_1.GallerySaveModel.distinct('galleryId', { userId });
    return ids.map((id) => id.toString());
};
exports.getUserSavedGalleryIds = getUserSavedGalleryIds;

import { Types } from 'mongoose';
import { GalleryLikeModel, GallerySaveModel } from "../Modals/Gallery.Modals";

export const getUserLikedGalleryIds = async (userId: string): Promise<string[]> => {
  const ids = await GalleryLikeModel.distinct('galleryId', { userId });
  return ids.map((id: Types.ObjectId) => id.toString());
};

export const getUserSavedGalleryIds = async (userId: string): Promise<string[]> => {
  const ids = await GallerySaveModel.distinct('galleryId', { userId });
  return ids.map((id: Types.ObjectId) => id.toString());
};
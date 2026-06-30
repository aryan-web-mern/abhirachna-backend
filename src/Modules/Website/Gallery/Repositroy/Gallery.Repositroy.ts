import { deleteUploadedFile } from "../../../../Middlewares/Multers/Cloudinary/Delete";
import { getUserLikedGalleryIds, getUserSavedGalleryIds } from "../Helpers/gallery.helper";
import { GalleryLikeModel, GalleryModel, GallerySaveModel } from "../Modals/Gallery.Modals";

export const uploadGalleryRepository = async (data: any) => {
  try {
    return await GalleryModel.create(data);
  } catch (err: any) {
    throw new Error("Repo error (uploadGallery): " + err.message);
  }
};

export const getAllGalleryRepository = async (userId?: string, page = 1, limit = 10, draft?: boolean, published?: boolean) => {
  try {
    const skip = (page - 1) * limit;

    // Total gallery count
    const totalCount = await GalleryModel.countDocuments({draft, published});
    let galleryData = [];
    const all = galleryData = await GalleryModel.find({draft, published})
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    galleryData = all;

    if (userId) {
      const liked = await GalleryLikeModel.find({ userId });
      const saved = await GallerySaveModel.find({ userId });
      galleryData = await Promise.all(
        all.map(async (img: any) => {
          const isLiked = liked.some((l) => l.galleryId.toString() === img._id.toString());
          const isSaved = saved.some((s) => s.galleryId.toString() === img._id.toString());

          return { ...img.toObject(), isLiked, isSaved };
        })
      );
    }

    return {
      total: totalCount,
      page,
      limit,
      galleries: galleryData,
    };
  } catch (err: any) {
    throw new Error("Repo error (getAllGallery): " + err.message);
  }
};


export const likeGalleryRepository = async (galleryId: string, userId: string) => {
  try {
    const existing = await GalleryLikeModel.findOne({ galleryId, userId });
    if (existing) {
      await GalleryLikeModel.deleteOne({ _id: existing._id });
      return { liked: false };
    } else {
      await GalleryLikeModel.create({ galleryId, userId });
      return { liked: true };
    }
  } catch (err: any) {
    throw new Error("Repo error (likeGallery): " + err.message);
  }
};

export const saveGalleryRepository = async (galleryId: string, userId: string) => {
  try {
    const existing = await GallerySaveModel.findOne({ galleryId, userId });
    if (existing) {
      await GallerySaveModel.deleteOne({ _id: existing._id });
      return { saved: false };
    } else {
      await GallerySaveModel.create({ galleryId, userId });
      return { saved: true };
    }
  } catch (err: any) {
    throw new Error("Repo error (saveGallery): " + err.message);
  }
};

export const getFilteredGalleryRepository = async (userId: string, page = 1, limit = 10, filter = '') => {
  try {
    const skip = (page - 1) * limit;

    let Gallerydata: any[] = [];
    let totalCount = 0;

    if (filter === 'liked') {
      const [data, likedTotalCount] = await Promise.all([
        GalleryLikeModel.find({ userId }).sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit).populate('galleryId'),
        GalleryLikeModel.countDocuments({ userId }),
      ]);
      Gallerydata = data;
      totalCount = likedTotalCount
    } else if (filter === 'saved') {
      const [data, savedtotalCount] = await Promise.all([
        GallerySaveModel.find({ userId }).sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit).populate('galleryId'),
        GallerySaveModel.countDocuments({ userId }),
      ])
      Gallerydata = data;
      totalCount = savedtotalCount
    }
    const likedIds = filter === 'saved' ? await getUserLikedGalleryIds(userId) : [];
    const savedIds = filter === 'liked' ? await getUserSavedGalleryIds(userId) : [];

    const galleryWithFlags = await Promise.all(
      Gallerydata.map(async (img: any) => {

        let isLiked: Boolean = filter === 'liked' ? true : likedIds.includes(img._id);
        let isSaved: Boolean = filter === 'saved' ? true : savedIds.includes(img._id);

        return { ...img.toObject().galleryId, isLiked, isSaved };
      })
    );

    return {
      total: totalCount,
      page,
      limit,
      galleries: galleryWithFlags,
    };
  } catch (err: any) {
    throw new Error("Repo error (getAllGallery): " + err.message);
  }
};

export const getGalleryByIdRepository = async (galleryId: string) => {
  try {
    const data = await GalleryModel.findById(galleryId);
    if (!data) {
      return null
    }
    return data;

  } catch (err: any) {
    throw new Error("Repo error (likeGallery): " + err.message);
  }
};

export const deleteGalleryRepo = async (
  galleryId: string,
) => {
  try {
    const gal = await GalleryModel.findById(galleryId);
    if (!gal) throw new Error("Blog not found!");
    await gal.deleteOne();
    return "Gallery item deleted successfully!";

  } catch (err: any) {
    throw new Error(err.message);
  }
};

export const publishGalleryRepo = async (id: string, published: boolean, draft: boolean) => {
  try {
    return await GalleryModel.findByIdAndUpdate(id, { published, draft });
  } catch (err: any) {
    throw new Error("Repo error: " + err.message);
  }
};

export const unpublishGalleryRepo = async (id: string, published: boolean, draft: boolean) => {
  try {
    return await GalleryModel.findByIdAndUpdate(id, { published, draft });
  } catch (error) {

  }
}


export const updateGalleryRepo = async (GalleryId: string, userId: string, updateData: any) => {
  try {
    const gallery = await GalleryModel.findById(GalleryId)
    if (!gallery) throw new Error("Gallery not found or user not authorized");
    const oldGallery = gallery?.imageKey
    await gallery.updateOne(updateData)

    if(updateData?.imageKey && oldGallery) await deleteUploadedFile(oldGallery)

    return gallery;
  } catch (err: any) {
    throw new Error("Repo error: " + err.message);
  }
};
import { error } from "console";
import { deleteGalleryRepo, getAllGalleryRepository, getFilteredGalleryRepository, getGalleryByIdRepository, likeGalleryRepository, publishGalleryRepo, saveGalleryRepository, unpublishGalleryRepo, updateGalleryRepo, uploadGalleryRepository } from "../Repositroy/Gallery.Repositroy";

export const 










uploadGalleryService = async (data: any) => {
  try {
    return await uploadGalleryRepository(data);
  } catch (err: any) {
    throw new Error("Service error uploadGallery ");
  }
};

export const getAllGalleryService = async (userId?: string, page?: number, limit?: number, draft?: boolean, published?: boolean) => {
  try {
    return await getAllGalleryRepository(userId, page, limit, draft, published);
  } catch (err: any) {
    throw new Error("Service error getAllGallery ");
  }
};

export const likeGalleryService = async (id: string, userId: string) => {
  try {
    return await likeGalleryRepository(id, userId);
  } catch (err: any) {
    throw new Error("Service error likeGallery " );
  }
};

export const saveGalleryService = async (id: string, userId: string) => {
  try {
    return await saveGalleryRepository(id, userId);
  } catch (err: any) {
    console.log(err,'eror*****************************')
    throw new Error("Service error saveGallery ");
  }
};


export const getFilteredGalleryService = async (userId: string,
  filter: string,
  page: number,
  limit: number) => {
  try {
    return await getFilteredGalleryRepository(userId, page, limit, filter);
  } catch (err: any) {
    throw new Error("Service error saveGallery ");
  }
};

export const getGalleryByIdService = async (id: string) => {
  try {
    return await getGalleryByIdRepository(id);
  } catch (err: any) {
    throw new Error("Service error getAllGallery ");
  }
};

export const deleteGalleryService = async (
  galleryId: string,
) => {
  try {
    await deleteGalleryRepo(galleryId);
    return "Gallery Deleted Successfully!"
  } catch (err: any) {
    throw new Error("Service error: " + err.message);
  }
};

export const publishGalleryService = async (id: string,published:boolean,draft:boolean) => {
  try {
    await publishGalleryRepo(id,published,draft);
    return "Gallery Published Successfully!";
  } catch (err: any) {
    throw new Error("Service error: " + err.message);
  }
};

export const unpublishGalleryService = async (id: string,published:boolean,draft:boolean) => {
  try {
    await unpublishGalleryRepo(id,published,draft);
    return "Gallery Unpublished Successfully!";
  } catch (err: any) {
    throw new Error("Service error: " + err.message);
  }
};

export const updateGalleryService=async(GalleryId:string, userId:string, updateData:string)=>{
  try {
    return await updateGalleryRepo(GalleryId, userId, updateData);
  } catch (err: any) {
    throw new Error("Service error: " + err.message);
  }
}
import express from 'express';
import { uploadCloudinaryGallery } from '../../../Middlewares/Multers/Cloudinary/Uploads';
import { deleteGalleryController, getAllGalleryController, getGalleryByIdController, getSaveAndLikeddGalleryController, likeGalleryController, publishGalleryController, saveGalleryController, unpublishGalleryController, updateGalleryController, uploadGalleryController } from './Controllers/Gallery.Controllers';
import {checkRole} from "../../../Middlewares/Auth/CheckDesignation"
import {checkAuth} from "../../../Middlewares/Auth/ValidateCokkies"

const router = express.Router();

router.post("/upload", checkAuth, checkRole(["Employee"]), uploadCloudinaryGallery.single("image"), uploadGalleryController);
router.get("/get-all", getAllGalleryController);
router.post("/like/:id", checkAuth, likeGalleryController);
router.post("/save/:id", checkAuth, saveGalleryController);
router.get("/get-filtered-gallery", checkAuth, getSaveAndLikeddGalleryController);
router.get("/:id", getGalleryByIdController);
router.delete("/:id", checkAuth, deleteGalleryController);
router.put("/:id/unpublish", checkAuth, checkRole(["Employee"]), unpublishGalleryController);
router.put("/:id/publish", checkAuth, checkRole(["Employee"]), publishGalleryController);
router.put("/:galleryId", uploadCloudinaryGallery.single("image"), checkAuth, checkRole(["Employee"]), updateGalleryController);



export default router;
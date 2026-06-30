import express from 'express'
import { checkAuth } from '../../../Middlewares/Auth/ValidateCokkies';
import requireParameters from '../../../Middlewares/Global/requireParameters';
import { uploadS3 } from '../../../Middlewares/Multers/S3Uploads/Uploads';
import { updateLeadToClosedController } from './Controllers/Closed.Controllers';

const router = express.Router();

router.put(
  "/:leadId",
  checkAuth,
  uploadS3.fields([{ name: "documents", maxCount: 10 }]),
  updateLeadToClosedController
);


export default router;
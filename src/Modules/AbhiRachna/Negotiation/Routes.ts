import express from 'express'
import { checkAuth } from '../../../Middlewares/Auth/ValidateCokkies';
import requireParameters from '../../../Middlewares/Global/requireParameters';
import { updateLeadToNegotiationController } from './Controllers/Negotiation.Controllers';
import { uploadS3 } from '../../../Middlewares/Multers/S3Uploads/Uploads';

const router = express.Router();

router.patch(
  "/:leadId/move-to-negotiation",

  checkAuth,
  uploadS3.fields([{ name: "documents", maxCount: 10 }]),
      requireParameters('Quatation', 'commentNegotiation'),
  updateLeadToNegotiationController
);


export default router;
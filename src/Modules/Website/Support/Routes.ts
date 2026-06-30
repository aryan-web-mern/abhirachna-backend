import express from 'express'
import { saveUserMsgController, scheduleMeetingController } from './Controller/Support.Controller';
import { uploadS3 } from '../../../Middlewares/Multers/S3Uploads/Uploads';

const router =express.Router();


router.post("/send-msg",saveUserMsgController);
router.post("/schedule-meeting",scheduleMeetingController);


export default router
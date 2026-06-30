import express from 'express'
import { approveDesigningByDirectorController, approveNegoByDirectorController } from './Controllers/Director.Controllers';
import { checkAuth } from '../../../Middlewares/Auth/ValidateCokkies';

const router =express.Router();


router.put("/request/token/:leadId",checkAuth, approveDesigningByDirectorController);
router.put("/request/nego-approve/:leadId",checkAuth, approveNegoByDirectorController);


export default router;

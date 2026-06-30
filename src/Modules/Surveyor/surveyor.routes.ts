import express from "express";
import LeadsRoutes from '../Surveyor/Leads/Routes'

const router = express.Router();


router.use("/", LeadsRoutes)

export default router;

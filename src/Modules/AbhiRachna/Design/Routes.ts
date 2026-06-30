import express from "express";
import { checkAuth } from "../../../Middlewares/Auth/ValidateCokkies";
import { changeToDesigningStatus } from "./Controller/Design.Controller";


const router = express.Router();
router.put("/status/:leadId", checkAuth, changeToDesigningStatus);


export default router;
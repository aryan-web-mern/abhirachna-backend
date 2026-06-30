import express from "express";
import { checkAuth } from "../../../Middlewares/Auth/ValidateCokkies";
import requireParameters from "../../../Middlewares/Global/requireParameters";
import { updateToTalkingController } from "./Controllers/TalkingLead.Controllers";


const router=express.Router();

router.put("/status/:id", checkAuth, updateToTalkingController);

export default router;
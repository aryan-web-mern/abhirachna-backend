import express from "express";
import {approveLeadBySurveyorController, createLeadController, getSurveyorLeadsController } from "./Controllers/Leads.Controllers";
import { checkAuth } from "../../../Middlewares/Auth/ValidateCokkies"
import {checkDesignation} from "../../../Middlewares/Auth/CheckDesignation"
import requireParameters from "../../../Middlewares/Global/requireParameters";

const router = express.Router();
router.put("/request/:id", checkAuth,checkDesignation(["surveyor"]), approveLeadBySurveyorController);
router.post("/lead", checkAuth,checkDesignation(["surveyor"]),requireParameters("name", "mobile", "email", "address"), createLeadController );
router.get("/surveyor-leads", checkAuth,checkDesignation(["surveyor"]), getSurveyorLeadsController);


export default router;




import express from "express";
import { createDesignOptionController, createEstimateExitingLeadController, createLeadWithEstimateController, deleteDesignOptionController, getAllDesignOptionsController, getEstimateByLeadIdController, getSingleDesignOptionController, updateDesignOptionController, updateEstimateExitingLeadController } from "./Controllers/Estimate.Controllers";
import requireParameters from "../../../Middlewares/Global/requireParameters";
import { checkAuth } from "../../../Middlewares/Auth/ValidateCokkies"



const router = express.Router();

router.post("/create-design-options",requireParameters("category","label","pricePerSqft"), createDesignOptionController);
router.get("/get-all-design-options", getAllDesignOptionsController);
router.get("/get-single-design-otpion/:id", getSingleDesignOptionController);
router.delete("/delete-design-options/:id", deleteDesignOptionController);
router.put("/update-design-options/:id", updateDesignOptionController);
router.post("/create-lead-with-estimate",checkAuth,requireParameters("name","mobile","address","AreaDetails","squareFeetRange","selectedDesignOptions","leadtype","layoutType"), createLeadWithEstimateController);
router.post("/create-estimate-existing-lead",checkAuth,requireParameters("AreaDetails","squareFeetRange","selectedDesignOptions","leadtype","leadId","layoutType"), createEstimateExitingLeadController);
router.get("/getestimate/:estimateId", getEstimateByLeadIdController);
router.put("/updateEstimate/:id",checkAuth, updateEstimateExitingLeadController);



export default router;

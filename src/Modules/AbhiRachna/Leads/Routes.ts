import express from "express";

import { addCollaboratorsController, addDiscount, approvedDesignByDesignerController, approvedDiscountReq, approvedDiscountReqManually, assignLeadController, createDiscountRequest, createLeadController, createLeadIssueController, getAllLeadMemberControler, getAllLeads, getAllLeadWithByStatus, getFilteredLeadsController, getLastDiscountReq, getLeadByIdController, getLeadLogsCountController, getLeadStatsController, getTop3LeadMembersController, getUpdatedLeadByIdController, removeCollaboratorsController, restoreLeadController, updateEstimateController, updateLeadController } from "./Controllers/Leads.Controllers";
import requireParameters from "../../../Middlewares/Global/requireParameters";
import { checkAuth } from "../../../Middlewares/Auth/ValidateCokkies"
import {checkDesignation, validateLeadsAccess} from "../../../Middlewares/Auth/CheckDesignation"

const router = express.Router();

router.post("/create",checkAuth,requireParameters("name","mobile","email","address","leadtype","estimateDone","referenceType"), createLeadController);
router.post("/update-estimate/:id",requireParameters("estimateDone"), checkAuth, updateEstimateController);

// routes/lead.routes.ts


router.put(
  "/assign/:id",
  requireParameters("assignedTo"),
  checkAuth,
 checkDesignation(["director"]), 
  assignLeadController
);
router.put("/update/:id",checkAuth, updateLeadController)


router.get("/get-all-leads/",checkAuth, validateLeadsAccess, getAllLeadWithByStatus)
router.get("/get-all-leads-user",checkAuth,getAllLeads)
router.get("/get-all-lead-member",checkAuth,getAllLeadMemberControler)
router.get("/get-lead-by-id",checkAuth,getLeadByIdController)
router.get("/get-lead-stats",checkAuth,getLeadStatsController)
router.put("/approve-lead-designer/:id",checkAuth,approvedDesignByDesignerController)
router.put("/restore-lead/:id",checkAuth, checkDesignation(["director", "personal_assistant"]),restoreLeadController)
router.post("/add-collaborators",checkAuth, addCollaboratorsController)
router.put("/remove-collaborators",checkAuth,checkDesignation(["director", "personal_assistant"]), removeCollaboratorsController)
router.get("/:leadId/top-members", checkAuth, getTop3LeadMembersController);
router.get("/get-updated-lead/:leadId",checkAuth, getUpdatedLeadByIdController);
router.get("/get-filtered-leads",checkAuth, getFilteredLeadsController);
router.get("/get-lead-logsCount",checkAuth,checkDesignation(["director", "personal_assistant", "salesman", "designer"]), getLeadLogsCountController);
router.put("/create-issue-lead/:id",checkAuth, createLeadIssueController);
router.put("/create-discount-request/:id",checkAuth,checkDesignation(['salesman']),requireParameters("quotation", "discountPercent", "leadName"), createDiscountRequest)
router.put("/add-discount/:id",checkAuth,checkDesignation(['salesman', "director", "personal_assistant"]), addDiscount)
router.put("/approve-discount-request/:id",checkAuth,checkDesignation(['director', "personal_assistant" ]),  approvedDiscountReq)
router.put("/approve-discount-request-manual/:id",checkAuth,checkDesignation(['director', "personal_assistant" ]), requireParameters("leadId", "Quatation"), approvedDiscountReqManually)
router.get("/last-discount-req/:id",checkAuth, getLastDiscountReq)





export default router;




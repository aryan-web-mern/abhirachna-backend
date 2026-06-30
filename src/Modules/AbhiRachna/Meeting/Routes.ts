import express from "express";
import { checkAuth } from "../../../Middlewares/Auth/ValidateCokkies";
import requireParameters from "../../../Middlewares/Global/requireParameters";
import { completeMeetingController, createMeetingController, deleteMeetingController, editMeetingController, getLeadNumberAndName, getMeetingListByDateController, getMeetingListByMonth } from "./Controller/Meeting.Controller";
const router = express.Router();


router.post("/create-meeting", requireParameters("date", "starttime", "meetingType", "leadId"), checkAuth, createMeetingController);
router.patch("/complete-meeting", requireParameters("meetingId", "leadId"), checkAuth, completeMeetingController);
router.get("/get-all-lead-name-number", checkAuth, getLeadNumberAndName);
router.get("/get-meetings-by-month", checkAuth, getMeetingListByMonth);
router.get("/get-meetings-by-date", checkAuth, getMeetingListByDateController);
router.put("/edit-meeting", requireParameters("meetingId", "date", "starttime", "meetingType"), checkAuth, editMeetingController);
router.delete("/delete-meeting/:meetingId", checkAuth, deleteMeetingController);





export default router;
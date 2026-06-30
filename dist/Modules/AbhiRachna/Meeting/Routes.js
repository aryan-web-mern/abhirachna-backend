"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ValidateCokkies_1 = require("../../../Middlewares/Auth/ValidateCokkies");
const requireParameters_1 = __importDefault(require("../../../Middlewares/Global/requireParameters"));
const Meeting_Controller_1 = require("./Controller/Meeting.Controller");
const router = express_1.default.Router();
router.post("/create-meeting", (0, requireParameters_1.default)("date", "starttime", "meetingType", "leadId"), ValidateCokkies_1.checkAuth, Meeting_Controller_1.createMeetingController);
router.patch("/complete-meeting", (0, requireParameters_1.default)("meetingId", "leadId"), ValidateCokkies_1.checkAuth, Meeting_Controller_1.completeMeetingController);
router.get("/get-all-lead-name-number", ValidateCokkies_1.checkAuth, Meeting_Controller_1.getLeadNumberAndName);
router.get("/get-meetings-by-month", ValidateCokkies_1.checkAuth, Meeting_Controller_1.getMeetingListByMonth);
router.get("/get-meetings-by-date", ValidateCokkies_1.checkAuth, Meeting_Controller_1.getMeetingListByDateController);
router.put("/edit-meeting", (0, requireParameters_1.default)("meetingId", "date", "starttime", "meetingType"), ValidateCokkies_1.checkAuth, Meeting_Controller_1.editMeetingController);
router.delete("/delete-meeting/:meetingId", ValidateCokkies_1.checkAuth, Meeting_Controller_1.deleteMeetingController);
exports.default = router;

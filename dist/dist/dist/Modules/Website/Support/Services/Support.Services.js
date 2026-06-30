"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleMeetingService = exports.saveUserMsgService = void 0;
const contactUsMail_1 = require("../../../../Services/templates/contactUsMail");
const mailer_1 = __importDefault(require("../../../../Services/mailer"));
const sendMeetingMailToAdmn_1 = require("../../../../Services/sendMeetingMailToAdmn");
const Support_Repository_1 = require("../Repository/Support.Repository");
const saveUserMsgService = async (data) => {
    try {
        const msg = await (0, Support_Repository_1.createSupportMsg)(data);
        const htmlContent = (0, contactUsMail_1.generateContactMsgMailHtml)(msg);
        const mailPayload = {
            to: "abhirachnaasolutions@gmail.com.rani@psquarecompany.com",
            subject: "ContactUs Message",
            html: htmlContent,
        };
        (0, mailer_1.default)(mailPayload);
    }
    catch (err) {
        throw new Error("Service error: " + err.message);
    }
};
exports.saveUserMsgService = saveUserMsgService;
const scheduleMeetingService = async (data) => {
    try {
        const msg = await (0, Support_Repository_1.scheduleMeeting)(data);
        (0, sendMeetingMailToAdmn_1.sendMeetingMailToAdmn)(msg, data?.customerTimeZone);
        return msg;
    }
    catch (err) {
        throw new Error("Service error: " + err.message);
    }
};
exports.scheduleMeetingService = scheduleMeetingService;

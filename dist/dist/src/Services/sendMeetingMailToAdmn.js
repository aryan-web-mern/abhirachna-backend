"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMeetingMailToAdmn = void 0;
const mailer_1 = __importDefault(require("./mailer"));
const meetingMailTemplate_1 = require("./templates/meetingMailTemplate");
const sendMeetingMailToAdmn = async (msg, customerTimeZone) => {
    const plainMsg = msg?.toObject();
    const htmlContent = (0, meetingMailTemplate_1.generateMeetingMailHtml)(plainMsg, customerTimeZone);
    const mailPayload = {
        to: "abhirachnaasolutions@gmail.com.rani@psquarecompany.com",
        subject: "New Meeting Request Submitted",
        html: htmlContent,
    };
    (0, mailer_1.default)(mailPayload);
};
exports.sendMeetingMailToAdmn = sendMeetingMailToAdmn;

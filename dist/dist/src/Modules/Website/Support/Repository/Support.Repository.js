"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleMeeting = exports.createSupportMsg = void 0;
const Support_Modals_1 = require("../Modals/Support.Modals");
const createSupportMsg = async (data) => {
    try {
        return await Support_Modals_1.SupportMsgModel.create(data);
    }
    catch (err) {
        throw new Error("Repo error: " + err.message);
    }
};
exports.createSupportMsg = createSupportMsg;
const scheduleMeeting = async (data) => {
    try {
        return await Support_Modals_1.ScheduledMeetingModel.create(data);
    }
    catch (err) {
        throw new Error("Repo error: " + err.message);
    }
};
exports.scheduleMeeting = scheduleMeeting;

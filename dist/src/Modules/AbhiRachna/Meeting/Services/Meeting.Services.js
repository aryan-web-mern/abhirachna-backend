"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMeetingServices = exports.EditMeetingServices = exports.getMeetingListByDateService = exports.getMeetingListByMonthService = exports.getLeadNumberAndNameService = exports.completeMeetingServices = exports.createMeetingServices = void 0;
const Meeting_Repository_1 = require("../Repository/Meeting.Repository");
const createMeetingServices = async (meetingData) => {
    try {
        const { date, starttime, meetingType, leadId, userId, timeZone } = meetingData;
        const newMeeting = await (0, Meeting_Repository_1.createMeetingRepo)({
            date,
            starttime,
            meetingType,
            leadId,
            userId,
            timeZone,
            userDesignation: meetingData.userDesignation
        });
        return newMeeting;
    }
    catch (error) {
        throw new Error(error?.message || "Error creating meeting");
    }
};
exports.createMeetingServices = createMeetingServices;
const completeMeetingServices = async (meetingId, userId, leadId) => {
    try {
        const updatedMeeting = await (0, Meeting_Repository_1.completeMeetingRepo)(meetingId, userId, leadId);
        return updatedMeeting;
    }
    catch (error) {
        throw new Error("Error completing meeting");
    }
};
exports.completeMeetingServices = completeMeetingServices;
const getLeadNumberAndNameService = async (userId, page, limit, designation, key) => {
    try {
        const leadInfo = await (0, Meeting_Repository_1.getLeadNumberAndNameRepo)(userId, page, limit, designation, key);
        return leadInfo;
    }
    catch (error) {
        throw new Error("Error retrieving lead information");
    }
};
exports.getLeadNumberAndNameService = getLeadNumberAndNameService;
const getMeetingListByMonthService = async (userId, date, userDesignation) => {
    try {
        const meetingsData = await (0, Meeting_Repository_1.getMeetingListByMonthRepo)(userId, date, userDesignation);
        return meetingsData;
    }
    catch (error) {
        throw new Error("Error retrieving lead information");
    }
};
exports.getMeetingListByMonthService = getMeetingListByMonthService;
const getMeetingListByDateService = async (userId, date, designation) => {
    try {
        const meetingsData = await (0, Meeting_Repository_1.getMeetingsByDateRepo)(userId, date, designation);
        return meetingsData;
    }
    catch (error) {
        throw new Error("Error retrieving lead information");
    }
};
exports.getMeetingListByDateService = getMeetingListByDateService;
const EditMeetingServices = async (meetingId, date, starttime, meetingType, userId, role) => {
    try {
        const updatedMeeting = await (0, Meeting_Repository_1.editMeetingRepo)(meetingId, date, starttime, meetingType, userId, role);
        return updatedMeeting;
    }
    catch (error) {
        throw new Error(error?.message || "Error editing meeting");
    }
};
exports.EditMeetingServices = EditMeetingServices;
const deleteMeetingServices = async (meetingId, userId, role) => {
    try {
        const result = await (0, Meeting_Repository_1.deleteMeetingRepo)(meetingId, userId, role);
        return result;
    }
    catch (error) {
        throw new Error("Error deleting meeting");
    }
};
exports.deleteMeetingServices = deleteMeetingServices;

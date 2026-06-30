"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMeetingController = exports.editMeetingController = exports.getMeetingListByDateController = exports.getMeetingListByMonth = exports.getLeadNumberAndName = exports.completeMeetingController = exports.createMeetingController = void 0;
const Api_1 = require("../../../../Api");
const Meeting_Services_1 = require("../Services/Meeting.Services");
const createMeetingController = async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.UNAUTHORIZED, "User not authenticated");
        }
        const userId = req?.user?._id;
        const { date, starttime, meetingType, leadId, timeZone } = req.body;
        if (starttime === "" || !leadId) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.BAD_REQUEST, "Not Allow Empty Fields");
        }
        const result = await (0, Meeting_Services_1.createMeetingServices)({
            date,
            starttime,
            meetingType,
            leadId,
            userId,
            timeZone,
            userDesignation: req.user?.designationId?.name,
        });
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, "Create Meeting Successfully");
    }
    catch (error) {
        next(error);
    }
};
exports.createMeetingController = createMeetingController;
const completeMeetingController = async (req, res, next) => {
    try {
        const { meetingId, leadId } = req.body;
        if (!req.user || !req.user._id) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.UNAUTHORIZED, "User not authenticated");
        }
        const userId = req.user?._id;
        if (!meetingId) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.BAD_REQUEST, "Meeting ID is required");
        }
        const result = await (0, Meeting_Services_1.completeMeetingServices)(meetingId, userId, leadId);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, "Meeting completed successfully");
    }
    catch (error) {
        next(error);
    }
};
exports.completeMeetingController = completeMeetingController;
const getLeadNumberAndName = async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.UNAUTHORIZED, "User not authenticated");
        }
        const userId = req.user?._id;
        const key = req.query?.key || "";
        const designation = req.user?.designationId?.name;
        const { page, limit } = req.query;
        const pageNum = Number(page);
        const limitNum = Number(limit);
        const leadInfo = await (0, Meeting_Services_1.getLeadNumberAndNameService)(userId, pageNum, limitNum, designation, key);
        if (!leadInfo) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.NOT_FOUND, "Lead not found");
        }
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, leadInfo);
    }
    catch (error) {
        next(error);
    }
};
exports.getLeadNumberAndName = getLeadNumberAndName;
const getMeetingListByMonth = async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.UNAUTHORIZED, "User not authenticated");
        }
        const userDesignation = req?.user?.designationId?.name;
        const userId = req.user?._id;
        const date = req.query?.date;
        const leadInfo = await (0, Meeting_Services_1.getMeetingListByMonthService)(userId, date, userDesignation);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, leadInfo);
    }
    catch (error) {
        next(error);
    }
};
exports.getMeetingListByMonth = getMeetingListByMonth;
const getMeetingListByDateController = async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.UNAUTHORIZED, "User not authenticated");
        }
        const userId = req.user?._id;
        const designation = req.user?.designationId?.name;
        const date = req.query?.date;
        const leadInfo = await (0, Meeting_Services_1.getMeetingListByDateService)(userId, date, designation);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, leadInfo);
    }
    catch (error) {
        next(error);
    }
};
exports.getMeetingListByDateController = getMeetingListByDateController;
const editMeetingController = async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.UNAUTHORIZED, "User not authenticated");
        }
        const userId = req.user?._id;
        const role = req.user?.designationId?.name;
        if (!role) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.BAD_REQUEST, "Role is missing");
        }
        const { meetingId, date, starttime, meetingType } = req.body;
        if (!meetingId) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.BAD_REQUEST, "Meeting ID is required");
        }
        const result = await (0, Meeting_Services_1.EditMeetingServices)(meetingId, date, starttime, meetingType, userId, role);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, "Meeting edited successfully");
    }
    catch (error) {
        next(error);
    }
};
exports.editMeetingController = editMeetingController;
const deleteMeetingController = async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.UNAUTHORIZED, "User not authenticated");
        }
        const userId = req.user?._id;
        const role = req.user?.designationId?.name;
        if (!role) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.BAD_REQUEST, "Role is missing");
        }
        const { meetingId } = req.params;
        if (!meetingId) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.BAD_REQUEST, "Meeting ID is required");
        }
        const result = await (0, Meeting_Services_1.deleteMeetingServices)(meetingId, userId, role);
        if (!result) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.NOT_FOUND, "Meeting not found");
        }
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, "Meeting deleted successfully");
    }
    catch (error) {
        next(error);
    }
};
exports.deleteMeetingController = deleteMeetingController;

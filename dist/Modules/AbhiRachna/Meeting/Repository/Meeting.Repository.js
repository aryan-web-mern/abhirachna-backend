"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMeetingRepo = exports.editMeetingRepo = exports.getMeetingsByDateRepo = exports.getMeetingListByMonthRepo = exports.getLeadNumberAndNameRepo = exports.completeMeetingRepo = exports.createMeetingRepo = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Meeting_Modals_1 = require("../Modals/Meeting.Modals");
const Leads_Modals_1 = require("../../Leads/Modals/Leads.Modals");
const TalkingLead_Modals_1 = require("../../TalkingLead/Modals/TalkingLead.Modals");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const createMeetingRepo = async (meetingData) => {
    try {
        const { date, starttime, meetingType, leadId, userId, timeZone, userDesignation, } = meetingData;
        const [day, month, year] = date.split("-").map(Number);
        const parsedDate = new Date(year, month - 1, day);
        if (userDesignation !== "director") {
            let isUserExist = await Leads_Modals_1.LeadModel.findOne({ assignedTo: userId });
            if (!isUserExist) {
                isUserExist = await TalkingLead_Modals_1.CollaborationModel.findOne({
                    memberId: userId,
                    leadId,
                });
            }
            const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
            if (!dateRegex.test(date)) {
                throw new Error("Invalid date format. Please use DD-MM-YYYY.");
            }
            if (parsedDate.toString() === "Invalid Date") {
                throw new Error("Invalid date provided.");
            }
            if (!isUserExist) {
                throw new Error("You don't have access to create a meeting for this lead.");
            }
        }
        const [hours, minutes] = starttime.split(":").map(Number);
        if (isNaN(hours) ||
            isNaN(minutes) ||
            hours < 0 ||
            hours > 23 ||
            minutes < 0 ||
            minutes > 59) {
            throw new Error("Invalid time format. Please use HH:mm in 24-hour format.");
        }
        const meetingDateTime = new Date(parsedDate);
        meetingDateTime.setHours(hours, minutes, 0, 0);
        const now = new Date();
        if (meetingDateTime < now) {
            throw new Error("Cannot schedule a meeting in the past.");
        }
        const leadDoc = await Leads_Modals_1.LeadModel.findById(leadId);
        const meetingsOfLeadAssignedToPerson = await Meeting_Modals_1.MeetingModal.aggregate([
            {
                $match: {
                    leadId: new mongoose_1.default.Types.ObjectId(leadId),
                    date: { $eq: date },
                    starttime,
                },
            },
            { $project: { _id: 1 } },
            { $count: "sum" },
        ]);
        // it checkss the meeting is already created by same user(logedInUser) at same time
        const isMeetingAlreadyScheduledByUser = await Meeting_Modals_1.MeetingModal.findOne({
            date,
            starttime,
            createdBy: userId,
        })
            .select("_id")
            .countDocuments();
        if (meetingsOfLeadAssignedToPerson.length) {
            throw new Error("A meeting is already scheduled at this time for this lead. Please choose a different time.");
        }
        if (meetingsOfLeadAssignedToPerson.length ||
            isMeetingAlreadyScheduledByUser) {
            throw new Error("A meeting is already scheduled by you at this time. Please choose a different time.");
        }
        // Create and save the new meeting
        const newMeeting = new Meeting_Modals_1.MeetingModal({
            date: date,
            starttime,
            meetingType,
            leadId,
            createdBy: userId,
            timeZone,
        });
        await newMeeting.save();
        return newMeeting;
    }
    catch (error) {
        console.log(error, "check error");
        throw new Error(error?.message || error || "Error creating meeting");
    }
};
exports.createMeetingRepo = createMeetingRepo;
const completeMeetingRepo = async (meetingId, userId, leadId) => {
    try {
        let isUserExist = await Leads_Modals_1.LeadModel.findOne({ assignedTo: userId });
        if (!isUserExist) {
            isUserExist = await TalkingLead_Modals_1.CollaborationModel.findOne({
                memberId: userId,
                leadId,
            });
        }
        if (!isUserExist) {
            throw new Error("You Dont Have Access to Create Meeting For this Lead..");
        }
        const updatedMeeting = await Meeting_Modals_1.MeetingModal.findByIdAndUpdate(meetingId, { status: "completed" }, { new: true });
        return updatedMeeting;
    }
    catch (error) {
        throw new Error("Error completing meeting");
    }
};
exports.completeMeetingRepo = completeMeetingRepo;
const getLeadNumberAndNameRepo = async (userId, page = 1, limit = 10, designation, key) => {
    try {
        let initPipeline = [
            {
                $match: { status: { $ne: "lost" } },
            },
        ];
        if (designation !== "director") {
            initPipeline.push({
                $match: { assignedTo: userId },
            }, {
                $unionWith: {
                    coll: "collaborations",
                    pipeline: [
                        {
                            $match: { memberId: userId },
                        },
                        {
                            $lookup: {
                                from: "leads",
                                localField: "leadId",
                                foreignField: "_id",
                                as: "lead",
                            },
                        },
                        { $unwind: "$lead" },
                        {
                            $project: {
                                _id: "$lead._id",
                                status: "$lead.status",
                                randomLeadId: "$lead.randomLeadId",
                                name: "$lead.name",
                            },
                        },
                    ],
                },
            });
        }
        console.log("keyyy", key);
        const skip = (page - 1) * limit;
        const leadInfo = await Leads_Modals_1.LeadModel.aggregate([
            ...initPipeline,
            {
                $match: {
                    status: { $nin: ["lost", "closed"] },
                    ...(key !== '' ? {
                        $or: [
                            {
                                $expr: {
                                    $regexMatch: {
                                        input: { $toString: "$randomLeadId" },
                                        regex: new RegExp(`${key}`, 'i')
                                    }
                                }
                            },
                            {
                                name: {
                                    $regex: new RegExp(`${key}`, 'i')
                                }
                            }
                        ]
                    } : {}),
                }
            },
            {
                $group: {
                    _id: "$_id",
                    randomLeadId: { $first: "$randomLeadId" },
                    name: { $first: "$name" },
                },
            },
            {
                $project: {
                    randomLeadId: 1,
                    name: 1,
                    _id: 1,
                },
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
            {
                $facet: {
                    data: [{ $skip: skip }, { $limit: limit }],
                    totalCount: [{ $count: "count" }],
                },
            },
            {
                $addFields: {
                    totalCount: {
                        $cond: [
                            { $gt: [{ $size: "$totalCount" }, 0] },
                            { $arrayElemAt: ["$totalCount.count", 0] },
                            0,
                        ],
                    },
                },
            },
        ]);
        return leadInfo;
    }
    catch (error) {
        throw new Error("Error retrieving lead information");
    }
};
exports.getLeadNumberAndNameRepo = getLeadNumberAndNameRepo;
const getMeetingListByMonthRepo = async (userId, date, userDesignation) => {
    try {
        const [month, year] = date.split(",");
        const paddedMonth = month.padStart(2, "0");
        const dateRegex = new RegExp(`^\\d{2}-${paddedMonth}-${year}$`);
        const assignedLeads = await Leads_Modals_1.LeadModel.find({ assignedTo: userId }, { _id: 1 }).lean();
        const assignedLeadIds = assignedLeads.map((lead) => lead._id);
        const collabLeads = await TalkingLead_Modals_1.CollaborationModel.find({ user_id: userId }, { lead_id: 1 }).lean();
        const collabLeadIds = collabLeads.map((collab) => collab.leadId);
        const allLeadIds = [...new Set([...assignedLeadIds, ...collabLeadIds])];
        const filter = {
            date: { $regex: dateRegex },
        };
        if (userDesignation !== "director") {
            filter.leadId = { $in: allLeadIds };
        }
        let meetings = await Meeting_Modals_1.MeetingModal.find(filter).populate({
            path: "leadId",
            match: { status: { $ne: "lost" } },
            select: "leadId randomLeadId name"
        });
        meetings = meetings.filter(m => m.leadId !== null);
        const nowUtc = moment_timezone_1.default.utc();
        const dailyStatus = {};
        meetings.forEach((meeting) => {
            const { date, starttime, timeZone } = meeting;
            const [day, mon, yr] = date.split("-");
            const [hour, minute] = starttime.split(":");
            const startLocal = moment_timezone_1.default.tz(`${yr}-${mon}-${day} ${hour}:${minute}`, "YYYY-MM-DD HH:mm", timeZone);
            // convert to utc
            const start = startLocal.utc();
            const end = (0, moment_timezone_1.default)(start).add(30, "minutes");
            const dateKey = `${day.padStart(2, "0")}-${mon.padStart(2, "0")}-${yr}`;
            if (!dailyStatus[dateKey]) {
                dailyStatus[dateKey] = { closed: 0, ongoing: 0, upcoming: 0 };
            }
            // for now maximum limit is 18 which is showing at frontend
            if (end.isBefore(nowUtc)) {
                dailyStatus[dateKey].closed = Math.min(dailyStatus[dateKey].closed + 1, 18);
            }
            else if (start.isAfter(nowUtc)) {
                dailyStatus[dateKey].upcoming = Math.min(dailyStatus[dateKey].upcoming + 1, 18);
            }
            else {
                dailyStatus[dateKey].ongoing = Math.min(dailyStatus[dateKey].ongoing + 1, 18);
            }
        });
        return dailyStatus;
    }
    catch (error) {
        console.log(error);
        throw new Error("Error retrieving lead information");
    }
};
exports.getMeetingListByMonthRepo = getMeetingListByMonthRepo;
const getMeetingsByDateRepo = async (userId, dateParam, designation) => {
    try {
        // Expected format: "25-08-2025"
        const query = { date: dateParam };
        if (designation !== "director") {
            const assignedLeads = await Leads_Modals_1.LeadModel.find({ assignedTo: userId }).lean();
            const assignedLeadIds = assignedLeads.map((lead) => lead._id);
            const collabLeads = await TalkingLead_Modals_1.CollaborationModel.find({
                memberId: userId,
            }).lean();
            const collabLeadIds = collabLeads.map((collab) => collab.leadId);
            const allLeadIds = [...new Set([...assignedLeadIds, ...collabLeadIds])];
            if (allLeadIds?.length) {
                query.leadId = { $in: allLeadIds };
            }
            else {
                query.leadId = { $in: [] };
            }
        }
        let meetings = await Meeting_Modals_1.MeetingModal.find(query)
            .populate({
            path: "leadId",
            match: { status: { $ne: "lost" } },
            select: "leadId randomLeadId name"
        })
            .sort("-createdAt")
            .populate("createdBy", "fullName _id");
        meetings = meetings.filter(m => m.leadId !== null);
        return meetings;
    }
    catch (error) {
        console.log(error);
        throw new Error("Error fetching meetings for the date");
    }
};
exports.getMeetingsByDateRepo = getMeetingsByDateRepo;
const editMeetingRepo = async (meetingId, date, starttime, meetingType, userId, role) => {
    try {
        const meeting = await Meeting_Modals_1.MeetingModal.findById(meetingId);
        if (!meeting) {
            throw new Error("Meeting not found");
        }
        if (meeting.createdBy.toString() !== userId && role !== "director") {
            throw new Error("You are not authorized to edit this meeting");
        }
        const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
        if (!dateRegex.test(date)) {
            throw new Error("Invalid date format. Please use DD-MM-YYYY.");
        }
        const [day, month, year] = date.split("-").map(Number);
        const parsedDate = new Date(year, month - 1, day);
        if (parsedDate.toString() === "Invalid Date") {
            throw new Error("Invalid date provided.");
        }
        const [hours, minutes] = starttime.split(":").map(Number);
        if (isNaN(hours) ||
            isNaN(minutes) ||
            hours < 0 ||
            hours > 23 ||
            minutes < 0 ||
            minutes > 59) {
            throw new Error("Invalid time format. Please use HH:mm in 24-hour format.");
        }
        const meetingDateTime = new Date(parsedDate);
        meetingDateTime.setHours(hours, minutes, 0, 0);
        if (meetingDateTime < new Date()) {
            throw new Error("Cannot schedule a meeting in the past.");
        }
        const leadId = meeting.leadId.toString();
        const conflictWithLead = await Meeting_Modals_1.MeetingModal.findOne({
            _id: { $ne: meetingId },
            date,
            starttime,
        }).select("_id");
        if (conflictWithLead) {
            throw new Error("Another meeting for this lead is already scheduled at this time. Please choose a different time.");
        }
        const conflictWithUser = await Meeting_Modals_1.MeetingModal.findOne({
            _id: { $ne: meetingId },
            createdBy: userId,
            date,
            starttime,
        }).select("_id");
        if (conflictWithUser) {
            throw new Error("You already have another meeting scheduled at this time. Please choose a different time.");
        }
        const updatedMeeting = await Meeting_Modals_1.MeetingModal.findByIdAndUpdate(meetingId, { date, starttime, meetingType }, { new: true });
        return updatedMeeting;
    }
    catch (error) {
        throw new Error(error?.message || "Error editing meeting");
    }
};
exports.editMeetingRepo = editMeetingRepo;
const deleteMeetingRepo = async (meetingId, userId, role) => {
    try {
        const meeting = await Meeting_Modals_1.MeetingModal.findById(meetingId);
        if (!meeting) {
            throw new Error("Meeting not found");
        }
        if (meeting.createdBy.toString() !== userId && role !== "director") {
            throw new Error("You are not authorized to delete this meeting");
        }
        await Meeting_Modals_1.MeetingModal.findByIdAndDelete(meetingId);
        return true;
    }
    catch (error) {
        throw new Error(error?.message || "Error deleting meeting");
    }
};
exports.deleteMeetingRepo = deleteMeetingRepo;

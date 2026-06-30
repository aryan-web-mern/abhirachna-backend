"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduledMeetingModel = exports.SupportMsgModel = void 0;
const mongoose_1 = require("mongoose");
const MsgSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    message: { type: String, required: true },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });
exports.SupportMsgModel = (0, mongoose_1.model)("SupportMsg", MsgSchema);
const ScheduledMeetingSchema = new mongoose_1.Schema({
    dateAndTime: { type: Date, required: true },
    phone: { type: String, required: true },
    message: { type: String },
    name: { type: String, required: false },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });
exports.ScheduledMeetingModel = (0, mongoose_1.model)("ScheduledMeeting", ScheduledMeetingSchema);

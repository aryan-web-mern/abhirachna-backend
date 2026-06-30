"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeetingModal = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const MeetingSchema = new mongoose_1.default.Schema({
    date: {
        type: String,
        required: true
    },
    starttime: {
        type: String,
        required: true
    },
    endtime: {
        type: String,
        required: false
    },
    leadId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Lead",
        required: true
    },
    timeZone: {
        type: String,
        required: true
    },
    meetingType: {
        type: String,
        enum: ["in-person", "virtual", "hybrid"],
        required: true,
        default: "in-person"
    },
    status: {
        type: String,
        enum: ["schedule", "completed", "cancelled", "miss"],
        required: true,
        default: "schedule"
    },
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: "user"
    }
}, { timestamps: true });
exports.MeetingModal = mongoose_1.default.model("Meeting", MeetingSchema);

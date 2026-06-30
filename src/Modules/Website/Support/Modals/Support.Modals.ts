import { Schema, model, Types, Document } from "mongoose";

export interface IMsg extends Document {
  name: string;
  phoneNumber: string;
  message: string;
  createdBy?: Types.ObjectId;
}
export interface IScheduledMeeting extends Document {
  dateAndTime: Date;
  phone: string;
  name?: string;
  message: string;
  createdBy?: Types.ObjectId;
}

const MsgSchema = new Schema<IMsg>(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    message: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);
export const SupportMsgModel = model<IMsg>("SupportMsg", MsgSchema);


const ScheduledMeetingSchema = new Schema<IScheduledMeeting>(
  {
    dateAndTime: { type: Date, required: true },
    phone: { type: String, required: true },
    message: { type: String },
    name: { type: String, required: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const ScheduledMeetingModel = model<IScheduledMeeting>("ScheduledMeeting", ScheduledMeetingSchema);

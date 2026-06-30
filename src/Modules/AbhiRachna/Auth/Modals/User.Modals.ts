import { ObjectType } from "aws-sdk/clients/clouddirectory";
import mongoose, { model, Schema } from "mongoose";
import { type } from "node:os";
import { Types } from "mongoose"


export interface IuserModel {
  fullName: string;
  phoneNumber: Number
  role: string
  email: string,
}

export interface ISessionSchema {
  userId: Types.ObjectId,
  sessionId: string,
  createdAt: Date,
  expiresAt: Date
}

const userSchema = new Schema<IuserModel>(
  {
    fullName: { type: String, required: true },
    email: {
      type: String, required: false,
    },
    phoneNumber: {
      type: Number, required: true, unique: false, maxlength: 10,
      minlength: 10,
      match: /^[0-9]{10}$/
    },
    role: {
      type: String,
      required: true,
      enum: ["Employee", "Customer"],
      default: "Customer",

    },
  },
  {
    timestamps: true,
  }
);

const userModel = model<IuserModel>("user", userSchema)
export { userModel }

const sessionSchema = new Schema<ISessionSchema>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true

    },
    sessionId: { type: String, required: true },
  }
)

export const sessionModel = model<ISessionSchema>("Session", sessionSchema)


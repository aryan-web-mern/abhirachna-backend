


import { Schema, model, Types, Document } from "mongoose";

export interface IJob extends Document {
    jobTitle: string;
    jobLocation: string;
    jobType: string;
    experience: string;
    requirements: string;
    responsibilities: string;
    perksAndBenefits: string;
    salary: string;
    bonus: string;
    summary: string;
    createdBy: Types.ObjectId;
    department: string;
    jobKey: string;
    draft: boolean;
    published: boolean;
}

export interface IAppliedJob extends Document {
    jobId: Types.ObjectId;
    appliedBy: Types.ObjectId;
    fullName: string;
    email: string;
    contact: string;
    fileName: string,
    fileKey: string;
    role: string;
}

const JobSchema = new Schema<IJob>({
    jobTitle: { type: String, required: true },
    jobLocation: { type: String, required: true },
    jobType: { type: String, required: true },
    experience: { type: String, required: true },
    requirements: [{ type: String, required: true }],
    responsibilities: [{ type: String, required: true }],
    perksAndBenefits: [{ type: String }],
    salary: { type: String },
    bonus: [{ type: String }],
    summary: { type: String, required: true },
    department: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "Emplooye", required: true },
    jobKey: { type: String, required: true },
    published: { type: Boolean, default: false },
    draft: { type: Boolean, default: true }
}, { timestamps: true });

export const JobModel = model<IJob>("Job", JobSchema);

const appliedJobSchema = new Schema<IAppliedJob>({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    contact: { type: String, required: true },
    fileName: { type: String, required: true },
    fileKey: { type: String, required: true },
    role: { type: String },
    jobId: { type: Schema.Types.ObjectId, ref: "Job" },
    appliedBy: { type: Schema.Types.ObjectId, ref: "User" },
},
    { timestamps: true }
);

export const AppliedJobModel = model<IAppliedJob>("AppliedJob", appliedJobSchema);
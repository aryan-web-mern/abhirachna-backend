import mongoose, { Schema, Document, Types } from "mongoose";


//collbartion
export interface ICollaboration extends Document {
  leadId: Types.ObjectId;
  addedBy: Types.ObjectId;
  memberId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}



const CollaborationSchema = new Schema<ICollaboration>(
  {
    leadId: { type: Schema.Types.ObjectId, ref: "Lead", required: true },
    addedBy: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    memberId: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
  },
  { timestamps: true }
);


export const CollaborationModel = mongoose.model<ICollaboration>("Collaboration", CollaborationSchema);
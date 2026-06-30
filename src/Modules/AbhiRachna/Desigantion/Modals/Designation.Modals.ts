import { model, Schema } from "mongoose";

export interface DesignationDetails {
 name: "director" | "salesman" | "designer" | "personal_assistant" | "client";
 description:string
}

const designationSchema = new Schema<DesignationDetails>({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ["director", "salesman", "designer", "personal_assistant", "client", 'surveyor'],
  },
  description:{
    type:String,
    required:false
  }
});

const DesignationModel = model<DesignationDetails>(
  "Designation",
  designationSchema
);

export { DesignationModel };
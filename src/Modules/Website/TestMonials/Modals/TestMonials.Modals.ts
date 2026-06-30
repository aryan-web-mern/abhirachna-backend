import mongoose, { Schema, Document, Types } from "mongoose";

// testimonial interface
export interface ITestimonial extends Document {
  fullName: string;
  phoneNumber: string;
  text: string;
  image?: string;  
  video?: string;  
  approved: boolean;
  draft: boolean;
  createdAt: Date;
  updatedAt: Date;
  type: string;

}

// testimonial schema
const TestimonialSchema: Schema<ITestimonial> = new Schema(
  {
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    text: { type: String, },
    image: { type: String },
    video: { type: String },
    approved: { type: Boolean, default: false },
    draft: { type: Boolean, default: true },
    type: {type: String, enum: ["visitor", "manual"], default: "manual"}
  },
  { timestamps: true }
);

export const TestimonialModel = mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);

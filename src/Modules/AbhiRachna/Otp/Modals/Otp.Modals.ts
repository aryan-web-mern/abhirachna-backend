import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IOtp extends Document {
  email: string;
  otp: string;
  phoneNumber:number;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const otpSchema: Schema<IOtp> = new Schema(
  {
    email: {
      type: String,
      required: false,
    },
    phoneNumber:{
      type:Number,
      required:false
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
       expires: 0
    },
  },
  {
    timestamps: true,
  }
);

const OtpModel: Model<IOtp> = mongoose.model<IOtp>('Otp', otpSchema);
export default OtpModel;

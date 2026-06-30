

import { userModel } from "../Modules/AbhiRachna/Auth/Modals/User.Modals"
import OtpModel from "../Modules/AbhiRachna/Otp/Modals/Otp.Modals";
import sendEmail from "./mailer";
import generateOtp from "./otp";


interface EmailPayload {
  to: string;
  subject: string;
  text: string;
  html: string;
}

async function sendOtpToEmail(email: string | undefined,isPassword=false): Promise<string> {
  try {

       if (isPassword) {
      const user = await userModel.findOne({ email });
      if (!user) {
        throw new Error("User with this email does not exist");
      }
    }

     await OtpModel.deleteMany({ email });
    const otp: string = generateOtp(4);

    const expiresInMinutes = 10;
    const expiresAt: Date = new Date(Date.now() + expiresInMinutes * 60000);

    await OtpModel.create({ email, otp, expiresAt });

    const subject = 'Your OTP Code';
    const text = `Your OTP code is: ${otp}`;
    const html = `<p>Your <b>OTP</b> code is: <strong>${otp}</strong></p>`;

    if(!email){
     throw new Error("Provide email id ")
    }
    const mailPayload: any = {
      to: email,
      subject,
      text,
      html,
    };

    await sendEmail(mailPayload);

    return otp;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to send OTP');
  }
}

export default sendOtpToEmail;

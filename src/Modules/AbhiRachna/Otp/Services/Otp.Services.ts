

import sendEmail from "../../../../Services/mailer";
import OtpModel from "../Modals/Otp.Modals";
import { createOtp, deleteExistingOtp, deleteOtp, findValidOtp } from "../Repository/Otp.Repository";

import bcrypt from "bcryptjs";
import { PassThrough } from "stream";
import { EmployeeModel } from "../../../AbhiRachna/Auth/Modals/Employees.Modals";
import generateOtp from "../../../../Services/otp";
import { ErrorResponse, STATUS_CODE } from "../../../../Api";
import { userModel } from "../../Auth/Modals/User.Modals";

interface EmailPayload {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export const forgotPasswordService = async (email: string): Promise<any> => {


  try {
    await deleteExistingOtp({ email })
    const otp: string = generateOtp(6);

    const expiresInMinutes = 10;
    const expiresAt: Date = new Date(Date.now() + expiresInMinutes * 60000);

    await createOtp({ email, otp, expiresAt });

    const subject = 'Your OTP Code';
    const text = `Your OTP code is: ${otp}`;
    const html = `<p>Your <b>OTP</b> code is: <strong>${otp}</strong></p>`;

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


};


export const verifyOtpService = async ({
  otpKey,
  otp,
  checkType
}: any): Promise<any> => {
  try {
    const query = {
      [checkType]: otpKey,
      otp
    }
    console.log('query', query)
    const verifyOtp = await findValidOtp(query) as any;
    console.log('verifyOtpverifyOtp', verifyOtp)

    if (!verifyOtp) {
      throw new Error("Invalid Otp")
    }

    return true;
  } catch (error: any) {
    console.log(error)
    throw new Error(error.message || 'Failed to Forget Password');
  }

};



export const ChangePasswordService = async (
  otp: string,
  otpKey: any,
  checkType: string,
  newPassword: string
): Promise<any> => {
  try {
    // By pass for now
    // const isValidOtpExist = await OtpModel.findOne({ otp, [checkType]: otpKey })

    // if (!isValidOtpExist) throw new Error("Session Expired")

    // if (isValidOtpExist?.expiresAt < new Date()) throw new Error("Session Expired")
      
    const res = await EmployeeModel.findOneAndUpdate({ [checkType]: otpKey }, { $set: { password: newPassword } }, { new: true });

    await deleteOtp({[checkType]: otpKey, otp});

    return true;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to Update Password');
  }

};


// export const verifyOtpAndChangePasswordByEmailService = async (
//   email: string,
//   otp: string,
//   newPassword: string
// ): Promise<any> => {
//   try {
//     const verifyOtp = await findValidOtp({ email, otp });

//     if (!verifyOtp) {
//       throw new Error("Invalid Otp");
//     }

//     await userModel.findOneAndUpdate({ email }, { password: newPassword });

//     await deleteExistingOtp({ email });

//     return true;
//   } catch (error: any) {
//     throw new Error(error.message || 'Failed to reset password');
//   }
// };



export const verifyOtpAndChangePasswordByEmailService = async (
  email: string,
  otp: string,
  newPassword: string
): Promise<any> => {
  try {
    const verifyOtp = await findValidOtp({ email, otp });

    if (!verifyOtp) {
      throw new Error("Invalid Otp");
    }

    await userModel.findOneAndUpdate({ email }, { password: newPassword });

    await deleteExistingOtp({ email });

    return true;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to reset password');
  }
};



export const resendOtpService = async (email: string): Promise<void> => {
  await forgotPasswordService(email); // delete + send new OTP
};

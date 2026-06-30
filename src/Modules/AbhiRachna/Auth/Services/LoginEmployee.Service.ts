import bcrypt from "bcryptjs";;
import { Response } from "express";
import { loginRepository } from "../Repository/LoginEmployee.Repositry";
import { createToken } from "../../../../Services/createToken"
import { createOtp, deleteExistingOtp } from "../../Otp/Repository/Otp.Repository";
import generateOtp from "src/Services/otp";
import { sendOtpSms } from "src/Services/sendMobileOtp";



export const loginService = async (empId: string, password: string, res: Response) => {
  const {user, sessionId} = await loginRepository(empId, password);
  
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const token = createToken(user, sessionId);
  res.cookie("token", token, {
    httpOnly: true,
    // secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  });

  return token;
}

export const checkAuthService = async (req: any) => {
  const userDetails = req.user?._doc;
  console.log(userDetails, 'check for user Details')
  if (!userDetails) {
    throw new Error("No user details found!");
  }
  return userDetails;
};

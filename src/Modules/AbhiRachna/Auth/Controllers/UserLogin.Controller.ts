import { Response, Request, NextFunction } from "express";
import { SuccessResponse, ErrorResponse, STATUS_CODE } from "../../../../Api";

import { findValidOtp } from "../../Otp/Repository/Otp.Repository";
import { loginUserService, sendMobileOtpService, updateProfileService, updateUserProfileService } from "../Services/UserLogin.Services";
import sendOtpToEmail from "../../../../Services/sendOtp"
import { AuthenticatedRequest } from "../../../../types/types"

//login user controller

export const loginUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { fullName, phoneNumber, otp } = req.body;

    //skip for now verify otp 
    // const verifyOtp = await findValidOtp({ phoneNumber, otp });

    // if (!verifyOtp) {
    //   return ErrorResponse(res, STATUS_CODE.BAD_REQUEST, "Invalid OTP Provided");
    // }

    const user = await loginUserService(fullName, phoneNumber, res)

    SuccessResponse(res, STATUS_CODE.OK, user)


  } catch (error) {
    next(error);
  }
};



export const sendOtpMobileController = async (req: Request, res: Response, next: NextFunction): Promise<any> => {


  try {
    const { PhoneNumber, otpKey, isPassword = false } = req.body;

    // let phone: string | undefined = undefined;
    // let email: string | undefined = undefined;
    // let isPhone = null;
    // let isEmail = null;

    // if (PhoneNumber) {
    //   phone = PhoneNumber;
    // } else if (otpKey) {
    //   isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(otpKey);
    //   isPhone = /^[0-9]{10}$/.test(otpKey);

    //   if (isPhone) {
    //     phone = otpKey || PhoneNumber;
    //   } else if (isEmail) {

    //     email = otpKey;
    //   } else {
    //     return res.status(400).json({ message: "Invalid otpKey format" });
    //   }
    // }
    // else {
    //   return res.status(400).json({ message: "PhoneNumber or otpKey is required" });
    // }

    // if (isPhone || PhoneNumber) {
    //   await sendMobileOtpService(Number(phone),isPassword)

    return SuccessResponse(res, STATUS_CODE.OK, "OTP sent to your phoneNumber");

    // } 
    // 

  } catch (error) {
    next(error);
  }




}



export const updateProfileController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    if (!req.user || !req.user._id) {
      return ErrorResponse(res, STATUS_CODE.UNAUTHORIZED, "User Not Authorized");
    }

    const userId = req.user._id;
    const oldProfileImage = req.user?.profileImage || "";
    const updatedData = req.body;
    const profileImage = (req.file as any)?.key;
    if (updatedData?.address) {
      updatedData.address = JSON.parse(updatedData.address)
    }

    const data = { ...updatedData, profileImage };

    console.log("Data to update:", data);

    const result = await updateProfileService(userId, data, oldProfileImage);

    return SuccessResponse(res, STATUS_CODE.OK, "Profile updated successfully");
  } catch (error: any) {
    return ErrorResponse(res, STATUS_CODE.BAD_REQUEST, error.message || "Something went wrong");
  }
};




export const updateUserProfileController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    if (!req.user || !req.user._id) {
      return ErrorResponse(res, STATUS_CODE.UNAUTHORIZED, "User Not Authorized");
    }

    const userId = req.user._id;
    const updatedData = req.body;

    const result = await updateUserProfileService(userId, updatedData);

    return SuccessResponse(res, STATUS_CODE.OK, "Profile updated successfully");
  } catch (error: any) {
    return ErrorResponse(res, STATUS_CODE.BAD_REQUEST, error.message || "Something went wrong");
  }
};


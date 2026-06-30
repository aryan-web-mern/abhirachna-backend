import { createToken } from "../../../../Services/createToken";
import { loginUserRepository, updateAllowedEmployeeFields, updateAllowedUserFields } from "../Repository/UserLogin.Repository";
import { createOtp, deleteExistingOtp } from "../../Otp/Repository/Otp.Repository";
import generateOtp from "../../../../Services/otp";
import { sendOtpSms } from "../../../../Services/sendMobileOtp"
import { NextFunction } from "express";
import { ErrorResponse, STATUS_CODE } from "../../../../Api";
import { userModel } from "../Modals/User.Modals";

//website user log in service 
export const 
loginUserService = async (fullName: string, phoneNUmber: number, res: any) => {
  const user = await loginUserRepository(fullName, phoneNUmber);

  if (!user) {
    throw new Error("Invalid name or Number");
  }

  const token = createToken(user);
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: process.env.NODE_ENV === "production" ? process.env.COOKIES_ENV?"None" : "strict" : "lax",
    // domain:".abhirachnaa.com"
  });

  return token
}


export const sendMobileOtpService = async (phoneNumber: number,isPassword=false): Promise<any> => {


  try {


    if (isPassword) {
      const user = await userModel.findOne({ phoneNumber });
      if (!user) {
        throw new Error("User with this phone number does not exist");
      }
    }
    await deleteExistingOtp({ phoneNumber })
    const otp: string = generateOtp(4);

    const expiresInMinutes = 5;
    const expiresAt: Date = new Date(Date.now() + expiresInMinutes * 60000);

    await createOtp({ phoneNumber, otp, expiresAt });

    await sendOtpSms(phoneNumber, otp);
    return otp;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to send OTP');
  }


};







export const updateProfileService = async (id: any, data: any, oldProfileImage: string) => {
  try {
    const ALLOWED_FIELDS = ["fullName", "email", "password", "employeeId", "phoneNumber","dob","gender","address", "profileImage"];
    const filteredData: any = {};
    for (let key of ALLOWED_FIELDS) {
      if (data[key]) filteredData[key] = data[key];
    }

    if (Object.keys(filteredData).length === 0) {
      throw new Error("No valid fields provided for update");
    }


    const [user, employee] = await Promise.all([
      updateAllowedUserFields(id, filteredData),
      updateAllowedEmployeeFields(id, filteredData, oldProfileImage),
    ]);

    if (!user && !employee) {
      throw new Error("User not found or nothing was updated");
    }

    return user || employee;
  } catch (error: any) {

    throw new Error(error.message || "Profile update failed");
  }
};


export const updateUserProfileService = async (id: any, data: any) => {
  try {
    const ALLOWED_FIELDS = ["fullName", "email"];

    const filteredData: any = {};
    for (let key of ALLOWED_FIELDS) {
      if (data[key]) filteredData[key] = data[key];
    }
   console.log(filteredData,'filter data*****************')
    if (Object.keys(filteredData).length === 0) {
      throw new Error("No valid fields provided for update");
    }


    const [user] = await Promise.all([
      updateAllowedUserFields(id, filteredData),
    ]);

    if (!user ) {
      throw new Error("User not found or nothing was updated");
    }

    return user ;
  } catch (error: any) {

    throw new Error(error.message || "Profile update failed");
  }
};




import { ErrorResponse, STATUS_CODE, SuccessResponse } from "../../../../Api";
import { Request, Response, NextFunction } from "express";
import { ChangePasswordService, forgotPasswordService, resendOtpService, verifyOtpService } from "../Services/Otp.Services";
import { EmployeeModel } from "../../../../Modules/AbhiRachna/Auth/Modals/Employees.Modals";


// 1. Forget Password Controller
export const forgotPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { email } = req.body;

    if (!email) {
      return ErrorResponse(res, STATUS_CODE.BAD_REQUEST, "Email is required");
    }

    //  Check if employee exists
    const employeeExists = await EmployeeModel.findOne({ email });

    if (!employeeExists) {
      return ErrorResponse(res, STATUS_CODE.NOT_FOUND, "Email not registered");
    }

    // Proceed if valid
    await forgotPasswordService(email);

    return SuccessResponse(res, STATUS_CODE.OK, "OTP sent to your email");
  } catch (error) {
    next(error);
  }
};

// 2. Verify OTP Controller


export const verifyOtpController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { otpKey, otp } = req.body;

    if (!otpKey || !otp) {
      return ErrorResponse(res, STATUS_CODE.BAD_REQUEST, "All fields are required");
    }
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(otpKey);
    const isPhone = /^[0-9]{10}$/.test(otpKey);

    let result;
    if (isPhone || isEmail) {
      const checkType = isEmail ? 'email' : 'phoneNumber'
      // By Pass for now
      // result = await verifyOtpService({ otpKey, otp, checkType });
      result = true
    } else {
      return ErrorResponse(res, STATUS_CODE.BAD_REQUEST, "Invalid otpKey format");
    }
    if (!result) {
      return ErrorResponse(res, STATUS_CODE.UNAUTHORIZED, "Invalid or expired OTP");
    }

    return SuccessResponse(res, STATUS_CODE.OK, "Otp verified successfully!");
  } catch (error) {
    next(error);
  }
};


export const ChangePasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { otpKey, newPassword, otp } = req.body;

    console.log('req.body', req.body)
    if (!otpKey || !newPassword) {
      return ErrorResponse(res, STATUS_CODE.BAD_REQUEST, "All fields are required");
    }
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(otpKey);
    const isPhone = /^[0-9]{10}$/.test(otpKey);
    let result;
    const checkType = isEmail ? 'email' : 'phoneNumber'
    console.log('checkType', checkType)

    if (isPhone || isEmail) {
      result = await ChangePasswordService(otp, otpKey, checkType, newPassword);
  } else {
      return ErrorResponse(res, STATUS_CODE.BAD_REQUEST, "Invalid password format");
    }
    if (!result) {
      return ErrorResponse(res, STATUS_CODE.UNAUTHORIZED, "Invalid session");
    }

    return SuccessResponse(res, STATUS_CODE.OK, "Password changed successfully");
  } catch (error) {
    next(error);
  }
};

// // 3. Resend OTP Controller
export const resendOtpController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { email } = req.body;
    if (!email)
      return ErrorResponse(res, STATUS_CODE.BAD_REQUEST, "Email is required");

    await resendOtpService(email);

    return SuccessResponse(res, STATUS_CODE.OK, "OTP resent successfully");
  } catch (error) {
    next(error);
  }
};

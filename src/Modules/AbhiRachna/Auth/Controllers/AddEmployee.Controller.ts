import { Response, Request, NextFunction } from "express";
import { SuccessResponse, ErrorResponse, STATUS_CODE } from "../../../../Api";
import { BankDetail, EmployeeDetails, GovtDetail } from "../Modals/Employees.Modals";
import { RegisterEmployeeService, updateEmpService } from "../Services/AddEmployee.Services";
import { checkAuthService, loginService } from "../Services/LoginEmployee.Service";
import Appconfig from "../../../../Config/Appconfig"
import { findValidOtp } from "../../Otp/Repository/Otp.Repository";
import { json } from "node:stream/consumers";
import { sessionModel } from "../Modals/User.Modals";

interface LogoutRequest extends Request {
  sessionId?: string;
  user?: {
    _id: string;
    [key: string]: any;
  };
}

interface LogoutResponseData {
  message: string;
}


//----------------------------------------------Add Employee Controller-----------------------------------------------------------------------------------------------
export const AddEmployeeController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    let {
      fullName,
      designation: designationId,
      phoneNumber,
      email,
      password,
      address,
      role,
      dob,
      gender
    } = req.body;

    if (address) address = JSON.parse(address)

    if (

      fullName === " " ||
      designationId === " " ||
      phoneNumber === " " ||
      email === " " ||
      password === " " ||
      address === " " ||
      role === " " ||
      dob === " " ||
      gender === " "

    ) {
      return ErrorResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        "Input should not be Empty"
      );
    }
    const files = req.files as {
      [fieldname: string]: Express.MulterS3.File[];
    };

    const profileImage = files?.profileImage?.[0]?.key as string;

    const data: EmployeeDetails = {
      fullName,
      phoneNumber,
      email,
      password,
      designationId,
      address,
      role: role || "Employee",
      profileImage,
      dob,
      gender,

    };


    const { govtDetail, bankDetail } = req.body;

    if (govtDetail === " " || bankDetail === " ") {
      return ErrorResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        "govt details or bank details should not be Empty"
      );
    }


    const employeeInfo: BankDetail & GovtDetail & { employeeId: string } = {
      ...govtDetail,
      ...bankDetail,
      bankDoc: files?.bankDoc?.[0]?.key,
      panDoc: files?.panDoc?.[0]?.key,
      aadharDoc: files?.aadharDoc?.[0]?.key
    };
    const employeeResponse = await RegisterEmployeeService(data, employeeInfo);


    return SuccessResponse(
      res,
      STATUS_CODE.OK,
      { msg: "Employee successfully registered", ...employeeResponse }
    );
  } catch (error) {
    next(error);
  }
};


export const updateEmpController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req?.params as { id: string };

    if (!id) {
      return ErrorResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        "Employee id not found"
      );
    }

    let rawBody = req.body;

    const allowedEmployeeFields = [
      'fullName',
      'designation',
      'phoneNumber',
      'email',
      'password',
      'address',
      'role',
      'dob',
      'gender',
    ] as const;

    const employeeDetails = Object.fromEntries(
      allowedEmployeeFields
        .map((key) => [key === 'designation' ? 'designationId' : key, rawBody?.[key]])
        .filter(([, value]) => value !== undefined)
    );

    const files = req.files as {
      [fieldname: string]: Express.MulterS3.File[];
    };

    const govtDetails = {
      ...(files?.panDoc?.[0]?.key && { panDoc: files.panDoc[0].key }),
      ...(files?.aadharDoc?.[0]?.key && { aadharDoc: files.aadharDoc[0].key }),
      ...(rawBody?.aadharCardNumber && { aadharCardNumber: rawBody.aadharCardNumber }),
      ...(rawBody?.panCardNumber && { panCardNumber: rawBody.panCardNumber })
    };

    const imgKey = files?.profileImage?.[0]?.key;
    if (imgKey) {
      employeeDetails.profileImage = imgKey
    }

    const data: { employeeDetails: EmployeeDetails, govtDetails: GovtDetail } = {
      govtDetails,
      employeeDetails
    };

    const resposne = await updateEmpService(data, id);
    return SuccessResponse(
      res,
      STATUS_CODE.OK,
      { msg: "Details added successfully!", resposne }
    );
  } catch (error) {
    next(error);
  }
};


// Login Controller
export const loginController = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { empId, password } = req.body;

    if (!empId || !password) {
      return ErrorResponse(res, STATUS_CODE.BAD_REQUEST, "Missing required fields.");
    }


    const userData = await loginService(empId, password, res);
    return SuccessResponse(
      res,
      STATUS_CODE.OK,
      {
        msg: "Log In successfully",
        token: userData

      }
    );
  } catch (error) {
    next(error);
  }
};

// Check Auth Controller
export const checkAuthController = async (req: any, res: Response, next: NextFunction): Promise<any> => {
  try {
    return SuccessResponse(res, STATUS_CODE.OK, { user: req.user });
  } catch (error) {
    next(error);
  }
};


//log out controller 
export const logoutController = async (
  req: LogoutRequest,
  res: Response<LogoutResponseData>,
  next: NextFunction
): Promise<any> => {
  try {
    await sessionModel.deleteOne({ userId: req.user?._id, sessionId: req?.sessionId });
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? process.env.COOKIES_ENV ? "none" : "strict" : "lax",
      secure: process.env.NODE_ENV === "production",
      domain: ".abhirachnaa.com",
    });

    return SuccessResponse(res, 200, "Logged out successfully");
  } catch (error) {
    next(error);
  }
};




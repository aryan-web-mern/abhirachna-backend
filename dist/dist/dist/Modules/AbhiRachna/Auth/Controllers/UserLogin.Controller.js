"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProfileController = exports.updateProfileController = exports.sendOtpMobileController = exports.loginUserController = void 0;
const Api_1 = require("../../../../Api");
const UserLogin_Services_1 = require("../Services/UserLogin.Services");
//login user controller
const loginUserController = async (req, res, next) => {
    try {
        const { fullName, phoneNumber, otp } = req.body;
        //skip for now verify otp 
        // const verifyOtp = await findValidOtp({ phoneNumber, otp });
        // if (!verifyOtp) {
        //   return ErrorResponse(res, STATUS_CODE.BAD_REQUEST, "Invalid OTP Provided");
        // }
        const user = await (0, UserLogin_Services_1.loginUserService)(fullName, phoneNumber, res);
        (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, user);
    }
    catch (error) {
        next(error);
    }
};
exports.loginUserController = loginUserController;
const sendOtpMobileController = async (req, res, next) => {
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
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, "OTP sent to your phoneNumber");
        // } 
        // 
    }
    catch (error) {
        next(error);
    }
};
exports.sendOtpMobileController = sendOtpMobileController;
const updateProfileController = async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.UNAUTHORIZED, "User Not Authorized");
        }
        const userId = req.user._id;
        const oldProfileImage = req.user?.profileImage || "";
        const updatedData = req.body;
        const profileImage = req.file?.key;
        if (updatedData?.address) {
            updatedData.address = JSON.parse(updatedData.address);
        }
        const data = { ...updatedData, profileImage };
        console.log("Data to update:", data);
        const result = await (0, UserLogin_Services_1.updateProfileService)(userId, data, oldProfileImage);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, "Profile updated successfully");
    }
    catch (error) {
        return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.BAD_REQUEST, error.message || "Something went wrong");
    }
};
exports.updateProfileController = updateProfileController;
const updateUserProfileController = async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.UNAUTHORIZED, "User Not Authorized");
        }
        const userId = req.user._id;
        const updatedData = req.body;
        const result = await (0, UserLogin_Services_1.updateUserProfileService)(userId, updatedData);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, "Profile updated successfully");
    }
    catch (error) {
        return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.BAD_REQUEST, error.message || "Something went wrong");
    }
};
exports.updateUserProfileController = updateUserProfileController;

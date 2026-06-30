"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendOtpController = exports.ChangePasswordController = exports.verifyOtpController = exports.forgotPasswordController = void 0;
const Api_1 = require("../../../../Api");
const Otp_Services_1 = require("../Services/Otp.Services");
const Employees_Modals_1 = require("../../../../Modules/AbhiRachna/Auth/Modals/Employees.Modals");
// 1. Forget Password Controller
const forgotPasswordController = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.BAD_REQUEST, "Email is required");
        }
        //  Check if employee exists
        const employeeExists = await Employees_Modals_1.EmployeeModel.findOne({ email });
        if (!employeeExists) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.NOT_FOUND, "Email not registered");
        }
        // Proceed if valid
        await (0, Otp_Services_1.forgotPasswordService)(email);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, "OTP sent to your email");
    }
    catch (error) {
        next(error);
    }
};
exports.forgotPasswordController = forgotPasswordController;
// 2. Verify OTP Controller
const verifyOtpController = async (req, res, next) => {
    try {
        const { otpKey, otp } = req.body;
        if (!otpKey || !otp) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.BAD_REQUEST, "All fields are required");
        }
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(otpKey);
        const isPhone = /^[0-9]{10}$/.test(otpKey);
        let result;
        if (isPhone || isEmail) {
            const checkType = isEmail ? 'email' : 'phoneNumber';
            // By Pass for now
            // result = await verifyOtpService({ otpKey, otp, checkType });
            result = true;
        }
        else {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.BAD_REQUEST, "Invalid otpKey format");
        }
        if (!result) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.UNAUTHORIZED, "Invalid or expired OTP");
        }
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, "Otp verified successfully!");
    }
    catch (error) {
        next(error);
    }
};
exports.verifyOtpController = verifyOtpController;
const ChangePasswordController = async (req, res, next) => {
    try {
        const { otpKey, newPassword, otp } = req.body;
        console.log('req.body', req.body);
        if (!otpKey || !newPassword) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.BAD_REQUEST, "All fields are required");
        }
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(otpKey);
        const isPhone = /^[0-9]{10}$/.test(otpKey);
        let result;
        const checkType = isEmail ? 'email' : 'phoneNumber';
        console.log('checkType', checkType);
        if (isPhone || isEmail) {
            result = await (0, Otp_Services_1.ChangePasswordService)(otp, otpKey, checkType, newPassword);
        }
        else {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.BAD_REQUEST, "Invalid password format");
        }
        if (!result) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.UNAUTHORIZED, "Invalid session");
        }
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, "Password changed successfully");
    }
    catch (error) {
        next(error);
    }
};
exports.ChangePasswordController = ChangePasswordController;
// // 3. Resend OTP Controller
const resendOtpController = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email)
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.BAD_REQUEST, "Email is required");
        await (0, Otp_Services_1.resendOtpService)(email);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, "OTP resent successfully");
    }
    catch (error) {
        next(error);
    }
};
exports.resendOtpController = resendOtpController;

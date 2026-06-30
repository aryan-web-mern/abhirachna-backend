"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendOtpService = exports.verifyOtpAndChangePasswordByEmailService = exports.ChangePasswordService = exports.verifyOtpService = exports.forgotPasswordService = void 0;
const mailer_1 = __importDefault(require("../../../../Services/mailer"));
const Otp_Repository_1 = require("../Repository/Otp.Repository");
const Employees_Modals_1 = require("../../../AbhiRachna/Auth/Modals/Employees.Modals");
const otp_1 = __importDefault(require("../../../../Services/otp"));
const User_Modals_1 = require("../../Auth/Modals/User.Modals");
const forgotPasswordService = async (email) => {
    try {
        await (0, Otp_Repository_1.deleteExistingOtp)({ email });
        const otp = (0, otp_1.default)(6);
        const expiresInMinutes = 10;
        const expiresAt = new Date(Date.now() + expiresInMinutes * 60000);
        await (0, Otp_Repository_1.createOtp)({ email, otp, expiresAt });
        const subject = 'Your OTP Code';
        const text = `Your OTP code is: ${otp}`;
        const html = `<p>Your <b>OTP</b> code is: <strong>${otp}</strong></p>`;
        const mailPayload = {
            to: email,
            subject,
            text,
            html,
        };
        await (0, mailer_1.default)(mailPayload);
        return otp;
    }
    catch (error) {
        throw new Error(error.message || 'Failed to send OTP');
    }
};
exports.forgotPasswordService = forgotPasswordService;
const verifyOtpService = async ({ otpKey, otp, checkType }) => {
    try {
        const query = {
            [checkType]: otpKey,
            otp
        };
        console.log('query', query);
        const verifyOtp = await (0, Otp_Repository_1.findValidOtp)(query);
        console.log('verifyOtpverifyOtp', verifyOtp);
        if (!verifyOtp) {
            throw new Error("Invalid Otp");
        }
        return true;
    }
    catch (error) {
        console.log(error);
        throw new Error(error.message || 'Failed to Forget Password');
    }
};
exports.verifyOtpService = verifyOtpService;
const ChangePasswordService = async (otp, otpKey, checkType, newPassword) => {
    try {
        // By pass for now
        // const isValidOtpExist = await OtpModel.findOne({ otp, [checkType]: otpKey })
        // if (!isValidOtpExist) throw new Error("Session Expired")
        // if (isValidOtpExist?.expiresAt < new Date()) throw new Error("Session Expired")
        const res = await Employees_Modals_1.EmployeeModel.findOneAndUpdate({ [checkType]: otpKey }, { $set: { password: newPassword } }, { new: true });
        await (0, Otp_Repository_1.deleteOtp)({ [checkType]: otpKey, otp });
        return true;
    }
    catch (error) {
        throw new Error(error.message || 'Failed to Update Password');
    }
};
exports.ChangePasswordService = ChangePasswordService;
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
const verifyOtpAndChangePasswordByEmailService = async (email, otp, newPassword) => {
    try {
        const verifyOtp = await (0, Otp_Repository_1.findValidOtp)({ email, otp });
        if (!verifyOtp) {
            throw new Error("Invalid Otp");
        }
        await User_Modals_1.userModel.findOneAndUpdate({ email }, { password: newPassword });
        await (0, Otp_Repository_1.deleteExistingOtp)({ email });
        return true;
    }
    catch (error) {
        throw new Error(error.message || 'Failed to reset password');
    }
};
exports.verifyOtpAndChangePasswordByEmailService = verifyOtpAndChangePasswordByEmailService;
const resendOtpService = async (email) => {
    await (0, exports.forgotPasswordService)(email); // delete + send new OTP
};
exports.resendOtpService = resendOtpService;

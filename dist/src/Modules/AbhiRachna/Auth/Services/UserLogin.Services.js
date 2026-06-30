"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProfileService = exports.updateProfileService = exports.sendMobileOtpService = exports.loginUserService = void 0;
const createToken_1 = require("../../../../Services/createToken");
const UserLogin_Repository_1 = require("../Repository/UserLogin.Repository");
const Otp_Repository_1 = require("../../Otp/Repository/Otp.Repository");
const otp_1 = __importDefault(require("../../../../Services/otp"));
const sendMobileOtp_1 = require("../../../../Services/sendMobileOtp");
const User_Modals_1 = require("../Modals/User.Modals");
//website user log in service 
const loginUserService = async (fullName, phoneNUmber, res) => {
    const user = await (0, UserLogin_Repository_1.loginUserRepository)(fullName, phoneNUmber);
    if (!user) {
        throw new Error("Invalid name or Number");
    }
    const token = (0, createToken_1.createToken)(user);
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: process.env.NODE_ENV === "production" ? process.env.COOKIES_ENV ? "None" : "strict" : "lax",
        // domain:".abhirachnaa.com"
    });
    return token;
};
exports.loginUserService = loginUserService;
const sendMobileOtpService = async (phoneNumber, isPassword = false) => {
    try {
        if (isPassword) {
            const user = await User_Modals_1.userModel.findOne({ phoneNumber });
            if (!user) {
                throw new Error("User with this phone number does not exist");
            }
        }
        await (0, Otp_Repository_1.deleteExistingOtp)({ phoneNumber });
        const otp = (0, otp_1.default)(4);
        const expiresInMinutes = 5;
        const expiresAt = new Date(Date.now() + expiresInMinutes * 60000);
        await (0, Otp_Repository_1.createOtp)({ phoneNumber, otp, expiresAt });
        await (0, sendMobileOtp_1.sendOtpSms)(phoneNumber, otp);
        return otp;
    }
    catch (error) {
        throw new Error(error.message || 'Failed to send OTP');
    }
};
exports.sendMobileOtpService = sendMobileOtpService;
const updateProfileService = async (id, data, oldProfileImage) => {
    try {
        const ALLOWED_FIELDS = ["fullName", "email", "password", "employeeId", "phoneNumber", "dob", "gender", "address", "profileImage"];
        const filteredData = {};
        for (let key of ALLOWED_FIELDS) {
            if (data[key])
                filteredData[key] = data[key];
        }
        if (Object.keys(filteredData).length === 0) {
            throw new Error("No valid fields provided for update");
        }
        const [user, employee] = await Promise.all([
            (0, UserLogin_Repository_1.updateAllowedUserFields)(id, filteredData),
            (0, UserLogin_Repository_1.updateAllowedEmployeeFields)(id, filteredData, oldProfileImage),
        ]);
        if (!user && !employee) {
            throw new Error("User not found or nothing was updated");
        }
        return user || employee;
    }
    catch (error) {
        throw new Error(error.message || "Profile update failed");
    }
};
exports.updateProfileService = updateProfileService;
const updateUserProfileService = async (id, data) => {
    try {
        const ALLOWED_FIELDS = ["fullName", "email"];
        const filteredData = {};
        for (let key of ALLOWED_FIELDS) {
            if (data[key])
                filteredData[key] = data[key];
        }
        console.log(filteredData, 'filter data*****************');
        if (Object.keys(filteredData).length === 0) {
            throw new Error("No valid fields provided for update");
        }
        const [user] = await Promise.all([
            (0, UserLogin_Repository_1.updateAllowedUserFields)(id, filteredData),
        ]);
        if (!user) {
            throw new Error("User not found or nothing was updated");
        }
        return user;
    }
    catch (error) {
        throw new Error(error.message || "Profile update failed");
    }
};
exports.updateUserProfileService = updateUserProfileService;

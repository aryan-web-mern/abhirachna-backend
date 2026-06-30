"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_Modals_1 = require("../Modules/AbhiRachna/Auth/Modals/User.Modals");
const Otp_Modals_1 = __importDefault(require("../Modules/AbhiRachna/Otp/Modals/Otp.Modals"));
const mailer_1 = __importDefault(require("./mailer"));
const otp_1 = __importDefault(require("./otp"));
async function sendOtpToEmail(email, isPassword = false) {
    try {
        if (isPassword) {
            const user = await User_Modals_1.userModel.findOne({ email });
            if (!user) {
                throw new Error("User with this email does not exist");
            }
        }
        await Otp_Modals_1.default.deleteMany({ email });
        const otp = (0, otp_1.default)(4);
        const expiresInMinutes = 10;
        const expiresAt = new Date(Date.now() + expiresInMinutes * 60000);
        await Otp_Modals_1.default.create({ email, otp, expiresAt });
        const subject = 'Your OTP Code';
        const text = `Your OTP code is: ${otp}`;
        const html = `<p>Your <b>OTP</b> code is: <strong>${otp}</strong></p>`;
        if (!email) {
            throw new Error("Provide email id ");
        }
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
}
exports.default = sendOtpToEmail;

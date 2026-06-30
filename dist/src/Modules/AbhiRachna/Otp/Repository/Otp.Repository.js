"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findValidOtp = exports.createOtp = exports.deleteOtp = exports.deleteExistingOtp = void 0;
const Otp_Modals_1 = __importDefault(require("../Modals/Otp.Modals"));
const deleteExistingOtp = async (params) => {
    const { email, phoneNumber } = params;
    if (email) {
        await Otp_Modals_1.default.deleteMany({ email });
    }
    else if (phoneNumber) {
        await Otp_Modals_1.default.deleteMany({ phoneNumber });
    }
};
exports.deleteExistingOtp = deleteExistingOtp;
const deleteOtp = async (query) => {
    await Otp_Modals_1.default.deleteMany(query);
};
exports.deleteOtp = deleteOtp;
const createOtp = async (data) => {
    await Otp_Modals_1.default.create(data);
};
exports.createOtp = createOtp;
// export const findValidOtp = async (data: any) => {
//   return await OtpModel.findOne(data);
// };
const findValidOtp = async (data) => {
    return await Otp_Modals_1.default.findOne(data);
};
exports.findValidOtp = findValidOtp;

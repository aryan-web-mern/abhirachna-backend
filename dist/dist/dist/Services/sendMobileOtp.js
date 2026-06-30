"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtpSms = void 0;
const axios_1 = __importDefault(require("axios"));
const Appconfig_1 = __importDefault(require(".././Config/Appconfig"));
const API_KEY = Appconfig_1.default.factor_api_key;
const TEMPLATE_NAME = Appconfig_1.default.template_name;
const sendOtpSms = async (phoneNumber, otp) => {
    try {
        const url = `https://2factor.in/API/V1/${API_KEY}/SMS/${phoneNumber}/${otp}/${TEMPLATE_NAME}`;
        const response = await axios_1.default.get(url);
        if (response.data.Status === "Success") {
            return true;
        }
        else {
            console.error("2Factor Error:", response.data);
            return false;
        }
    }
    catch (error) {
        console.error("SMS send error:", error.message);
        return false;
    }
};
exports.sendOtpSms = sendOtpSms;

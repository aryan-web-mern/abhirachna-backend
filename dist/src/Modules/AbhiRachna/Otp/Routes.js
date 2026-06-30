"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Otp_Controller_1 = require("./Controllers/Otp.Controller");
const requireParameters_1 = __importDefault(require("../../../Middlewares/Global/requireParameters"));
const router = (0, express_1.Router)();
router.post("/forgot-password", (0, requireParameters_1.default)("email"), Otp_Controller_1.forgotPasswordController); //this api only for email use email forget than use it or on phone number otp use in auth router
router.post("/verify-otp", (0, requireParameters_1.default)("otpKey", "otp"), Otp_Controller_1.verifyOtpController);
router.put("/update-password", (0, requireParameters_1.default)("newPassword", "otpKey"), Otp_Controller_1.ChangePasswordController);
router.post("/resend-otp", (0, requireParameters_1.default)("email"), Otp_Controller_1.resendOtpController); //this is also for send otp on email or on phone number otp use in auth router
exports.default = router;

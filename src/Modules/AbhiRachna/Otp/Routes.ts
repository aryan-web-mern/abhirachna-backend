import { Router } from "express";
import { ChangePasswordController, forgotPasswordController, resendOtpController, verifyOtpController } from "./Controllers/Otp.Controller";
import requireParameters from "../../../Middlewares/Global/requireParameters";


const router = Router();
router.post("/forgot-password",requireParameters("email"), forgotPasswordController); //this api only for email use email forget than use it or on phone number otp use in auth router
router.post("/verify-otp",requireParameters("otpKey","otp"), verifyOtpController);
router.put("/update-password",requireParameters("newPassword","otpKey"), ChangePasswordController);
router.post("/resend-otp",requireParameters("email"), resendOtpController);  //this is also for send otp on email or on phone number otp use in auth router


export default router
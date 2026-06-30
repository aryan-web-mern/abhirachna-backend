import { Router } from "express";
import requireParameters from "../../../Middlewares/Global/requireParameters";
import {
  AddEmployeeController,
  checkAuthController,
  loginController,
  logoutController,
  updateEmpController,
} from "./Controllers/AddEmployee.Controller";
import { checkRole } from "../../../Middlewares/Auth/CheckDesignation"

import { checkAuth } from "../../../Middlewares/Auth/ValidateCokkies";
import {
  loginUserController,
  sendOtpMobileController,
  updateProfileController,
  updateUserProfileController,
} from "./Controllers/UserLogin.Controller";
import { uploadS3 } from "../../../Middlewares/Multers/S3Uploads/Uploads";
import { checkDesignation } from "../../../Middlewares/Auth/CheckDesignation";

const router = Router();

router.post(
  "/registerEmployee",
  uploadS3.fields([
    { name: 'aadharDoc', maxCount: 1 },
    { name: 'panDoc', maxCount: 1 },
    { name: 'bankDoc', maxCount: 1 },
    { name: 'profileImage', maxCount: 1 },
  ]), requireParameters(
    "fullName",
    "designation",
    "phoneNumber",
    "email",
    "password",
  ),
  AddEmployeeController
);

router.post(
  "/loginEmployee",
  requireParameters("empId", "password"),
  loginController
);
router.get("/logoutEmloyee", checkAuth, logoutController);
router.get("/checkAuth", checkAuth, checkAuthController);
router.post(
  "/loginUser",
  requireParameters("fullName", "phoneNumber", "otp"),
  loginUserController
);
router.post("/sendUserOtp", sendOtpMobileController);
router.post("/resendUserOtp", sendOtpMobileController);
router.put("/update-profile", checkAuth, uploadS3.single("profileImage"), updateProfileController);
router.put("/upate-user-profile", checkAuth, updateUserProfileController);

// edit employee by director
router.put("/emp/:id", checkAuth, checkDesignation(["director", "personal_assistant"]), uploadS3.fields([
  { name: 'aadharDoc', maxCount: 1 },
  { name: 'panDoc', maxCount: 1 },
  { name: 'profileImage', maxCount: 1 },
]), updateEmpController);

export default router;

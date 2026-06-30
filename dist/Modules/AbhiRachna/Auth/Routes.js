"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const requireParameters_1 = __importDefault(require("../../../Middlewares/Global/requireParameters"));
const AddEmployee_Controller_1 = require("./Controllers/AddEmployee.Controller");
const ValidateCokkies_1 = require("../../../Middlewares/Auth/ValidateCokkies");
const UserLogin_Controller_1 = require("./Controllers/UserLogin.Controller");
const Uploads_1 = require("../../../Middlewares/Multers/S3Uploads/Uploads");
const CheckDesignation_1 = require("../../../Middlewares/Auth/CheckDesignation");
const router = (0, express_1.Router)();
router.post("/registerEmployee", Uploads_1.uploadS3.fields([
    { name: 'aadharDoc', maxCount: 1 },
    { name: 'panDoc', maxCount: 1 },
    { name: 'bankDoc', maxCount: 1 },
    { name: 'profileImage', maxCount: 1 },
]), (0, requireParameters_1.default)("fullName", "designation", "phoneNumber", "email", "password"), AddEmployee_Controller_1.AddEmployeeController);
router.post("/loginEmployee", (0, requireParameters_1.default)("empId", "password"), AddEmployee_Controller_1.loginController);
router.get("/logoutEmloyee", ValidateCokkies_1.checkAuth, AddEmployee_Controller_1.logoutController);
router.get("/checkAuth", ValidateCokkies_1.checkAuth, AddEmployee_Controller_1.checkAuthController);
router.post("/loginUser", (0, requireParameters_1.default)("fullName", "phoneNumber", "otp"), UserLogin_Controller_1.loginUserController);
router.post("/sendUserOtp", UserLogin_Controller_1.sendOtpMobileController);
router.post("/resendUserOtp", UserLogin_Controller_1.sendOtpMobileController);
router.put("/update-profile", ValidateCokkies_1.checkAuth, Uploads_1.uploadS3.single("profileImage"), UserLogin_Controller_1.updateProfileController);
router.put("/upate-user-profile", ValidateCokkies_1.checkAuth, UserLogin_Controller_1.updateUserProfileController);
// edit employee by director
router.put("/emp/:id", ValidateCokkies_1.checkAuth, (0, CheckDesignation_1.checkDesignation)(["director", "personal_assistant"]), Uploads_1.uploadS3.fields([
    { name: 'aadharDoc', maxCount: 1 },
    { name: 'panDoc', maxCount: 1 },
    { name: 'profileImage', maxCount: 1 },
]), AddEmployee_Controller_1.updateEmpController);
exports.default = router;

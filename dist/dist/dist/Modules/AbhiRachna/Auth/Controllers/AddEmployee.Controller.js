"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutController = exports.checkAuthController = exports.loginController = exports.updateEmpController = exports.AddEmployeeController = void 0;
const Api_1 = require("../../../../Api");
const AddEmployee_Services_1 = require("../Services/AddEmployee.Services");
const LoginEmployee_Service_1 = require("../Services/LoginEmployee.Service");
const User_Modals_1 = require("../Modals/User.Modals");
//----------------------------------------------Add Employee Controller-----------------------------------------------------------------------------------------------
const AddEmployeeController = async (req, res, next) => {
    try {
        let { fullName, designation: designationId, phoneNumber, email, password, address, role, dob, gender } = req.body;
        if (address)
            address = JSON.parse(address);
        if (fullName === " " ||
            designationId === " " ||
            phoneNumber === " " ||
            email === " " ||
            password === " " ||
            address === " " ||
            role === " " ||
            dob === " " ||
            gender === " ") {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.BAD_REQUEST, "Input should not be Empty");
        }
        const files = req.files;
        const profileImage = files?.profileImage?.[0]?.key;
        const data = {
            fullName,
            phoneNumber,
            email,
            password,
            designationId,
            address,
            role: role || "Employee",
            profileImage,
            dob,
            gender,
        };
        const { govtDetail, bankDetail } = req.body;
        if (govtDetail === " " || bankDetail === " ") {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.BAD_REQUEST, "govt details or bank details should not be Empty");
        }
        const employeeInfo = {
            ...govtDetail,
            ...bankDetail,
            bankDoc: files?.bankDoc?.[0]?.key,
            panDoc: files?.panDoc?.[0]?.key,
            aadharDoc: files?.aadharDoc?.[0]?.key
        };
        const employeeResponse = await (0, AddEmployee_Services_1.RegisterEmployeeService)(data, employeeInfo);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, { msg: "Employee successfully registered", ...employeeResponse });
    }
    catch (error) {
        next(error);
    }
};
exports.AddEmployeeController = AddEmployeeController;
const updateEmpController = async (req, res, next) => {
    try {
        const { id } = req?.params;
        if (!id) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.NOT_FOUND, "Employee id not found");
        }
        let rawBody = req.body;
        const allowedEmployeeFields = [
            'fullName',
            'designation',
            'phoneNumber',
            'email',
            'password',
            'address',
            'role',
            'dob',
            'gender',
        ];
        const employeeDetails = Object.fromEntries(allowedEmployeeFields
            .map((key) => [key === 'designation' ? 'designationId' : key, rawBody?.[key]])
            .filter(([, value]) => value !== undefined));
        const files = req.files;
        const govtDetails = {
            ...(files?.panDoc?.[0]?.key && { panDoc: files.panDoc[0].key }),
            ...(files?.aadharDoc?.[0]?.key && { aadharDoc: files.aadharDoc[0].key }),
            ...(rawBody?.aadharCardNumber && { aadharCardNumber: rawBody.aadharCardNumber }),
            ...(rawBody?.panCardNumber && { panCardNumber: rawBody.panCardNumber })
        };
        const imgKey = files?.profileImage?.[0]?.key;
        if (imgKey) {
            employeeDetails.profileImage = imgKey;
        }
        const data = {
            govtDetails,
            employeeDetails
        };
        const resposne = await (0, AddEmployee_Services_1.updateEmpService)(data, id);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, { msg: "Details added successfully!", resposne });
    }
    catch (error) {
        next(error);
    }
};
exports.updateEmpController = updateEmpController;
// Login Controller
const loginController = async (req, res, next) => {
    try {
        const { empId, password } = req.body;
        if (!empId || !password) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.BAD_REQUEST, "Missing required fields.");
        }
        const userData = await (0, LoginEmployee_Service_1.loginService)(empId, password, res);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, {
            msg: "Log In successfully",
            token: userData
        });
    }
    catch (error) {
        next(error);
    }
};
exports.loginController = loginController;
// Check Auth Controller
const checkAuthController = async (req, res, next) => {
    try {
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, { user: req.user });
    }
    catch (error) {
        next(error);
    }
};
exports.checkAuthController = checkAuthController;
//log out controller 
const logoutController = async (req, res, next) => {
    try {
        await User_Modals_1.sessionModel.deleteOne({ userId: req.user?._id, sessionId: req?.sessionId });
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "production" ? process.env.COOKIES_ENV ? "none" : "strict" : "lax",
            secure: process.env.NODE_ENV === "production",
            domain: ".abhirachnaa.com",
        });
        return (0, Api_1.SuccessResponse)(res, 200, "Logged out successfully");
    }
    catch (error) {
        next(error);
    }
};
exports.logoutController = logoutController;

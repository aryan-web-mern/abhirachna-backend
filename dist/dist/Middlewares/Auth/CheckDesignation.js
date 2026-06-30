"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLeadsAccess = exports.checkRole = exports.checkDesignation = void 0;
const Employees_Modals_1 = require("../../Modules/AbhiRachna/Auth/Modals/Employees.Modals");
const Api_1 = require("../../Api");
const Api_2 = require("../../Api"); // Your custom code constants
const User_Modals_1 = require("../../Modules/AbhiRachna/Auth/Modals/User.Modals");
const checkDesignation = (allowedDesignations) => async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            return (0, Api_1.ErrorResponse)(res, Api_2.STATUS_CODE.UNAUTHORIZED, "User not authenticated");
        }
        const userId = req.user._id;
        const user = await Employees_Modals_1.EmployeeModel.findById(userId).populate("designationId");
        if (!user || !user.designationId) {
            return (0, Api_1.ErrorResponse)(res, Api_2.STATUS_CODE.UNAUTHORIZED, "Invalid user or designation");
        }
        const userDesignation = user.designationId.name?.toLowerCase();
        if (!allowedDesignations.includes(userDesignation)) {
            return (0, Api_1.ErrorResponse)(res, Api_2.STATUS_CODE.UNAUTHORIZED, "You are not authorized");
        }
        next();
    }
    catch (error) {
        return (0, Api_1.ErrorResponse)(res, Api_2.STATUS_CODE.INTERNAL_SERVER_ERROR, "Internal server error");
    }
};
exports.checkDesignation = checkDesignation;
const checkRole = (allowedRoles) => async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            return (0, Api_1.ErrorResponse)(res, Api_2.STATUS_CODE.UNAUTHORIZED, "User not authenticated");
        }
        const userId = req.user._id;
        let user = await Employees_Modals_1.EmployeeModel.findById(userId);
        if (!user) {
            user = await User_Modals_1.userModel.findById(userId);
        }
        if (!user || !user.role) {
            return (0, Api_1.ErrorResponse)(res, Api_2.STATUS_CODE.UNAUTHORIZED, "Invalid user or role");
        }
        const userRole = user?.role?.toLowerCase();
        const normalizedAllowedRoles = allowedRoles.map(role => role.toLowerCase());
        if (!normalizedAllowedRoles.includes(userRole)) {
            return (0, Api_1.ErrorResponse)(res, Api_2.STATUS_CODE.UNAUTHORIZED, "You are not authorized person");
        }
        next();
    }
    catch (error) {
        return (0, Api_1.ErrorResponse)(res, Api_2.STATUS_CODE.INTERNAL_SERVER_ERROR, "Internal server error");
    }
};
exports.checkRole = checkRole;
const validateLeadsAccess = async (req, res, next) => {
    try {
        let status = req?.query?.key;
        const designation = req?.user?.designationId?.name;
        if (!status) {
            status = "public";
        }
        if (designation === "director" || designation === "personal_assistant")
            return next();
        if (designation === "salesman" && ["assigned", "talking", "designing", "negotiation", "closed", "lost", "public"].includes?.(status))
            return next();
        if (designation === "designer" && ["designing", "negotiation", "public"].includes?.(status))
            return next();
        if (designation === "surveyor")
            return next();
        return (0, Api_1.ErrorResponse)(res, Api_2.STATUS_CODE.UNAUTHORIZED, `You are not authorized to get leads of status ${status}.`);
    }
    catch (error) {
        return (0, Api_1.ErrorResponse)(res, Api_2.STATUS_CODE.INTERNAL_SERVER_ERROR, "Internal server error");
    }
};
exports.validateLeadsAccess = validateLeadsAccess;

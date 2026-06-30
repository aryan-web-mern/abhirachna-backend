"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuthService = exports.loginService = void 0;
;
const LoginEmployee_Repositry_1 = require("../Repository/LoginEmployee.Repositry");
const createToken_1 = require("../../../../Services/createToken");
const loginService = async (empId, password, res) => {
    const { user, sessionId } = await (0, LoginEmployee_Repositry_1.loginRepository)(empId, password);
    if (!user) {
        throw new Error("Invalid credentials");
    }
    const token = (0, createToken_1.createToken)(user, sessionId);
    res.cookie("token", token, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    });
    return token;
};
exports.loginService = loginService;
const checkAuthService = async (req) => {
    const userDetails = req.user?._doc;
    console.log(userDetails, 'check for user Details');
    if (!userDetails) {
        throw new Error("No user details found!");
    }
    return userDetails;
};
exports.checkAuthService = checkAuthService;

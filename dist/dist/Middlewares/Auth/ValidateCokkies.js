"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Api_1 = require("../../Api");
const Employees_Modals_1 = require("../../Modules/AbhiRachna/Auth/Modals/Employees.Modals");
const User_Modals_1 = require("../../Modules/AbhiRachna/Auth/Modals/User.Modals");
const checkAuth = async (req, res, next) => {
    try {
        let token = req.cookies?.token;
        if (!token) {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith("Bearer ")) {
                token = authHeader.split(" ")[1];
            }
        }
        if (!token) {
            return (0, Api_1.ErrorResponse)(res, 401, "Unauthorized: No token provided");
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        const sessionId = decoded.sessionId;
        // const userId = "6881e53fb2b6744dd80b5700"
        if (req.headers["x-upload-type"] === "Lead") {
            const session = await User_Modals_1.sessionModel.findOne({ userId, sessionId: sessionId });
            if (!session)
                return (0, Api_1.ErrorResponse)(res, 401, "Session Expired!");
        }
        let user = await Employees_Modals_1.EmployeeModel.findById(userId).select("-password").populate("designationId");
        if (!user) {
            user = await User_Modals_1.userModel.findById(userId);
            ;
        }
        if (!user) {
            return (0, Api_1.ErrorResponse)(res, 401, "Unauthorized: User not found");
        }
        req.user = user;
        req.sessionId = sessionId;
        console.log(user, 'check for user>>>');
        next();
    }
    catch (error) {
        console.error("checkAuth error:", error.message);
        return (0, Api_1.ErrorResponse)(res, 401, "Unauthorized: Invalid token");
    }
};
exports.checkAuth = checkAuth;

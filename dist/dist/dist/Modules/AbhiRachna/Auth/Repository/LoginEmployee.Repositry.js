"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserByIdRepo = exports.loginRepository = void 0;
const Employees_Modals_1 = require("../Modals/Employees.Modals");
const User_Modals_1 = require("../Modals/User.Modals");
const uuid_1 = require("uuid");
const loginRepository = async (empId, password) => {
    try {
        const employeeId = Number(empId);
        const user = await Employees_Modals_1.EmployeeModel.findOne({
            $or: [
                { employeeId: employeeId },
                { phoneNumber: employeeId }
            ]
        });
        const isMatch = password === user?.password;
        if (!isMatch) {
            throw new Error("Invalid credentials");
        }
        await User_Modals_1.sessionModel.deleteMany({ userId: user._id });
        const sessionId = (0, uuid_1.v4)();
        const session = new User_Modals_1.sessionModel({
            userId: user._id,
            sessionId,
        });
        await session.save();
        return { user, sessionId };
    }
    catch (error) {
        console.error("Login repository error:", error.message);
        throw error;
    }
};
exports.loginRepository = loginRepository;
const findUserByIdRepo = async (id) => {
    try {
        return await Employees_Modals_1.EmployeeModel.findById(id);
    }
    catch (error) {
        console.error("Find user by ID repo error:", error.message);
        throw error;
    }
};
exports.findUserByIdRepo = findUserByIdRepo;

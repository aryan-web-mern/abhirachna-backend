"use strict";
//user log in role here
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAllowedEmployeeFields = exports.updateAllowedUserFields = exports.loginUserRepository = void 0;
const S3Delete_1 = require("../../../../Middlewares/Multers/S3Delete/S3Delete");
const Employees_Modals_1 = require("../Modals/Employees.Modals");
const User_Modals_1 = require("../Modals/User.Modals");
const loginUserRepository = async (fullName, phoneNumber) => {
    try {
        let user = await User_Modals_1.userModel.findOne({ phoneNumber });
        if (!user) {
            user = await User_Modals_1.userModel.create({ fullName, phoneNumber });
        }
        return user;
    }
    catch (error) {
        throw (error);
    }
};
exports.loginUserRepository = loginUserRepository;
const updateAllowedUserFields = async (id, updates) => {
    try {
        const allowedFields = ["fullName", "phoneNumber", "email"];
        const filteredUpdate = {};
        for (let field of allowedFields) {
            if (updates[field] !== undefined) {
                filteredUpdate[field] = updates[field];
            }
        }
        if (Object.keys(filteredUpdate).length === 0)
            return null;
        const updatedUser = await User_Modals_1.userModel.findByIdAndUpdate(id, filteredUpdate, {
            new: true,
            upsert: true
        });
        return updatedUser;
    }
    catch (error) {
        console.error("User update error:", error);
        throw new Error("Failed to update user profile");
    }
};
exports.updateAllowedUserFields = updateAllowedUserFields;
const updateAllowedEmployeeFields = async (id, updates, oldProfileImage) => {
    try {
        const allowedFields = ["fullName", "email", "password", "phoneNumber", "profileImage", "address", 'dob', 'gender'];
        const filteredUpdate = {};
        for (let field of allowedFields) {
            if (updates[field] !== undefined) {
                filteredUpdate[field] = updates[field];
            }
        }
        if (Object.keys(filteredUpdate).length === 0)
            return null;
        console.log("Filtered update:", filteredUpdate);
        const updatedEmployee = await Employees_Modals_1.EmployeeModel.findByIdAndUpdate(id, { $set: filteredUpdate }, {
            new: true,
            upsert: true,
        });
        if (filteredUpdate?.profileImage && updatedEmployee && oldProfileImage) {
            await (0, S3Delete_1.deleteFromS3)(oldProfileImage);
        }
        return updatedEmployee;
    }
    catch (error) {
        console.error("Employee update error:", error);
        throw new Error("Failed to update employee profile");
    }
};
exports.updateAllowedEmployeeFields = updateAllowedEmployeeFields;

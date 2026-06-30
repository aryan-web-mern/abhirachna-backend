"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEmpService = exports.RegisterEmployeeService = void 0;
const RegisterEmployee_Repostry_1 = require("../Repository/RegisterEmployee.Repostry");
const RegisterEmployeeService = async (data, employeeInfo) => {
    try {
        const response = await (0, RegisterEmployee_Repostry_1.registerEmployeeRepo)(data, employeeInfo);
        return response;
    }
    catch (error) {
        console.error(`Register Employee service -->>  ${error.message} `);
        throw error;
    }
};
exports.RegisterEmployeeService = RegisterEmployeeService;
const updateEmpService = async (data, id) => {
    try {
        const response = await (0, RegisterEmployee_Repostry_1.updaterEmployeeRepo)(data, id);
        return response;
    }
    catch (error) {
        console.error(`Add Employee Bank And GovtDetail Employee service -->>  ${error.message} `);
        throw error;
    }
};
exports.updateEmpService = updateEmpService;

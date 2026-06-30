"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterCmsDataService = exports.getEmployeesService = void 0;
const Employee_Repository_1 = require("../Repository/Employee.Repository");
const getEmployeesService = async (req, key, role, leadId) => {
    try {
        return await (0, Employee_Repository_1.getEmployeeRepository)(req, key, role, leadId);
    }
    catch (err) {
        throw new Error("Service error (getSingleDesignOption): " + err.message);
    }
};
exports.getEmployeesService = getEmployeesService;
const filterCmsDataService = async (key, type, draft) => {
    try {
        return await (0, Employee_Repository_1.filterCmsDataRepository)(key, type, draft);
    }
    catch (err) {
        throw new Error("Service error (getSingleDesignOption): " + err.message);
    }
};
exports.filterCmsDataService = filterCmsDataService;

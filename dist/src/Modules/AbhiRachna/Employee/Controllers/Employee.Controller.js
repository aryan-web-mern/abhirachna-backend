"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterCmsDataController = exports.getEmployeesController = void 0;
const Employee_Services_1 = require("../Services/Employee.Services");
const getEmployeesController = async (req, res, next) => {
    try {
        const { key, role, leadId } = req.query;
        const data = await (0, Employee_Services_1.getEmployeesService)(req, key, role, leadId);
        res.status(200).json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
};
exports.getEmployeesController = getEmployeesController;
const filterCmsDataController = async (req, res, next) => {
    try {
        let { key, type, draft } = req.query;
        draft = draft === "true" ? true : draft === "false" ? false : undefined;
        const data = await (0, Employee_Services_1.filterCmsDataService)(key, type, draft);
        res.status(200).json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
};
exports.filterCmsDataController = filterCmsDataController;

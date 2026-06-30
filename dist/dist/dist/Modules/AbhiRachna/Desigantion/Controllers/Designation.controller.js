"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addDesignationController = exports.getAllDesignationsController = void 0;
const Api_1 = require("../../../../Api");
const Designation_Services_1 = require("../Services/Designation.Services");
// Add designation 
const addDesignationController = async (req, res, next) => {
    try {
        const { DesignationName, Description } = req.body;
        // Validate input fields
        if (!DesignationName) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.BAD_REQUEST, "Please provide valid data.");
        }
        // Create designation object
        const designationData = {
            name: DesignationName,
            Description: Description,
        };
        const response = await (0, Designation_Services_1.addDesignationService)(designationData);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, "Designation added successfully");
    }
    catch (error) {
        next(error);
    }
};
exports.addDesignationController = addDesignationController;
const getAllDesignationsController = async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.UNAUTHORIZED, "User Not Authorized");
        }
        const result = await (0, Designation_Services_1.getAllDesignationsService)();
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, result);
    }
    catch (error) {
        return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.BAD_REQUEST, error.message || "Something went wrong");
    }
};
exports.getAllDesignationsController = getAllDesignationsController;

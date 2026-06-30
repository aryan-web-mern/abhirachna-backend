"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllDesignationsService = exports.addDesignationService = void 0;
const Designation_Repository_1 = require("../Repository/Designation.Repository");
const addDesignationService = async (data) => {
    try {
        const response = await (0, Designation_Repository_1.addDesignationRepository)(data);
        return response;
    }
    catch (error) {
        console.error(`Designation service -->>  ${error.message} `);
        throw error;
    }
};
exports.addDesignationService = addDesignationService;
const getAllDesignationsService = async () => {
    try {
        const response = await (0, Designation_Repository_1.getAllDesignationsRepo)();
        return response;
    }
    catch (error) {
        console.error(`Designation service -->>  ${error.message} `);
        throw error;
    }
};
exports.getAllDesignationsService = getAllDesignationsService;

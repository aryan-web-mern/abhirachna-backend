"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllDesignationsRepo = exports.addDesignationRepository = void 0;
const Designation_Modals_1 = require("../Modals/Designation.Modals");
const addDesignationRepository = async (data) => {
    try {
        return await Designation_Modals_1.DesignationModel.create(data);
    }
    catch (error) {
        console.error(`add designation repository : ${error.message}`);
        throw error;
    }
};
exports.addDesignationRepository = addDesignationRepository;
const getAllDesignationsRepo = async () => {
    try {
        return await Designation_Modals_1.DesignationModel.find({ name: { $nin: ["system", "director", "cms"] } });
    }
    catch (error) {
        console.error(`add designation repository : ${error.message}`);
        throw error;
    }
};
exports.getAllDesignationsRepo = getAllDesignationsRepo;

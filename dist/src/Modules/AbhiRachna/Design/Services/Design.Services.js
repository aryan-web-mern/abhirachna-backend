"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatusToDesigningService = void 0;
const Design_Repositroy_1 = require("../Repository/Design.Repositroy");
const updateStatusToDesigningService = async (leadId, designerIds, tokenReceived, employeeId, role) => {
    try {
        await (0, Design_Repositroy_1.updateDesigningStatusRepository)(leadId, designerIds, tokenReceived, employeeId, role);
    }
    catch (err) {
        throw new Error("Service error (updateStatusToDesigning): " + err.message);
    }
};
exports.updateStatusToDesigningService = updateStatusToDesigningService;

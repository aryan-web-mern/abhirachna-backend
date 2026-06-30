"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLeadToClosedService = void 0;
const ClosedRepository_1 = require("../Repository/ClosedRepository");
const updateLeadToClosedService = async (data) => {
    try {
        return await (0, ClosedRepository_1.updateLeadToClosedRepository)(data);
    }
    catch (error) {
        throw new Error("Service Error (negotiation): " + error.message);
    }
};
exports.updateLeadToClosedService = updateLeadToClosedService;

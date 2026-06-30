"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLeadToNegotiationService = void 0;
const Negotiation_Repository_1 = require("../Repository/Negotiation.Repository");
const updateLeadToNegotiationService = async (leadId, commentNegotiation, documents, Quatation, employeeId, role) => {
    try {
        return await (0, Negotiation_Repository_1.updateLeadToNegotiationRepository)(leadId, commentNegotiation, documents, Quatation, employeeId, role);
    }
    catch (error) {
        throw new Error("Service Error (negotiation): " + error.message);
    }
};
exports.updateLeadToNegotiationService = updateLeadToNegotiationService;

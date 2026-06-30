"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLeadToNegotiationController = void 0;
const Api_1 = require("../../../../Api");
const Negotiation_Services_1 = require("../Services/Negotiation.Services");
const updateLeadToNegotiationController = async (req, res, next) => {
    const { leadId } = req.params;
    const { commentNegotiation, Quatation } = req.body;
    if (!commentNegotiation.trim() || !Quatation.toString().trim()) {
        return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.BAD_REQUEST, "Please provide comments for negotiation");
    }
    const files = req.files;
    const filesList = files?.documents || [];
    const documents = filesList?.map((file) => file.key);
    if (!req.user || !req.user._id) {
        return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.UNAUTHORIZED, "User not authenticated");
    }
    const employeeId = req.user._id;
    const role = req?.user?.designationId?.name;
    try {
        const result = await (0, Negotiation_Services_1.updateLeadToNegotiationService)(leadId, commentNegotiation, documents, Number(Quatation), employeeId, role);
        return res.status(200).json({
            success: true,
            ...result,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.updateLeadToNegotiationController = updateLeadToNegotiationController;

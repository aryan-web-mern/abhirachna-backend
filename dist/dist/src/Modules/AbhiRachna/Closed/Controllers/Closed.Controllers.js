"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLeadToClosedController = void 0;
const Api_1 = require("../../../../Api");
const ClosedServices_1 = require("../Services/ClosedServices");
const updateLeadToClosedController = async (req, res, next) => {
    if (!req.user || !req.user._id || !req.user.designationId) {
        return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.UNAUTHORIZED, "User not authenticated");
    }
    const userId = req.user._id;
    const { leadId } = req.params;
    const { finalAmount: Quatation, discount: discountBysalesman, totalDiscountPercentage: totalDiscount, amountAfterDiscount, directorDiscount: discountByDirector } = req.body;
    const files = req.files;
    const filesList = files?.documents || [];
    const documents = filesList?.map((file) => file.key);
    if (!req.user || !req.user._id) {
        return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.UNAUTHORIZED, "User not authenticated");
    }
    const employeeId = req.user._id;
    try {
        const result = await (0, ClosedServices_1.updateLeadToClosedService)({
            Quatation,
            discountBysalesman,
            totalDiscount,
            amountAfterDiscount,
            discountByDirector,
            userDesignation: req.user.designationId.name,
            leadId,
            documents,
            employeeId,
            userId
        });
        (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, "Lead Close SuccessFully");
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.updateLeadToClosedController = updateLeadToClosedController;

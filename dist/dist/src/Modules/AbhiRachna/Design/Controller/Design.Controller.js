"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeToDesigningStatus = void 0;
const Api_1 = require("../../../../Api");
const Design_Services_1 = require("../Services/Design.Services");
const changeToDesigningStatus = async (req, res, next) => {
    try {
        const { leadId } = req.params;
        const { designerIds, tokenReceived } = req.body;
        if (!req.user || !req.user._id) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.UNAUTHORIZED, "User not authenticated");
        }
        const employeeId = req.user._id;
        const role = req?.user?.designationId?.name;
        if (!role) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.BAD_REQUEST, "Role is missing");
        }
        await (0, Design_Services_1.updateStatusToDesigningService)(leadId, designerIds, tokenReceived, employeeId, role);
        (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, "Lead status updated to designing");
    }
    catch (error) {
        next(error);
    }
};
exports.changeToDesigningStatus = changeToDesigningStatus;

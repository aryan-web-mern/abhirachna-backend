"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateToTalkingController = void 0;
const TalkingLead_Services_1 = require("../Services/TalkingLead.Services");
const Api_1 = require("../../../../Api");
const updateToTalkingController = async (req, res, next) => {
    try {
        const leadId = req.params.id;
        if (!req.user || !req.user._id) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.UNAUTHORIZED, "User not authenticated");
        }
        if (!req.body?.commentsTalking) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.BAD_REQUEST, "Please provide comments for talking");
        }
        const userId = req.user._id;
        const role = req?.user?.designationId?.name;
        const { leadQuality, commentsTalking, memberIds, assignedSurveyor } = req.body;
        await (0, TalkingLead_Services_1.updateToTalkingService)({ leadId, userId, leadQuality, commentsTalking, memberIds, assignedSurveyor, role });
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, "Lead updated to talking successfully");
    }
    catch (error) {
        return next(error);
    }
};
exports.updateToTalkingController = updateToTalkingController;

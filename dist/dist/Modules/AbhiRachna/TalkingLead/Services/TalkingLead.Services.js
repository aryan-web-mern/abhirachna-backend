"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateToTalkingService = void 0;
const TallkingLead_Repository_1 = require("../Repository/TallkingLead.Repository");
const updateToTalkingService = async ({ leadId, userId, leadQuality, commentsTalking, memberIds, assignedSurveyor, role }) => {
    try {
        await (0, TallkingLead_Repository_1.updateToTalkingRepository)(leadId, userId, leadQuality, commentsTalking, memberIds, assignedSurveyor, role);
    }
    catch (error) {
        throw new Error(`Service Error: ${error.message}`);
    }
};
exports.updateToTalkingService = updateToTalkingService;

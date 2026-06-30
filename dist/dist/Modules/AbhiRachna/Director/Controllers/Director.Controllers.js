"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.approveNegoByDirectorController = exports.approveDesigningByDirectorController = void 0;
const Api_1 = require("../../../../Api");
const Director_Services_1 = require("../Services/Director.Services");
const Api_2 = require("../../../../Api");
const approveDesigningByDirectorController = async (req, res, next) => {
    const { leadId } = req.params;
    let { isApproved } = req.query;
    const isToken = isApproved === "true";
    try {
        if (!req.user || !req.user._id) {
            return (0, Api_2.ErrorResponse)(res, Api_1.STATUS_CODE.UNAUTHORIZED, "User not authenticated");
        }
        const userId = req.user._id;
        const result = await (0, Director_Services_1.approveDesigningByDirectorService)(leadId, userId, isToken);
        (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, "Designing approved by director successfully");
    }
    catch (error) {
        next(error);
    }
};
exports.approveDesigningByDirectorController = approveDesigningByDirectorController;
const approveNegoByDirectorController = async (req, res, next) => {
    const { leadId } = req.params;
    let { isApproved } = req.query;
    console.log(isApproved, 'check for token controller');
    const isToken = isApproved === "true";
    try {
        if (!req.user || !req.user._id) {
            return (0, Api_2.ErrorResponse)(res, Api_1.STATUS_CODE.UNAUTHORIZED, "User not authenticated");
        }
        const userId = req.user._id;
        const result = await (0, Director_Services_1.approveNegoByDirectorService)(leadId, userId, isToken);
        (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, "Designing approved by director successfully");
    }
    catch (error) {
        next(error);
    }
};
exports.approveNegoByDirectorController = approveNegoByDirectorController;

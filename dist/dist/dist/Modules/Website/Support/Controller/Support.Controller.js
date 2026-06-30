"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleMeetingController = exports.saveUserMsgController = void 0;
const Support_Services_1 = require("../Services/Support.Services");
const Api_1 = require("../../../../Api");
const saveUserMsgController = async (req, res, next) => {
    try {
        const msg = await (0, Support_Services_1.saveUserMsgService)(req.body);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, "Message Sent Successfully!");
    }
    catch (err) {
        next(err);
    }
};
exports.saveUserMsgController = saveUserMsgController;
const scheduleMeetingController = async (req, res, next) => {
    try {
        const msg = await (0, Support_Services_1.scheduleMeetingService)(req.body);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, { msg: "Message Sent Successfully!", data: msg });
    }
    catch (err) {
        next(err);
    }
};
exports.scheduleMeetingController = scheduleMeetingController;

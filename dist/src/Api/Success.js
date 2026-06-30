"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuccessResponse = void 0;
const SuccessResponse = (res, status, data) => {
    return res.status(status).json({ success: true, data });
};
exports.SuccessResponse = SuccessResponse;

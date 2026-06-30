"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorResponse = void 0;
const ErrorResponse = (res, status, msg) => {
    return res.status(status).json({ success: false, message: msg });
};
exports.ErrorResponse = ErrorResponse;

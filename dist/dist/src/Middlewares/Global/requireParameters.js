"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Api_1 = require("../../Api");
const requireParameters = (...parameters) => {
    return (req, res, next) => {
        const body = req.body;
        console.log(body, 'check for body>>');
        if (!body || typeof body !== 'object') {
            (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.BAD_REQUEST, 'Request body is missing or invalid');
            return;
        }
        try {
            for (const key of parameters) {
                if (!req.body[key] || req.body[key].toString().trim() === "") {
                    (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.BAD_REQUEST, `Missing or Inavlid ${key}`);
                    return;
                }
            }
            next();
        }
        catch (error) {
            next(new Error(error.message));
        }
    };
};
exports.default = requireParameters;

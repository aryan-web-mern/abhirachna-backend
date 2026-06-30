"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFound = void 0;
const Api_1 = require("../Api");
const logger_1 = __importDefault(require("../Logger/logger"));
const NotFound = (req, res, next) => {
    (0, logger_1.default)({ req })?.log('error', 'error', { message: "Route not found" });
    return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.NOT_FOUND, `Route not found : ${req.originalUrl}`);
};
exports.NotFound = NotFound;

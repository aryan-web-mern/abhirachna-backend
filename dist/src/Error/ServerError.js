"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerError = void 0;
const Api_1 = require("../Api");
const ServerError = (err, req, res, next) => {
    console.error("Error caught: ", err);
    let message = "Something went wrong";
    // Handle MongoDB Duplicate Key Error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    }
    // Handle MongoDB CastError
    if (err.name === "CastError") {
        message = `Invalid ${err.path}: ${err.value}`;
    }
    res.status(Api_1.STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        message: message,
        error: err.message,
        stack: err.stack,
        url: req.originalUrl,
    });
};
exports.ServerError = ServerError;

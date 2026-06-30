"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
function setLogger({ req, errType = "" }) {
    // currently return for lead
    let type = req?.headers["x-upload-type"] ? "lead" : errType === "processError" ? "processError" : "web";
    let filename = 'error.log';
    switch (type) {
        case "lead":
            filename = "leadErrors.log";
            break;
        case "web":
            filename = "webErrors.log";
            break;
        case "processError":
            filename = "error.log";
            break;
    }
    console.log("filename", filename);
    return winston_1.default.createLogger({
        level: 'error',
        format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
        transports: [
            new winston_1.default.transports.File({ filename: filename, level: 'error' }),
        ],
    });
}
exports.default = setLogger;

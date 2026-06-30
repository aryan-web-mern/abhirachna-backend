"use strict";
// src/server.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const node_http_1 = require("node:http");
const ServerError_1 = require("./Error/ServerError");
const Routes_1 = __importDefault(require("./Modules/AbhiRachna/Auth/Routes"));
const Routes_2 = __importDefault(require("./Modules/AbhiRachna/Desigantion/Routes"));
const Routes_3 = __importDefault(require("./Modules/AbhiRachna/Otp/Routes"));
const Routes_4 = __importDefault(require("./Modules/AbhiRachna/Leads/Routes"));
const Routes_5 = __importDefault(require("./Modules/AbhiRachna/TalkingLead/Routes"));
const Routes_6 = __importDefault(require("./Modules/AbhiRachna/Design/Routes"));
const Routes_7 = __importDefault(require("./Modules/AbhiRachna/Director/Routes"));
const Routes_8 = __importDefault(require("./Modules/AbhiRachna/Negotiation/Routes"));
const Routes_9 = __importDefault(require("./Modules/AbhiRachna/Closed/Routes"));
const Routes_10 = __importDefault(require("./Modules/AbhiRachna/Estimate/Routes"));
const Routes_11 = __importDefault(require("./Modules/AbhiRachna/Meeting/Routes"));
// import connectToMongoDB from "Config/db";
const Appconfig_1 = __importDefault(require("./Config/Appconfig"));
const db_1 = __importDefault(require("./Config/db"));
const website_routes_1 = __importDefault(require("./Modules/Website/website.routes"));
const abhirachnaa_routes_1 = __importDefault(require("./Modules/AbhiRachna/abhirachnaa.routes"));
const surveyor_routes_1 = __importDefault(require("./Modules/Surveyor/surveyor.routes"));
const Router_1 = __importDefault(require("./Middlewares/Multers/Router"));
const NotFound_1 = require("./Error/NotFound");
const consumer_1 = require("./RabbitMq/consumer");
const logger_1 = __importDefault(require("./Logger/logger"));
// import { scheduleLogsMail } from "./jobs/scheduleLogsMailService/scheduleLogsMail";
// Online Javascript Editor for free
// Write, Edit and Run your Javascript code using JS Online Compiler
/* ------------------------ PROCESS LEVEL ERROR HANDLERS ------------------------ */
process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err?.name, err?.message);
    (0, logger_1.default)({ errType: "processError" })?.log('error', 'unhandle error', { message: err });
    setTimeout(() => process.exit(1), 100);
});
process.on("uncaughtException", (err, res) => {
    console.error("Uncaught Exception:", err?.name, err?.message);
    (0, logger_1.default)({ errType: "processError" })?.log('error', 'uncaughtException', { message: err });
    setTimeout(() => process.exit(1), 1000);
});
/* ------------------------ APP INITIALIZATION ------------------------ */
const app = (0, express_1.default)();
const appserver = (0, node_http_1.createServer)(app);
const corsOptions = {
    origin: ["https://www.abhirachnaa.com", "https://dashboard.abhirachnaa.com", "https://abhirachnaa.com", "https://www.dashboard.abhirachnaa.com", "https://chat.abhirachnaa.com",
        "https://www.chat.abhirachnaa.com", "https://abhirachna.vercel.app", "http://localhost:5173"],
    credentials: true,
};
/* ------------------------ MIDDLEWARE ------------------------ */
app.use(express_1.default.json({ limit: "100mb" }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, helmet_1.default)());
app.use(helmet_1.default.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)("common"));
app.use((0, cors_1.default)());
// Add more routes here... here 
app.use(`${Appconfig_1.default.api_prefix}/auth`, Routes_1.default);
app.use(`${Appconfig_1.default.api_prefix}/designation`, Routes_2.default);
app.use(`${Appconfig_1.default.api_prefix}/otp`, Routes_3.default);
app.use(`${Appconfig_1.default.api_prefix}/lead`, Routes_4.default);
app.use(`${Appconfig_1.default.api_prefix}/lead/talking`, Routes_5.default);
app.use(`${Appconfig_1.default.api_prefix}/lead/design`, Routes_6.default);
app.use(`${Appconfig_1.default.api_prefix}/director`, Routes_7.default);
app.use(`${Appconfig_1.default.api_prefix}/negotiation`, Routes_8.default);
app.use(`${Appconfig_1.default.api_prefix}/lead/closed`, Routes_9.default);
app.use(`${Appconfig_1.default.api_prefix}/website`, website_routes_1.default);
app.use(`${Appconfig_1.default.api_prefix}/s3`, Router_1.default);
app.use(`${Appconfig_1.default.api_prefix}/estimate`, Routes_10.default);
// Abhirachnaa Routes
app.use(`${Appconfig_1.default.api_prefix}/abhirachnaa`, abhirachnaa_routes_1.default);
app.use(`${Appconfig_1.default.api_prefix}/meeting`, Routes_11.default);
// Surveyor Routes
app.use(`${Appconfig_1.default.api_prefix}/surveyor`, surveyor_routes_1.default);
// /* ------------------------ ERROR HANDLING ------------------------ */
app.use(NotFound_1.NotFound);
app.use(ServerError_1.ServerError);
app.use((err, req, res, next) => {
    (0, logger_1.default)({ req })?.log('error', `statusCode-${res.statusCode} in url- ${req.url}, req-method- ${req.method}`, { message: err });
    res.status(500).json({ message: err?.message || 'Internal Server Error' });
});
app.use((err, req, res, next) => {
    if (err instanceof multer_1.default.MulterError) {
        return res.status(400).json({ message: err.message });
    }
    if (err.message.includes("File too large")) {
        return res.status(413).json({ message: "File exceeds 10MB limit" });
    }
    console.error("Unexpected upload error:", err);
    return res.status(500).json({ message: "File upload failed" });
});
/* ------------------------ DB + SERVER START ------------------------ */
(async () => {
    try {
        await (0, db_1.default)();
    }
    catch (error) {
        console.error("Failed to connect to MongoDB:", error?.message || error);
    }
    try {
        await (0, consumer_1.startConsuming)();
    }
    catch (error) {
        console.error("Failed to start RabbitMQ consumer:", error?.message || error);
    }
})();
appserver.listen(Appconfig_1.default.port, () => {
    console.log(` Server is running on port ${Appconfig_1.default.port}`);
    if ((process.env.S3_ENV === "Development")) {
        console.log("job runsssssss***********");
        // scheduleLogsMail();
    }
});

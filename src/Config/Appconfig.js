"use strict";
// config/AppConfig.ts
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
var AppConfig = /** @class */ (function () {
    function AppConfig() {
        this.port = parseInt(process.env.PORT || "5000", 10);
        this.databaseUrl = process.env.DATABASE_URL || "";
        this.jwtSecret = process.env.JWT_SECRET || "defaultsecret";
        this.environment = process.env.NODE_ENV || "development";
    }
    return AppConfig;
}());
exports.default = new AppConfig();

"use strict";
// config/AppConfig.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class AppConfig {
    // useroffline_dburl: string;
    constructor() {
        this.port = parseInt(process.env.PORT || "3000", 10);
        this.databaseUrl = process.env.DATABASE_URL || "";
        this.jwtSecret = process.env.JWT_SECRET || "";
        this.environment = process.env.NODE_ENV || "";
        this.api_prefix = process.env.API_PREFIX || "/api/v1";
        this.session_secret = process.env.SESSION_SECRET || "";
        this.session_dburl = process.env.SESSION_DBURL || "";
        this.aws_resource_access_id = process.env.AWS_ACCESS_KEY_ID || "";
        this.aws_resource_secret_access_key =
            process.env.AWS_SECRET_ACCESS_KEY || "";
        this.aws_region = process.env.AWS_REGION || "";
        this.aws_role_arn = process.env.AWS_ROLEARN || "";
        this.version_session_secret = process.env.VERSION_SESSION_SECRET || "";
        this.version_session_dburl = process.env.VERSION_SESSION_DBURL || "";
        this.factor_api_key = process.env.FACTOR_API_KEY || "";
        this.template_name = process.env.TEMPLATE_NAME || "";
        this.mq_url = process.env.MQ_URL || "";
        // this.useroffline_dburl = process.env.USEROFFLINE_DBURL || "";
    }
}
exports.default = new AppConfig();

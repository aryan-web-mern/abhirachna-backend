"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getObjectURL = exports.s3 = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
//---------------------------------------------------------------------------------------------
// Intialization of S3 client 
exports.s3 = new client_s3_1.S3Client({
    region: "ap-south-1", // Set your region
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY,
    },
});
//---------------------------------------------------------------------------------------------
// intialize to get the image from s3 using get url Object
const getObjectURL = async (key) => {
    const command = new client_s3_1.GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key
    });
    const url = (0, s3_request_presigner_1.getSignedUrl)(exports.s3, command);
    return url;
};
exports.getObjectURL = getObjectURL;

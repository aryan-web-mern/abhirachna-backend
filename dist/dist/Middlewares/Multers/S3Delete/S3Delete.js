"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFromS3 = deleteFromS3;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const S3Intialization_1 = require("../S3Bucket/S3Intialization");
const client_s3_1 = require("@aws-sdk/client-s3");
const bucketName = process.env.S3_BUCKET_NAME;
async function deleteFromS3(key) {
    try {
        if (!bucketName)
            throw new Error('Bucket name not defined');
        if (!key) {
            throw new Error('No key provided to delete from S3.');
        }
        const params = {
            Bucket: bucketName,
            Key: key
        };
        const command = new client_s3_1.DeleteObjectCommand(params);
        await S3Intialization_1.s3.send(command);
        console.log(`Deleted file ${key} from bucket ${bucketName}`);
    }
    catch (error) {
        console.error(`Error deleting file ${key} from bucket ${bucketName}:`, error);
        throw error; // optionally rethrow or handle gracefully
    }
}

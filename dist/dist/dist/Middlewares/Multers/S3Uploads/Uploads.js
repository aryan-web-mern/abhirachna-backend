"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadS3 = void 0;
const multer_1 = __importDefault(require("multer"));
const sharp_1 = __importDefault(require("sharp"));
const S3Intialization_1 = require("../S3Bucket/S3Intialization");
const client_s3_1 = require("@aws-sdk/client-s3");
function sharpWebpS3Storage(options) {
    return {
        async _handleFile(req, file, cb) {
            try {
                const chunks = [];
                let totalSize = 0;
                const MAX_SIZE = 10 * 1024 * 1024; // 10MB
                // ✅ Track stream size to avoid crash
                file.stream.on("data", (chunk) => {
                    totalSize += chunk.length;
                    if (totalSize > MAX_SIZE) {
                        file.stream.destroy();
                        return cb(new Error("File too large. Max 10MB allowed."));
                    }
                    chunks.push(chunk);
                });
                file.stream.on("error", (err) => cb(err));
                file.stream.on("end", async () => {
                    try {
                        const buffer = Buffer.concat(chunks);
                        const isImage = file.mimetype.startsWith("image/");
                        let uploadBuffer = buffer;
                        let finalKey;
                        // ✅ Generate file key
                        const getKey = () => new Promise((resolve, reject) => {
                            if (options.key) {
                                options.key(req, file, (err, key) => {
                                    if (err)
                                        reject(err);
                                    else
                                        resolve(key);
                                });
                            }
                            else {
                                resolve(`${Date.now()}-${file.originalname}`);
                            }
                        });
                        finalKey = await getKey();
                        // ✅ Convert image to WebP if applicable
                        if (isImage) {
                            uploadBuffer = await (0, sharp_1.default)(buffer).webp({ quality: 70 }).toBuffer();
                            finalKey = finalKey.replace(/\.[^/.]+$/, ".webp");
                        }
                        // ✅ Set file metadata
                        const metadata = await new Promise((resolve, reject) => {
                            if (options.metadata) {
                                options.metadata(req, file, (err, meta) => {
                                    if (err)
                                        reject(err);
                                    else
                                        resolve(meta);
                                });
                            }
                            else {
                                resolve({});
                            }
                        });
                        // ✅ Upload to S3
                        await options.s3Client.send(new client_s3_1.PutObjectCommand({
                            Bucket: options.bucket,
                            Key: finalKey,
                            Body: uploadBuffer,
                            ContentType: isImage ? "image/webp" : file.mimetype,
                            Metadata: metadata,
                        }));
                        cb(null, {
                            bucket: options.bucket,
                            key: finalKey,
                            location: `https://${options.bucket}.s3.amazonaws.com/${finalKey}`,
                        });
                    }
                    catch (err) {
                        cb(err);
                    }
                });
            }
            catch (err) {
                cb(err);
            }
        },
        _removeFile(req, file, cb) {
            cb(null);
        },
    };
}
const abhirachStorage = sharpWebpS3Storage({
    s3Client: S3Intialization_1.s3,
    bucket: process.env.S3_BUCKET_NAME,
    metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
        const uploadType = req.headers["x-upload-type"];
        const targetFolder = uploadType === "Lead" ? "Lead/" : "";
        const envFolder = process.env.S3_ENV === "Development" ? "Development" : "abhirachnaa";
        const fileNameWithoutExt = file.originalname.replace(/\.[^/.]+$/, "");
        const fileExt = file.mimetype.split("/")[1];
        cb(null, `${envFolder}/${targetFolder}${fileNameWithoutExt}-${Date.now()}.${fileExt}`);
    },
});
const uploadS3 = (0, multer_1.default)({
    storage: abhirachStorage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
});
exports.uploadS3 = uploadS3;

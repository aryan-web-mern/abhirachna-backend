"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadCloudinaryCareer = exports.uploadCloudinaryTestimonial = exports.uploadCloudinaryGallery = exports.uploadCloudinaryBlog = void 0;
const multer_1 = __importDefault(require("multer"));
const sharp_1 = __importDefault(require("sharp"));
const stream_1 = require("stream");
const cloudinary_config_1 = __importDefault(require("./cloudinary.config"));
const MAX_SIZE = 10 * 1024 * 1024;
function uploadBuffer(buffer, options) {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_config_1.default.uploader.upload_stream(options, (error, result) => {
            if (error || !result) {
                reject(error || new Error("Cloudinary upload failed"));
                return;
            }
            resolve({
                secure_url: result.secure_url,
                public_id: result.public_id,
            });
        });
        stream_1.Readable.from(buffer).pipe(uploadStream);
    });
}
function createCloudinaryStorage(folder) {
    return {
        _handleFile(req, file, cb) {
            const chunks = [];
            let totalSize = 0;
            file.stream.on("data", (chunk) => {
                totalSize += chunk.length;
                if (totalSize > MAX_SIZE) {
                    file.stream.destroy();
                    cb(new Error("File too large. Max 10MB allowed."));
                    return;
                }
                chunks.push(chunk);
            });
            file.stream.on("error", (err) => cb(err));
            file.stream.on("end", async () => {
                try {
                    const buffer = Buffer.concat(chunks);
                    const isImage = file.mimetype.startsWith("image/");
                    const isVideo = file.mimetype.startsWith("video/");
                    let uploadBufferData = buffer;
                    let resourceType = "raw";
                    if (isImage) {
                        uploadBufferData = await (0, sharp_1.default)(buffer).webp({ quality: 70 }).toBuffer();
                        resourceType = "image";
                    }
                    else if (isVideo) {
                        resourceType = "video";
                    }
                    const fileName = file.originalname.replace(/\.[^/.]+$/, "");
                    const result = await uploadBuffer(uploadBufferData, {
                        folder,
                        resource_type: resourceType,
                        public_id: `${fileName}-${Date.now()}`,
                        format: isImage ? "webp" : undefined,
                    });
                    cb(null, {
                        path: result.secure_url,
                        secure_url: result.secure_url,
                        public_id: result.public_id,
                        key: result.secure_url,
                        location: result.secure_url,
                    });
                }
                catch (error) {
                    cb(error);
                }
            });
        },
        _removeFile(_req, _file, cb) {
            cb(null);
        },
    };
}
function createCloudinaryUploader(folder) {
    return (0, multer_1.default)({
        storage: createCloudinaryStorage(folder),
        limits: {
            fileSize: MAX_SIZE,
        },
    });
}
const envFolder = process.env.CLOUDINARY_FOLDER ||
    (process.env.S3_ENV === "Development" ? "development" : "abhirachnaa");
exports.uploadCloudinaryBlog = createCloudinaryUploader(`${envFolder}/website/blogs`);
exports.uploadCloudinaryGallery = createCloudinaryUploader(`${envFolder}/website/gallery`);
exports.uploadCloudinaryTestimonial = createCloudinaryUploader(`${envFolder}/website/testimonials`);
exports.uploadCloudinaryCareer = createCloudinaryUploader(`${envFolder}/website/careers`);

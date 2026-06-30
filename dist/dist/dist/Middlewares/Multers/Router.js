"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3");
const S3Intialization_1 = require("../../Middlewares/Multers/S3Bucket/S3Intialization");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get("/getimage", async (req, res) => {
    try {
        const { key } = req.query;
        if (!key || typeof key !== "string") {
            return res.status(400).json({
                success: false,
                message: "Image key is required in query",
            });
        }
        const command = new client_s3_1.GetObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: key,
        });
        const s3Response = await S3Intialization_1.s3.send(command);
        if (!s3Response.Body) {
            return res.status(404).json({
                success: false,
                message: "Image not found in S3",
            });
        }
        const stream = s3Response.Body;
        res.setHeader("Content-Type", s3Response.ContentType || "image/jpeg");
        res.setHeader("Content-Length", s3Response.ContentLength?.toString() || "");
        res.setHeader("Accept-Ranges", "bytes");
        res.setHeader("Content-Disposition", "inline");
        return stream.pipe(res);
    }
    catch (error) {
        console.error("S3 stream error:", error);
        return res.status(500).json({
            success: false,
            message: "Error streaming image",
            error: error.message,
        });
    }
});
exports.default = router;
router.get("/getfile/download", async (req, res) => {
    try {
        const { key, filename } = req.query;
        if (!key || typeof key !== "string") {
            return res.status(400).json({
                success: false,
                message: "File key is required in query",
            });
        }
        const command = new client_s3_1.GetObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: key,
        });
        const s3Response = await S3Intialization_1.s3.send(command);
        if (!s3Response.Body) {
            return res.status(404).json({
                success: false,
                message: "File not found in S3",
            });
        }
        const stream = s3Response.Body;
        res.setHeader("Content-Type", s3Response.ContentType || "application/octet-stream");
        res.setHeader("Content-Length", s3Response.ContentLength?.toString() || "");
        res.setHeader("Accept-Ranges", "bytes");
        res.setHeader("Content-Disposition", `attachment; filename="${filename || key}"` // yaha download force hoga
        );
        return stream.pipe(res);
    }
    catch (error) {
        console.error("S3 stream error:", error);
        return res.status(500).json({
            success: false,
            message: "Error streaming file",
            error: error.message,
        });
    }
});

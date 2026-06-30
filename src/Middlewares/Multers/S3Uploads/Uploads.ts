import multer from "multer";
import sharp from "sharp";
import { Request } from "express";
import { s3 } from "../S3Bucket/S3Intialization";
import { PutObjectCommand } from "@aws-sdk/client-s3";

function sharpWebpS3Storage(options: {
  s3Client: typeof s3;
  bucket: string;
  key?: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, key?: string) => void
  ) => void;
  metadata?: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, metadata?: any) => void
  ) => void;
}) {
  return {
    async _handleFile(
      req: Request,
      file: Express.Multer.File,
      cb: (error?: any, info?: any) => void
    ) {
      try {
        const chunks: Buffer[] = [];
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
            let uploadBuffer: Buffer = buffer;
            let finalKey: string;

            // ✅ Generate file key
            const getKey = () =>
              new Promise<string>((resolve, reject) => {
                if (options.key) {
                  options.key(req, file, (err, key) => {
                    if (err) reject(err);
                    else resolve(key!);
                  });
                } else {
                  resolve(`${Date.now()}-${file.originalname}`);
                }
              });

            finalKey = await getKey();

            // ✅ Convert image to WebP if applicable
            if (isImage) {
              uploadBuffer = await sharp(buffer).webp({ quality: 70 }).toBuffer();
              finalKey = finalKey.replace(/\.[^/.]+$/, ".webp");
            }

            // ✅ Set file metadata
            const metadata = await new Promise<any>((resolve, reject) => {
              if (options.metadata) {
                options.metadata(req, file, (err, meta) => {
                  if (err) reject(err);
                  else resolve(meta);
                });
              } else {
                resolve({});
              }
            });

            // ✅ Upload to S3
            await options.s3Client.send(
              new PutObjectCommand({
                Bucket: options.bucket,
                Key: finalKey,
                Body: uploadBuffer,
                ContentType: isImage ? "image/webp" : file.mimetype,
                Metadata: metadata,
              })
            );

            cb(null, {
              bucket: options.bucket,
              key: finalKey,
              location: `https://${options.bucket}.s3.amazonaws.com/${finalKey}`,
            });
          } catch (err) {
            cb(err);
          }
        });
      } catch (err) {
        cb(err);
      }
    },

    _removeFile(req: Request, file: Express.Multer.File, cb: (error: Error | null) => void) {
      cb(null);
    },
  };
}

const abhirachStorage = sharpWebpS3Storage({
  s3Client: s3,
  bucket: process.env.S3_BUCKET_NAME!,
  metadata: (req, file, cb) => {
    cb(null, { fieldName: file.fieldname });
  },
  key: (req, file, cb) => {
    const uploadType = req.headers["x-upload-type"] as string;
    const targetFolder = uploadType === "Lead" ? "Lead/" : "";
    const envFolder =
      process.env.S3_ENV === "Development" ? "Development" : "abhirachnaa";
    const fileNameWithoutExt = file.originalname.replace(/\.[^/.]+$/, "");
    const fileExt = file.mimetype.split("/")[1];
    cb(
      null,
      `${envFolder}/${targetFolder}${fileNameWithoutExt}-${Date.now()}.${fileExt}`
    );
  },
});

const uploadS3 = multer({
  storage: abhirachStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

export { uploadS3 };

import multer from "multer";
import sharp from "sharp";
import { Readable } from "stream";
import { Request } from "express";
import cloudinary from "./cloudinary.config";

const MAX_SIZE = 10 * 1024 * 1024;
type AnyBuffer = Buffer<ArrayBufferLike>;

function uploadBuffer(
  buffer: AnyBuffer,
  options: Record<string, unknown>
): Promise<{
  secure_url: string;
  public_id: string;
}> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Cloudinary upload failed"));
          return;
        }

        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });
}

function createCloudinaryStorage(folder: string) {
  return {
    _handleFile(
      req: Request,
      file: Express.Multer.File,
      cb: (error?: Error | null, info?: any) => void
    ) {
      const chunks: AnyBuffer[] = [];
      let totalSize = 0;

      file.stream.on("data", (chunk: AnyBuffer) => {
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
          const buffer = Buffer.concat(chunks) as AnyBuffer;
          const isImage = file.mimetype.startsWith("image/");
          const isVideo = file.mimetype.startsWith("video/");

          let uploadBufferData: AnyBuffer = buffer;
          let resourceType: "image" | "video" | "raw" = "raw";

          if (isImage) {
            uploadBufferData = await sharp(buffer).webp({ quality: 70 }).toBuffer();
            resourceType = "image";
          } else if (isVideo) {
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
        } catch (error) {
          cb(error as Error);
        }
      });
    },

    _removeFile(
      _req: Request,
      _file: Express.Multer.File,
      cb: (error: Error | null) => void
    ) {
      cb(null);
    },
  };
}

function createCloudinaryUploader(folder: string) {
  return multer({
    storage: createCloudinaryStorage(folder),
    limits: {
      fileSize: MAX_SIZE,
    },
  });
}

const envFolder =
  process.env.CLOUDINARY_FOLDER ||
  (process.env.S3_ENV === "Development" ? "development" : "abhirachnaa");

export const uploadCloudinaryBlog = createCloudinaryUploader(
  `${envFolder}/website/blogs`
);
export const uploadCloudinaryGallery = createCloudinaryUploader(
  `${envFolder}/website/gallery`
);
export const uploadCloudinaryTestimonial = createCloudinaryUploader(
  `${envFolder}/website/testimonials`
);
export const uploadCloudinaryCareer = createCloudinaryUploader(
  `${envFolder}/website/careers`
);

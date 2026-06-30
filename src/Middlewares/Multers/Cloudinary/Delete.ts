import cloudinary from "./cloudinary.config";
import { deleteFromS3 } from "../S3Delete/S3Delete";

export function getPublicIdFromCloudinaryUrl(url: string): string | null {
  if (!url?.includes("cloudinary.com")) {
    return null;
  }

  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-zA-Z0-9]+)?$/);
  return match ? decodeURIComponent(match[1]) : null;
}

export async function deleteFromCloudinary(urlOrPublicId: string): Promise<void> {
  if (!urlOrPublicId) {
    return;
  }

  const publicId = urlOrPublicId.includes("cloudinary.com")
    ? getPublicIdFromCloudinaryUrl(urlOrPublicId)
    : urlOrPublicId;

  if (!publicId) {
    throw new Error("Could not resolve Cloudinary public_id for delete.");
  }

  await cloudinary.uploader.destroy(publicId, { resource_type: "auto" });
}

export async function deleteUploadedFile(urlOrKey: string): Promise<void> {
  if (!urlOrKey) {
    return;
  }

  if (urlOrKey.includes("cloudinary.com")) {
    await deleteFromCloudinary(urlOrKey);
    return;
  }

  await deleteFromS3(urlOrKey);
}

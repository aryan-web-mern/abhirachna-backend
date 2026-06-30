type UploadedFile = Express.Multer.File & {
  secure_url?: string;
  key?: string;
  path?: string;
};

export function getUploadedFileUrl(file?: UploadedFile): string {
  if (!file) {
    return "";
  }

  return file.secure_url || file.path || file.key || "";
}

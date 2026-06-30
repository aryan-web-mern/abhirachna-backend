"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUploadedFileUrl = getUploadedFileUrl;
function getUploadedFileUrl(file) {
    if (!file) {
        return "";
    }
    return file.secure_url || file.path || file.key || "";
}

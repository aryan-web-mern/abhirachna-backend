"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBlogService = exports.unpublishBlogService = exports.publishBlogService = exports.deleteBlogService = exports.getFilteredBlogsService = exports.saveBlogService = exports.likeBlogService = exports.getBlogByIdService = exports.getAllBlogsService = exports.createBlogService = void 0;
const Blogs_Repository_1 = require("../Repository/Blogs.Repository");
const createBlogService = async (data) => {
    try {
        return await (0, Blogs_Repository_1.createBlogRepository)(data);
    }
    catch (err) {
        throw new Error("Service error: " + err.message);
    }
};
exports.createBlogService = createBlogService;
const getAllBlogsService = async (page, limit, userId, draft, published) => {
    try {
        const result = await (0, Blogs_Repository_1.getAllBlogsRepository)(page, limit, userId, draft, published);
        return result;
    }
    catch (err) {
        throw new Error("Service error: " + err.message);
    }
};
exports.getAllBlogsService = getAllBlogsService;
const getBlogByIdService = async (id, userId) => {
    try {
        const blog = await (0, Blogs_Repository_1.getBlogByIdRepository)(id, userId);
        if (!blog)
            throw new Error("Blog not found");
        return blog;
    }
    catch (err) {
        throw new Error("Service error: " + err.message);
    }
};
exports.getBlogByIdService = getBlogByIdService;
const likeBlogService = async (blogId, userId) => {
    try {
        return await (0, Blogs_Repository_1.likeBlogRepository)(blogId, userId);
    }
    catch (err) {
        throw new Error("Service error: " + err.message);
    }
};
exports.likeBlogService = likeBlogService;
const saveBlogService = async (blogId, userId) => {
    try {
        return await (0, Blogs_Repository_1.saveBlogRepository)(blogId, userId);
    }
    catch (err) {
        throw new Error("Service error: " + err.message);
    }
};
exports.saveBlogService = saveBlogService;
const getFilteredBlogsService = async (userId, filter, page, limit) => {
    try {
        if (filter === "like") {
            const blogs = await (0, Blogs_Repository_1.getLikedBlogsRepository)(userId, page, limit);
            return blogs;
        }
        else {
            const blogs = await (0, Blogs_Repository_1.getSavedBlogsRepository)(userId, page, limit);
            return blogs;
        }
    }
    catch (err) {
        throw new Error("Service error: " + err.message);
    }
};
exports.getFilteredBlogsService = getFilteredBlogsService;
const deleteBlogService = async (BlogId) => {
    try {
        await (0, Blogs_Repository_1.deleteBlogRepo)(BlogId);
        return "Blog Deleted Successfully!";
    }
    catch (err) {
        throw new Error("Service error: " + err.message);
    }
};
exports.deleteBlogService = deleteBlogService;
const publishBlogService = async (id, published, draft) => {
    try {
        await (0, Blogs_Repository_1.publishBlogRepo)(id, published, draft);
        return "Blog Published Successfully!";
    }
    catch (err) {
        throw new Error("Service error: " + err.message);
    }
};
exports.publishBlogService = publishBlogService;
const unpublishBlogService = async (id, published, draft) => {
    try {
        await (0, Blogs_Repository_1.unpublishBlogRepo)(id, published, draft);
        return "Blog Unpublished Successfully!";
    }
    catch (err) {
        throw new Error("Service error: " + err.message);
    }
};
exports.unpublishBlogService = unpublishBlogService;
const updateBlogService = async (blogId, userId, updateData) => {
    try {
        return await (0, Blogs_Repository_1.updateBlogRepo)(blogId, userId, updateData);
    }
    catch (err) {
        throw new Error("Service error: " + err.message);
    }
};
exports.updateBlogService = updateBlogService;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBlogRepo = exports.unpublishBlogRepo = exports.publishBlogRepo = exports.deleteBlogRepo = exports.getLikedBlogsRepository = exports.getSavedBlogsRepository = exports.saveBlogRepository = exports.likeBlogRepository = exports.getBlogByIdRepository = exports.getAllBlogsRepository = exports.createBlogRepository = void 0;
const Delete_1 = require("../../../../Middlewares/Multers/Cloudinary/Delete");
const Blogs_Modals_1 = require("../Modals/Blogs.Modals");
const createBlogRepository = async (data) => {
    try {
        return await Blogs_Modals_1.BlogModel.create(data);
    }
    catch (err) {
        throw new Error("Repo error: " + err.message);
    }
};
exports.createBlogRepository = createBlogRepository;
const getAllBlogsRepository = async (page, limit, userId, draft, published) => {
    try {
        const skip = (page - 1) * limit;
        let blogsData = [];
        const [blogs, total, likedBlogs, savedBlogs] = await Promise.all([
            Blogs_Modals_1.BlogModel.find({ draft, published }).sort({ updatedAt: -1 }).skip(skip).limit(limit),
            Blogs_Modals_1.BlogModel.countDocuments({ draft, published }),
            Blogs_Modals_1.BlogLikeModel.find(userId ? { userId } : {}),
            Blogs_Modals_1.BlogSaveModel.find(userId ? { userId } : {}),
        ]);
        blogsData = blogs;
        if (userId) {
            const likedBlogIds = likedBlogs.map((l) => l.blogId.toString());
            const savedBlogIds = savedBlogs.map((s) => s.blogId.toString());
            blogsData = blogs.map((blog) => {
                const blogObj = blog.toObject();
                return {
                    ...blogObj,
                    isLiked: likedBlogIds.includes(blog._id.toString()),
                    isSaved: savedBlogIds.includes(blog._id.toString()),
                };
            });
        }
        return {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            blogs: blogsData,
        };
    }
    catch (err) {
        throw new Error("Repo error: " + err.message);
    }
};
exports.getAllBlogsRepository = getAllBlogsRepository;
const getBlogByIdRepository = async (id, userId) => {
    try {
        const Blog = await Blogs_Modals_1.BlogModel.findById(id);
        if (!Blog) {
            throw new Error("Blog not found");
        }
        let BlogData = Blog.toObject();
        if (userId) {
            const likedBlogs = await Blogs_Modals_1.BlogLikeModel.find(userId ? { userId } : {});
            const savedBlogs = await Blogs_Modals_1.BlogSaveModel.find(userId ? { userId } : {});
            const likedBlogIds = likedBlogs.map((l) => l.blogId.toString());
            const savedBlogIds = savedBlogs.map((s) => s.blogId.toString());
            BlogData['isLiked'] = likedBlogIds.includes(Blog._id.toString());
            BlogData['isSaved'] = savedBlogIds.includes(Blog._id.toString());
        }
        return {
            ...BlogData
        };
    }
    catch (err) {
        throw new Error("Repo error: " + err.message);
    }
};
exports.getBlogByIdRepository = getBlogByIdRepository;
const likeBlogRepository = async (blogId, userId) => {
    try {
        const alreadyLiked = await Blogs_Modals_1.BlogLikeModel.findOne({ blogId, userId });
        if (alreadyLiked) {
            await Blogs_Modals_1.BlogLikeModel.deleteOne({ blogId, userId });
            return { liked: false };
        }
        await Blogs_Modals_1.BlogLikeModel.create({ blogId, userId });
        return { liked: true };
    }
    catch (err) {
        throw new Error("Repo error: " + err.message);
    }
};
exports.likeBlogRepository = likeBlogRepository;
const saveBlogRepository = async (blogId, userId) => {
    try {
        const alreadySaved = await Blogs_Modals_1.BlogSaveModel.findOne({ blogId, userId });
        if (alreadySaved) {
            await Blogs_Modals_1.BlogSaveModel.deleteOne({ blogId, userId });
            return { saved: false };
        }
        await Blogs_Modals_1.BlogSaveModel.create({ blogId, userId });
        return { saved: true };
    }
    catch (err) {
        throw new Error("Repo error: " + err.message);
    }
};
exports.saveBlogRepository = saveBlogRepository;
const getSavedBlogsRepository = async (userId, page, limit) => {
    try {
        const skip = (page - 1) * limit;
        const [blogs, total, likedBlogs] = await Promise.all([
            Blogs_Modals_1.BlogSaveModel.find(userId ? { userId } : {}).sort({ createdAt: -1 }).skip(skip).limit(limit).populate({ path: 'blogId' }),
            Blogs_Modals_1.BlogSaveModel.countDocuments({ userId }),
            Blogs_Modals_1.BlogLikeModel.find(userId ? { userId } : {}),
        ]);
        const likedBlogIds = likedBlogs.map((l) => l.blogId.toString());
        const blogsWithFlags = blogs.map((blog) => {
            const blogObj = blog.blogId.toObject();
            return {
                ...blogObj,
                isLiked: likedBlogIds.includes(blogObj?._id.toString()),
                isSaved: true,
            };
        });
        return {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            blogs: blogsWithFlags,
        };
    }
    catch (err) {
        throw new Error("Repo error: " + err.message);
    }
};
exports.getSavedBlogsRepository = getSavedBlogsRepository;
const getLikedBlogsRepository = async (userId, page = 1, limit = 10) => {
    try {
        const skip = (page - 1) * limit;
        const total = await Blogs_Modals_1.BlogLikeModel.countDocuments({ userId });
        const liked = await Blogs_Modals_1.BlogLikeModel.find({ userId })
            .populate("blogId")
            .skip(skip)
            .limit(limit);
        const blogs = liked.map((l) => l.blogId);
        return {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            blogs,
        };
    }
    catch (err) {
        throw new Error("Repo error: " + err.message);
    }
};
exports.getLikedBlogsRepository = getLikedBlogsRepository;
const deleteBlogRepo = async (BlogId) => {
    try {
        const blog = await Blogs_Modals_1.BlogModel.findById(BlogId);
        if (!blog)
            throw new Error("Blog not found!");
        await blog.deleteOne();
        return "Blog deleted successfully!";
    }
    catch (err) {
        throw new Error(err.message);
    }
};
exports.deleteBlogRepo = deleteBlogRepo;
const publishBlogRepo = async (id, published, draft) => {
    try {
        return await Blogs_Modals_1.BlogModel.findByIdAndUpdate(id, { published, draft });
    }
    catch (err) {
        throw new Error("Repo error: " + err.message);
    }
};
exports.publishBlogRepo = publishBlogRepo;
const unpublishBlogRepo = async (id, published, draft) => {
    try {
        return await Blogs_Modals_1.BlogModel.findByIdAndUpdate(id, { published, draft });
    }
    catch (error) {
    }
};
exports.unpublishBlogRepo = unpublishBlogRepo;
const updateBlogRepo = async (blogId, userId, updateData) => {
    try {
        const blog = await Blogs_Modals_1.BlogModel.findById(blogId);
        const oldBlogImage = blog?.image;
        if (!blog)
            throw new Error("Blog not found or user not authorized");
        await blog.updateOne(updateData);
        if (updateData?.image && oldBlogImage)
            await (0, Delete_1.deleteUploadedFile)(oldBlogImage);
        return blog;
    }
    catch (err) {
        throw new Error("Repo error: " + err.message);
    }
};
exports.updateBlogRepo = updateBlogRepo;

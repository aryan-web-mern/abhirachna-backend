"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogModel = exports.BlogSaveModel = exports.BlogLikeModel = void 0;
const mongoose_1 = require("mongoose");
const BlogSchema = new mongoose_1.Schema({
    title: { type: String, required: false },
    heading: { type: String, required: true },
    subheading: { type: String, required: true },
    image: {
        type: String, required: true
    },
    body: { type: String, required: true },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    published: { type: Boolean, default: false },
    draft: { type: Boolean, default: true }
}, { timestamps: true });
const BlogLikeSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    blogId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Blog", required: true },
}, { timestamps: true });
exports.BlogLikeModel = (0, mongoose_1.model)("BlogLike", BlogLikeSchema);
const BlogSaveSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    blogId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Blog", required: true },
}, { timestamps: true });
exports.BlogSaveModel = (0, mongoose_1.model)("BlogSave", BlogSaveSchema);
BlogSchema.post("deleteOne", { document: true, query: false }, async function () {
    const blogId = this._id;
    await exports.BlogLikeModel.deleteMany({ blogId });
    await exports.BlogSaveModel.deleteMany({ blogId });
});
exports.BlogModel = (0, mongoose_1.model)("Blog", BlogSchema);

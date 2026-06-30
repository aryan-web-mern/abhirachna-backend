import { Schema, model, Types, Document, HydratedDocument } from "mongoose";

export interface IBlog extends Document {
  title: string;
  heading: string;
  subheading: string;
  image: string;
  body: string;
  draft:boolean;
  published:boolean;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: false },
    heading: { type: String, required: true },
    subheading: { type: String, required: true },
    image: {
      type: String, required: true
    },
    body: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  published: { type: Boolean, default: false },
  draft:{type:Boolean,default:true}
  },
  { timestamps: true }
);


export interface IBlogLike extends Document {
  userId: Types.ObjectId;
  blogId: Types.ObjectId;
  createdAt: Date;
}

const BlogLikeSchema = new Schema<IBlogLike>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    blogId: { type: Schema.Types.ObjectId, ref: "Blog", required: true },
  },
  { timestamps: true }
);

export const BlogLikeModel = model<IBlogLike>("BlogLike", BlogLikeSchema);

export interface IBlogSave extends Document {
  userId: Types.ObjectId;
  blogId: Types.ObjectId;
  createdAt: Date;
}

const BlogSaveSchema = new Schema<IBlogSave>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    blogId: { type: Schema.Types.ObjectId, ref: "Blog", required: true },
  },
  { timestamps: true }
);

export const BlogSaveModel = model<IBlogSave>("BlogSave", BlogSaveSchema);

BlogSchema.post("deleteOne", { document: true, query: false }, async function (this: HydratedDocument<IBlog>) {
  const blogId = this._id as any;
  await BlogLikeModel.deleteMany({ blogId })
  await BlogSaveModel.deleteMany({ blogId })
});

export const BlogModel = model<IBlog>("Blog", BlogSchema);
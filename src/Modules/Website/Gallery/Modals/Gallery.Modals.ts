import { Schema, model, Types, Document, HydratedDocument } from "mongoose";

export interface IGallery extends Document {
  imageName: string;
  imageKey: string;
  theme: string;
  uploadedBy: Types.ObjectId;
  draft: boolean;
  published: boolean;
  subheading: string;
  storage: string;
}

const GallerySchema = new Schema<IGallery>(
  {
    imageName: { type: String, required: true },
    imageKey: { type: String, required: true },
    theme: { type: String, required: true },
    published: { type: Boolean, default: false },
    draft: { type: Boolean, default: true },
    subheading: { type: String },
    storage: { type: String },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
  },
  { timestamps: true }
);


export interface IGalleryLike extends Document {
  userId: Types.ObjectId;
  galleryId: Types.ObjectId;
}

const GalleryLikeSchema = new Schema<IGalleryLike>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    galleryId: { type: Schema.Types.ObjectId, ref: "Gallery", required: true },
  },
  { timestamps: true }
);

export const GalleryLikeModel = model<IGalleryLike>("GalleryLike", GalleryLikeSchema);

export interface IGallerySave extends Document {
  userId: Types.ObjectId;
  galleryId: Types.ObjectId;
}

const GallerySaveSchema = new Schema<IGallerySave>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    galleryId: { type: Schema.Types.ObjectId, ref: "Gallery", required: true },
  },
  { timestamps: true }
);

export const GallerySaveModel = model<IGallerySave>("GallerySave", GallerySaveSchema);

GallerySchema.post("deleteOne", { document: true, query: false }, async function (this: HydratedDocument<IGallery>) {
  const galleryId = this._id as any;
  await GalleryLikeModel.deleteMany({ galleryId })
  await GallerySaveModel.deleteMany({ galleryId })
});


export const GalleryModel = model<IGallery>("Gallery", GallerySchema);
import { BlogModel } from "../Modules/Website/Blogs/Modals/Blogs.Modals";
import { JobModel } from "../Modules/Website/Careers/Modals/Careers.Modals";
import { GalleryModel } from "../Modules/Website/Gallery/Modals/Gallery.Modals";
import { TestimonialModel } from "../Modules/Website/TestMonials/Modals/TestMonials.Modals";

type IcollectionMap = {
  [key: string]: any;
};


export const collectionMap: IcollectionMap = {
  blog: BlogModel,
  testimonial: TestimonialModel,
  gallery: GalleryModel,
  job: JobModel
};
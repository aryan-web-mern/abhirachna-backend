// Testimonials/Repository.ts

import { deleteFromS3 } from "../../../../Middlewares/Multers/S3Delete/S3Delete";
import { TestimonialModel } from "../Modals/TestMonials.Modals";



export const createTestimonialRepo = async (data: any) => {
  try {
    return await TestimonialModel.create(data);
  } catch (err: any) {
    throw new Error("Repository Error: " + err.message);
  }
};

export const getApprovedTestimonialsRepo = async () => {
  try {
  
    return await TestimonialModel.find({ approved: true,})
  } catch (err: any) {
    throw new Error("Repository Error: " + err.message);
  }
};

export const getAllTestimonialsRepo = async (page = 1, limit = 10,isDraft:boolean) => {
  try {
    console.log(isDraft,"isdrsft")
    const skip = (page - 1) * limit;
    const query:any=isDraft ? {draft:true} : {approved: true}
    const total = await TestimonialModel.countDocuments(query);
    const testimonials = await TestimonialModel.find(query).sort({updatedAt: -1})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      testimonials,
    };
  } catch (err: any) {
    throw new Error("Repository Error: " + err.message);
  }
};

export const updateApprovalStatusRepo = async (id: string, approved: boolean,draft:boolean) => {
  try {
    return await TestimonialModel.findByIdAndUpdate(id, { approved,draft }, { new: true });
  } catch (err: any) {
    throw new Error("Repository Error: " + err.message);
  }
};

export const deleteTestimionialRepo = async (
  testimonialId: string,
) => {
  try {
    const gal = await TestimonialModel.findById(testimonialId);
    if (!gal) throw new Error("Testimonial not found!");
    await gal.deleteOne();
    return "Testimonial item deleted successfully!";

  } catch (err: any) {
    throw new Error(err.message);
  }
};


export const updateTestimonialRepo = async (id: string, data: any) => {
  try {
    const testimonial = await TestimonialModel.findById(id);
    if (!testimonial) throw new Error("Testimonial not found");

    const oldImage = testimonial.image;
    const oldVideo = testimonial.video;

 
    if (data.image) {

      if (oldImage && oldImage !== data.image) await deleteFromS3(oldImage);
      if (oldVideo) {
        await deleteFromS3(oldVideo); 
      }
      data.video = ""; 
    } else if (data.video) {
   
      if (oldVideo && oldVideo !== data.video) await deleteFromS3(oldVideo);
      if (oldImage) {
        await deleteFromS3(oldImage); 
      }
      data.image = "";
    }

    await testimonial.updateOne(data);

    return await TestimonialModel.findById(id, { new: true });
  } catch (error: any) {
    throw new Error("Repository Error: " + error.message);
  }
};

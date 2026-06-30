// Testimonials/Service.ts

import { createTestimonialRepo,getApprovedTestimonialsRepo,getAllTestimonialsRepo,updateApprovalStatusRepo, deleteTestimionialRepo, updateTestimonialRepo } from "../Repository/TestMonials.Repository";



export const createTestimonialService = async (data: any) => {
  try {
    return await createTestimonialRepo(data);
  } catch (error:any) {
    throw new Error("Error in Service Layer (create): " + error.message);
  }
};

export const getApprovedTestimonialsService = async () => {
  try {
    return await getApprovedTestimonialsRepo();
  } catch (error:any) {
    throw new Error("Error in Service Layer (get approved): " + error.message);
  }
};

export const getAllTestimonialsService = async (page: number, limit: number, isDraft: boolean) => {
  try {
    return await getAllTestimonialsRepo(page, limit, isDraft);
  } catch (error: any) {
    throw new Error("Error in Service Layer (get all): " + error.message);
  }
};

export const updateApprovalStatusService = async (id: string, approved: boolean,draft:boolean) => {
  try {
    return await updateApprovalStatusRepo(id, approved,draft);
  } catch (error:any) {
    throw new Error("Error in Service Layer (approval): " + error.message);
  }
};

export const deleteTestimonialService = async (
  testimonialId: string,
) => {
  try {
    await deleteTestimionialRepo(testimonialId);
    return "Testimonial Deleted Successfully!"
  } catch (err: any) {
    throw new Error("Service error: " + err.message);
  }
};


export const updateTestimonialService=async(id:string,data:any)=>{

try {
    return await updateTestimonialRepo(id, data);
  } catch (error:any) {
    throw new Error("Service error: " + error.message);
  }
}


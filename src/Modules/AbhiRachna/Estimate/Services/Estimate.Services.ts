import { sendEstimateToAdmin } from "../../../../Services/sendEstimateTomail"
import { EstimateModel } from "../Modals/Estimate.Modals";
import { createDesignOptionRepository, createEstimateForExistingLeadRepo, createLeadWithEstimateRepository, deleteDesignOptionRepository, getAllDesignOptionsRepository, getSingleDesignOptionRepository, updateDesignOptionRepository, updateForExistingLeadRepo } from "../Repository/Estimate.Repository";


export const createDesignOptionService = async (data: any) => {
  try {
   

    return await createDesignOptionRepository(data);
  } catch (err: any) {
    throw new Error("Service error (createDesignOption): " + err.message);
  }
};

export const getAllDesignOptionsService = async () => {
  try {
    return await getAllDesignOptionsRepository();
  } catch (err: any) {
    throw new Error("Service error (getAllDesignOptions): " + err.message);
  }
};

export const getSingleDesignOptionService = async (id: string) => {
  try {
    return await getSingleDesignOptionRepository(id);
  } catch (err: any) {
    throw new Error("Service error (getSingleDesignOption): " + err.message);
  }
};



export const deleteDesignOptionService = async (id: string) => {
  try {
    return await deleteDesignOptionRepository(id);
  } catch (err: any) {
    throw new Error("Service error (deleteDesignOption): " + err.message);
  }
};

export const updateDesignOptionService = async (id: string, data: any) => {
  try {
    return await updateDesignOptionRepository(id, data);
  } catch (err: any) {
    throw new Error("Service error (updateDesignOption): " + err.message);
  }
};





export const createLeadWithEstimateService = async (data: any) => {
  try {
    const { estimate } = await createLeadWithEstimateRepository(data);
 
    return estimate._id; 
  } catch (err: any) {
    throw new Error("Service Error (createLeadWithEstimate): " + err.message);
  }
};



export const createExitingLeadEstimateService = async (data: any) => {
  try {
    const { estimate } = await createEstimateForExistingLeadRepo(data);
 
    return estimate._id; 
  } catch (err: any) {
    throw new Error("Service Error (createLeadWithEstimate): " + err.message);
  }
};

export const updateExitingLeadEstimateService = async (estimateId: string, data: any) => {
  try {
    await updateForExistingLeadRepo(estimateId, data);

  } catch (err: any) {
    throw new Error("Service Error (updateLeadWithEstimate): " + err.message);
  }
};


export const getEstimateByLeadIdService = async (estimateId: string) => {
const estimate = await EstimateModel.findOne({ _id: estimateId })
  .populate("selectedDesignOptions")
  .populate("createdBy"); 


sendEstimateToAdmin(estimate)


// console.log(estimate?.createdBy,'check for estimmate')

    //  sendEmail(mailPayload);

    return estimate
};

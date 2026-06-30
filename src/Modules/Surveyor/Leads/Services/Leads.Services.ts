import { approveLeadBySurveyorRepo, createLeadRepository, getSurveyorLeadsRepository } from "../Repository/Leads.Repository";

export const approveLeadBySurveyorService = async (id: string, approvedBySurveyor: boolean,loggedInUserId:string) => {
  try {
    await approveLeadBySurveyorRepo(id, approvedBySurveyor,loggedInUserId);
    return "Lead updated Successfully!";
  } catch (err: any) {
    throw new Error( err.message);
  }
};


export const createLeadService = async (leadData: any) => {
  try {
    const lead = await createLeadRepository(leadData);
    return lead;
  } catch (error) {
    throw new Error("Error during creating lead in service layer: " + (error as Error).message);
  }
};

export const getSurveyorLeadsService = async (surveyorId: string, isApproved: string | boolean, page: number = 1, limit: number = 10) => {
  try {
    const leads = await getSurveyorLeadsRepository(surveyorId, isApproved, page, limit); 
    return leads;
  }
  catch (error) {
    throw new Error("Error during fetching leads in service layer: " + (error as Error).message);
  }   
};

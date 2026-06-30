import { approveDesigningByDirectorRepository, approveNegoByDirectorRepository } from "../Repository/Director.Repository";


export const approveDesigningByDirectorService = async (leadId: string,userId:string,isToken:boolean) => {
  try {
    const result = await approveDesigningByDirectorRepository(leadId,userId,isToken);
    return result;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const approveNegoByDirectorService = async (leadId: string,userId:string,isToken:boolean) => {
  try {
    const result = await approveNegoByDirectorRepository(leadId,userId,isToken);
    return result;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

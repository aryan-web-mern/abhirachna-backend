import { IRootFields } from "src/Typedefination/Roottype";
import { addDesignationRepository, getAllDesignationsRepo } from "../Repository/Designation.Repository";


export const addDesignationService = async (data:IRootFields) => {
  try {
    const response = await addDesignationRepository(data);
    return response;
  } catch (error: any) {
    console.error(`Designation service -->>  ${error.message} `);
    throw error
  }
};


export const getAllDesignationsService = async () => {
  try {
    const response = await getAllDesignationsRepo();
    return response;
  } catch (error: any) {
    console.error(`Designation service -->>  ${error.message} `);
    throw error
  }
};

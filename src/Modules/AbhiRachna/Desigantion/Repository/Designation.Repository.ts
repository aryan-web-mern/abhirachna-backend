import { DesignationModel } from "../Modals/Designation.Modals";


export const addDesignationRepository = async (data: Object) => {
  try {
    return await DesignationModel.create(data);
  } catch (error: any) {
    console.error(`add designation repository : ${error.message}`);
    throw error;
  }
};

export const getAllDesignationsRepo = async () => {
  try {
    return await DesignationModel.find({name: { $nin: ["system", "director"] }});
  } catch (error: any) {
    console.error(`add designation repository : ${error.message}`);
    throw error;
  }
};
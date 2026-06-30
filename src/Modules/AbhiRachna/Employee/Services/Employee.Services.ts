import { Request } from "express";
import { filterCmsDataRepository, getEmployeeRepository } from "../Repository/Employee.Repository";

export const getEmployeesService = async (req: Request , key: string, role: string,leadId:string) => {
  try {
    return await getEmployeeRepository(req, key, role,leadId);
  } catch (err: any) {
    throw new Error("Service error (getSingleDesignOption): " + err.message);
  }
};

export const filterCmsDataService = async (key: string, type: string, draft: boolean | undefined) => {
  try {
    return await filterCmsDataRepository(key, type, draft);
  } catch (err: any) {
    throw new Error("Service error (getSingleDesignOption): " + err.message);
  }
};
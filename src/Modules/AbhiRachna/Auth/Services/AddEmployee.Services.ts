import { Response } from "express";


import { AddEmployeeBankAndGovtDetailRepo, registerEmployeeRepo, updaterEmployeeRepo } from "../Repository/RegisterEmployee.Repostry";

import {BankDetail, EmployeeDetails, GovtDetail } from "../Modals/Employees.Modals";

export const RegisterEmployeeService = async (data: EmployeeDetails, employeeInfo: BankDetail & GovtDetail & { employeeId: string }) => {
  try {
    const response = await registerEmployeeRepo(data, employeeInfo);
    return response;
  } catch (error: any) {
    console.error(`Register Employee service -->>  ${error.message} `);
    throw error;
  }
};



export const updateEmpService = async (data: { employeeDetails: EmployeeDetails, govtDetails: GovtDetail }, id: string) => {
  try {
    const response = await updaterEmployeeRepo(data, id);
    return response;
  } catch (error: any) {
    console.error(`Add Employee Bank And GovtDetail Employee service -->>  ${error.message} `);
    throw error;
  }
};



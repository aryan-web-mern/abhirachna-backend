

import mongoose from "mongoose";
import { STATUS_CODE } from "../../../../Api"
import { BankDetail, BankDetailSchemaModel, EmployeeDetails, EmployeeModel, GovtDetail, GovtIDDetailModel } from "../Modals/Employees.Modals";
import { userModel } from "../Modals/User.Modals";
import { deleteFromS3 } from "../../../../Middlewares/Multers/S3Delete/S3Delete";



//  ----------------------------- Register Employee Repository --------------------------------------------

export const registerEmployeeRepo = async (
  data: EmployeeDetails,
  employeeInfo: BankDetail & GovtDetail
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const existingEmployee = await EmployeeModel.findOne(
      {
        email: data.email,
        phoneNumber: data.phoneNumber,
      },
      null,
      { session }
    );

    if (existingEmployee) {
      return {
        status: STATUS_CODE.BAD_REQUEST,
        message: "Employee already exists."
      };
    }

    const employee = new EmployeeModel(data);
    await employee.save({ session });
    const employeeId = employee._id;

    const employeeInfoWithId = { employeeId, ...employeeInfo } as BankDetail & GovtDetail & { employeeId: string };
    await AddEmployeeBankAndGovtDetailRepo(employeeInfoWithId, session);

    await session.commitTransaction();
    return { employee };

  } catch (error: any) {
    await session.abortTransaction();
    console.error(`Register Employee : ${error.message}`);
    throw error;
  }
  finally {
    session.endSession();
  }
};


export const AddEmployeeBankAndGovtDetailRepo = async (
  data: BankDetail & GovtDetail & { employeeId: string },
  session: mongoose.ClientSession
) => {
  try {
    const { bankName, branchName, accountNumber, IFSCCode, MICRCode, bankDoc, employeeId } = data;
    const { aadharCardNumber, aadharDoc, panCardNumber, panDoc } = data;

    let isAddharNumberExisted = await GovtIDDetailModel.findOne({ aadharCardNumber }).session(session);
    if (isAddharNumberExisted) {
      throw new Error("Addhar Number already exists.");

    }
    let isPanNumberExisted = await GovtIDDetailModel.findOne({ panCardNumber }).session(session);
    if (isPanNumberExisted) {
      throw new Error("Pan Number already exists.");

    }

    let existingEmployee;
    if (!existingEmployee) existingEmployee = await EmployeeModel.findById(employeeId).session(session);

    if (!existingEmployee) {
      throw new Error("Employee doesn't exist.");
    }

    const govtId = new GovtIDDetailModel({ aadharCardNumber, aadharDoc, panCardNumber, panDoc, employeeId });

    const bankDetail = new BankDetailSchemaModel({ bankName, branchName, accountNumber, IFSCCode, MICRCode, bankDoc, employeeId });

    await Promise.all([
      govtId.save({ session }),
      bankDetail.save({ session })
    ]);

  } catch (error: any) {
    console.error(`Register Info : ${error.message}`);
    throw error;
  }
};


//--------------------------------------------------------------------------------------------------------------


export const updaterEmployeeRepo = async (data: { employeeDetails: EmployeeDetails, govtDetails: GovtDetail }, id: string) => {
  try {

    const { employeeDetails, govtDetails } = data;

    const emp = await EmployeeModel.findById(id);

    if (!emp) {
      return {
        status: STATUS_CODE.BAD_REQUEST,
        message: "Employee not found.",
      };
    }

    if (employeeDetails && Object.keys(employeeDetails).length > 0) {
      const employee = await EmployeeModel.findById(id);
      const oldEmployeeProfile = employee?.profileImage;

      await EmployeeModel.updateOne(
        { _id: id },
        { $set: employeeDetails }
      );

      if (employeeDetails?.profileImage && oldEmployeeProfile) {
        await deleteFromS3(oldEmployeeProfile);
      }
    }

    console.log("govtDetails", govtDetails)
    if (govtDetails && Object.keys(govtDetails).length > 0) {
      const govtDetailDocs = await GovtIDDetailModel.find({ employeeId: id });

      let oldAAdharDoc: string | undefined = govtDetailDocs[0]?.aadharDoc;
      let oldPanDoc: string | undefined = govtDetailDocs[0]?.panDoc;

      await GovtIDDetailModel.updateOne({ employeeId: id }, govtDetails);

      if (govtDetails?.aadharDoc && oldAAdharDoc) {
        await deleteFromS3(oldAAdharDoc);
      }
      if (govtDetails?.panDoc && oldPanDoc) {
        await deleteFromS3(oldPanDoc);
      }
    }
  } catch (error: any) {
    console.error(`Update Employee : ${error.message}`);
    throw error;
  }
};

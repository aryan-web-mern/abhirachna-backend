
//user log in role here

import { deleteFromS3 } from "../../../../Middlewares/Multers/S3Delete/S3Delete";
import { EmployeeModel } from "../Modals/Employees.Modals";
import { userModel } from "../Modals/User.Modals";

export const loginUserRepository = async (fullName: string, phoneNumber: number) => {
  try {

    let user = await userModel.findOne({ phoneNumber });

    if (!user) {
      user = await userModel.create({ fullName, phoneNumber })
    }


    return user;



  } catch (error) {
    throw (error)
  }
}



export const updateAllowedUserFields = async (id: any, updates: any) => {
  try {
    const allowedFields = ["fullName", "phoneNumber","email"];
    const filteredUpdate:any = {};

    for (let field of allowedFields) {
      if (updates[field] !== undefined) {
        filteredUpdate[field] = updates[field];
      }
    }

    if (Object.keys(filteredUpdate).length === 0) return null;

    const updatedUser = await userModel.findByIdAndUpdate(id, filteredUpdate, {
      new: true,
      upsert: true
    });

    return updatedUser;
  } catch (error: any) {
    console.error("User update error:", error);
    throw new Error("Failed to update user profile");
  }
};




export const updateAllowedEmployeeFields = async (id: any, updates: any, oldProfileImage: string) => {

  try {
    const allowedFields = ["fullName", "email", "password", "phoneNumber", "profileImage", "address", 'dob', 'gender'];
    const filteredUpdate: any = {};

    for (let field of allowedFields) {
      if (updates[field] !== undefined) {
        filteredUpdate[field] = updates[field];
      }
    }

    if (Object.keys(filteredUpdate).length === 0) return null;
    console.log("Filtered update:", filteredUpdate);

    const updatedEmployee = await EmployeeModel.findByIdAndUpdate(id, { $set: filteredUpdate }, {
      new: true,
      upsert: true,
    });

    if (filteredUpdate?.profileImage && updatedEmployee && oldProfileImage) {
      await deleteFromS3(oldProfileImage)
    }


    return updatedEmployee;
  } catch (error: any) {
    console.error("Employee update error:", error);
    throw new Error("Failed to update employee profile");
  }
};



import { EmployeeModel } from "../Modals/Employees.Modals";
import { sessionModel } from "../Modals/User.Modals";
import { v4 as uuidv4 } from 'uuid';


export const loginRepository = async (empId: string, password: string) => {
  try {
    const employeeId = Number(empId)
    const user = await EmployeeModel.findOne({
      $or: [
        { employeeId: employeeId },
        { phoneNumber: employeeId }
      ]
    });
    const isMatch = password === user?.password;
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    await sessionModel.deleteMany({ userId: user._id });
    const sessionId = uuidv4();
    const session = new sessionModel({
      userId: user._id,
      sessionId,
    });
    await session.save();
    return {user, sessionId};
    
  } catch (error: any) {
    console.error("Login repository error:", error.message);
    throw error;
  }
};

export const findUserByIdRepo = async (id: string) => {
  try {
    return await EmployeeModel.findById(id);
  } catch (error: any) {
    console.error("Find user by ID repo error:", error.message);
    throw error;
  }
};


"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updaterEmployeeRepo = exports.AddEmployeeBankAndGovtDetailRepo = exports.registerEmployeeRepo = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Api_1 = require("../../../../Api");
const Employees_Modals_1 = require("../Modals/Employees.Modals");
const S3Delete_1 = require("../../../../Middlewares/Multers/S3Delete/S3Delete");
//  ----------------------------- Register Employee Repository --------------------------------------------
const registerEmployeeRepo = async (data, employeeInfo) => {
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const existingEmployee = await Employees_Modals_1.EmployeeModel.findOne({
            email: data.email,
            phoneNumber: data.phoneNumber,
        }, null, { session });
        if (existingEmployee) {
            return {
                status: Api_1.STATUS_CODE.BAD_REQUEST,
                message: "Employee already exists."
            };
        }
        const employee = new Employees_Modals_1.EmployeeModel(data);
        await employee.save({ session });
        const employeeId = employee._id;
        const employeeInfoWithId = { employeeId, ...employeeInfo };
        await (0, exports.AddEmployeeBankAndGovtDetailRepo)(employeeInfoWithId, session);
        await session.commitTransaction();
        return { employee };
    }
    catch (error) {
        await session.abortTransaction();
        console.error(`Register Employee : ${error.message}`);
        throw error;
    }
    finally {
        session.endSession();
    }
};
exports.registerEmployeeRepo = registerEmployeeRepo;
const AddEmployeeBankAndGovtDetailRepo = async (data, session) => {
    try {
        const { bankName, branchName, accountNumber, IFSCCode, MICRCode, bankDoc, employeeId } = data;
        const { aadharCardNumber, aadharDoc, panCardNumber, panDoc } = data;
        let isAddharNumberExisted = await Employees_Modals_1.GovtIDDetailModel.findOne({ aadharCardNumber }).session(session);
        if (isAddharNumberExisted) {
            throw new Error("Addhar Number already exists.");
        }
        let isPanNumberExisted = await Employees_Modals_1.GovtIDDetailModel.findOne({ panCardNumber }).session(session);
        if (isPanNumberExisted) {
            throw new Error("Pan Number already exists.");
        }
        let existingEmployee;
        if (!existingEmployee)
            existingEmployee = await Employees_Modals_1.EmployeeModel.findById(employeeId).session(session);
        if (!existingEmployee) {
            throw new Error("Employee doesn't exist.");
        }
        const govtId = new Employees_Modals_1.GovtIDDetailModel({ aadharCardNumber, aadharDoc, panCardNumber, panDoc, employeeId });
        const bankDetail = new Employees_Modals_1.BankDetailSchemaModel({ bankName, branchName, accountNumber, IFSCCode, MICRCode, bankDoc, employeeId });
        await Promise.all([
            govtId.save({ session }),
            bankDetail.save({ session })
        ]);
    }
    catch (error) {
        console.error(`Register Info : ${error.message}`);
        throw error;
    }
};
exports.AddEmployeeBankAndGovtDetailRepo = AddEmployeeBankAndGovtDetailRepo;
//--------------------------------------------------------------------------------------------------------------
const updaterEmployeeRepo = async (data, id) => {
    try {
        const { employeeDetails, govtDetails } = data;
        const emp = await Employees_Modals_1.EmployeeModel.findById(id);
        if (!emp) {
            return {
                status: Api_1.STATUS_CODE.BAD_REQUEST,
                message: "Employee not found.",
            };
        }
        if (employeeDetails && Object.keys(employeeDetails).length > 0) {
            const employee = await Employees_Modals_1.EmployeeModel.findById(id);
            const oldEmployeeProfile = employee?.profileImage;
            await Employees_Modals_1.EmployeeModel.updateOne({ _id: id }, { $set: employeeDetails });
            if (employeeDetails?.profileImage && oldEmployeeProfile) {
                await (0, S3Delete_1.deleteFromS3)(oldEmployeeProfile);
            }
        }
        console.log("govtDetails", govtDetails);
        if (govtDetails && Object.keys(govtDetails).length > 0) {
            const govtDetailDocs = await Employees_Modals_1.GovtIDDetailModel.find({ employeeId: id });
            let oldAAdharDoc = govtDetailDocs[0]?.aadharDoc;
            let oldPanDoc = govtDetailDocs[0]?.panDoc;
            await Employees_Modals_1.GovtIDDetailModel.updateOne({ employeeId: id }, govtDetails);
            if (govtDetails?.aadharDoc && oldAAdharDoc) {
                await (0, S3Delete_1.deleteFromS3)(oldAAdharDoc);
            }
            if (govtDetails?.panDoc && oldPanDoc) {
                await (0, S3Delete_1.deleteFromS3)(oldPanDoc);
            }
        }
    }
    catch (error) {
        console.error(`Update Employee : ${error.message}`);
        throw error;
    }
};
exports.updaterEmployeeRepo = updaterEmployeeRepo;

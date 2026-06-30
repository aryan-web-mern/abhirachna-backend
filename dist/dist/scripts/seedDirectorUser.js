"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const Designation_Modals_1 = require("../src/Modules/AbhiRachna/Desigantion/Modals/Designation.Modals");
const Employees_Modals_1 = require("../src/Modules/AbhiRachna/Auth/Modals/Employees.Modals");
dotenv_1.default.config();
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error("DATABASE_URL is missing from .env");
}
const DIRECTOR_EMPLOYEE_ID = 1001;
const DIRECTOR_PASSWORD = "17062003";
async function main() {
    await mongoose_1.default.connect(databaseUrl);
    const designation = await Designation_Modals_1.DesignationModel.findOneAndUpdate({ name: "director" }, { name: "director", description: "Company Director" }, { upsert: true, new: true });
    const employeeData = {
        fullName: "Brother",
        phoneNumber: 9000001001,
        email: "brother.director@abhirachnaa.com",
        password: DIRECTOR_PASSWORD,
        designationId: designation._id,
        role: "Employee",
        employeeId: DIRECTOR_EMPLOYEE_ID,
        dob: "17-06-2003",
        gender: "Male",
        profileImage: "",
        address: {
            building: "Abhirachnaa HQ",
            street: "Main Road",
            city: "Indore",
            state: "Madhya Pradesh",
            pin: 452001,
            area: "Central",
        },
    };
    let employee = await Employees_Modals_1.EmployeeModel.findOne({ employeeId: DIRECTOR_EMPLOYEE_ID });
    if (employee) {
        await Employees_Modals_1.EmployeeModel.updateOne({ employeeId: DIRECTOR_EMPLOYEE_ID }, { $set: employeeData });
        employee = await Employees_Modals_1.EmployeeModel.findOne({ employeeId: DIRECTOR_EMPLOYEE_ID });
        console.log("Updated existing director user.");
    }
    else {
        await Employees_Modals_1.EmployeeModel.collection.insertOne({
            ...employeeData,
            __t: "EmployeeMaster",
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        employee = await Employees_Modals_1.EmployeeModel.findOne({ employeeId: DIRECTOR_EMPLOYEE_ID });
        console.log("Created new director user.");
    }
    await Employees_Modals_1.EmployeeCounterModel.findOneAndUpdate({}, { $set: { count: DIRECTOR_EMPLOYEE_ID } }, { upsert: true });
    console.log("\nDirector setup complete:");
    console.log(`- Designation: director (${designation._id})`);
    console.log(`- Full name: Brother`);
    console.log(`- Employee ID (login): ${DIRECTOR_EMPLOYEE_ID}`);
    console.log(`- Password: ${DIRECTOR_PASSWORD}`);
    console.log(`- Login URL: POST /api/v1/auth/loginEmployee`);
    console.log(`- Body: { "empId": "${DIRECTOR_EMPLOYEE_ID}", "password": "${DIRECTOR_PASSWORD}" }`);
    await mongoose_1.default.disconnect();
}
main().catch(async (error) => {
    console.error("Director seed failed:", error.message);
    await mongoose_1.default.disconnect();
    process.exit(1);
});

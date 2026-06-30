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
const mongoUri = databaseUrl;
const EMPLOYEE_ID = 1002;
const PASSWORD = "17062003";
async function upsertEmployee(employeeId, data) {
    const existing = await Employees_Modals_1.EmployeeModel.findOne({ employeeId });
    if (existing) {
        await Employees_Modals_1.EmployeeModel.updateOne({ employeeId }, { $set: data });
        console.log(`Updated employee ${employeeId}.`);
        return;
    }
    await Employees_Modals_1.EmployeeModel.collection.insertOne({
        ...data,
        employeeId,
        __t: "EmployeeMaster",
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    console.log(`Created employee ${employeeId}.`);
}
async function main() {
    await mongoose_1.default.connect(mongoUri);
    const designation = await Designation_Modals_1.DesignationModel.findOneAndUpdate({ name: "cms" }, {
        name: "cms",
        description: "Content manager - manages website blogs, gallery, testimonials, and careers",
    }, { upsert: true, new: true });
    await upsertEmployee(EMPLOYEE_ID, {
        fullName: "Content Manager",
        phoneNumber: 9000001002,
        email: "content.manager@abhirachnaa.com",
        password: PASSWORD,
        designationId: designation._id,
        role: "Employee",
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
    });
    const currentCounter = await Employees_Modals_1.EmployeeCounterModel.findOne();
    const nextCount = Math.max(currentCounter?.count ?? 0, EMPLOYEE_ID);
    await Employees_Modals_1.EmployeeCounterModel.findOneAndUpdate({}, { $set: { count: nextCount } }, { upsert: true });
    console.log("\nCMS user setup complete:");
    console.log(`- Designation: cms (${designation._id})`);
    console.log(`- Full name: Content Manager`);
    console.log(`- Employee ID (login): ${EMPLOYEE_ID}`);
    console.log(`- Password: ${PASSWORD}`);
    console.log(`- Login: POST /api/v1/auth/loginEmployee`);
    console.log(`- Body: { "empId": "${EMPLOYEE_ID}", "password": "${PASSWORD}" }`);
    await mongoose_1.default.disconnect();
}
main().catch(async (error) => {
    console.error("CMS seed failed:", error.message);
    await mongoose_1.default.disconnect();
    process.exit(1);
});

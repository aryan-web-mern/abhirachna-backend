"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeModel = exports.EmployeeCounterModel = exports.BankDetailSchemaModel = exports.GovtIDDetailModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const User_Modals_1 = require("./User.Modals");
const Leads_Modals_1 = require("../../Leads/Modals/Leads.Modals");
const govtDetailSchema = new mongoose_1.Schema({
    aadharCardNumber: { type: String },
    aadharDoc: { type: String },
    panCardNumber: { type: String },
    panDoc: { type: String },
    employeeId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Employee",
        required: true,
    },
});
const BankDetailSchema = new mongoose_1.Schema({
    bankName: { type: String },
    branchName: { type: String },
    accountNumber: { type: String },
    IFSCCode: { type: String },
    MICRCode: { type: String },
    bankDoc: { type: String },
    employeeId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Employee",
        required: true,
    },
});
exports.GovtIDDetailModel = mongoose_1.default.model("govtDetail", govtDetailSchema);
exports.BankDetailSchemaModel = mongoose_1.default.model("bankDetail", BankDetailSchema);
const employeeSchema = new mongoose_1.Schema({
    password: { type: String, required: true },
    designationId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Designation",
        required: true,
    },
    profileImage: { type: String, required: false },
    employeeId: { type: Number, required: false },
    address: {
        building: { type: String, required: false },
        street: { type: String, required: false },
        city: { type: String, required: false },
        state: { type: String, required: false },
        pin: { type: Number, required: false },
        area: { type: String, required: false },
    },
    dob: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: false },
}, {
    timestamps: true,
});
exports.EmployeeCounterModel = mongoose_1.default.model("EmployeeCounter", Leads_Modals_1.CounterSchema);
employeeSchema.pre('save', async function (next) {
    try {
        let currentcount = await exports.EmployeeCounterModel.findOne();
        if (!currentcount) {
            currentcount = await exports.EmployeeCounterModel.create({ count: 1000 });
        }
        else {
            currentcount = await exports.EmployeeCounterModel.findOneAndUpdate({}, { $inc: { count: 1 } }, { new: true });
        }
        this.employeeId = currentcount?.count;
        next();
    }
    catch (err) {
        next(err);
    }
});
const EmployeeModel = User_Modals_1.userModel.discriminator("EmployeeMaster", employeeSchema);
exports.EmployeeModel = EmployeeModel;

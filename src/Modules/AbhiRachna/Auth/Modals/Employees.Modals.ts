
import mongoose, { model, Schema, Types } from "mongoose";
import { userModel } from "./User.Modals";
import { CounterSchema, ICounter } from "../../Leads/Modals/Leads.Modals";

interface Designation {
  _id: string;
  name: string;
}
export interface EmployeeDetails {
  fullName: string;
  phoneNumber: Number;
  employeeId?: Number;
  email: string;
  password: string;
  designationId: Types.ObjectId | Designation;
  createdBy?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  role: string;
  profileImage: string;
  address: {
    building: string;
    street: string;
    city: string;
    state: string;
    pin: string;
    area: string;
  };
  dob: string,
  gender: 'Male' | 'Female' | 'Other',
}

export interface GovtDetail {
  aadharCardNumber?: string;
  aadharDoc?: string;
  panCardNumber?: string;
  panDoc?: string;
  employeeId?: Types.ObjectId;
}

export interface BankDetail {
  bankName?: string;
  branchName?: string;
  accountNumber?: string;
  IFSCCode?: string;
  MICRCode?: string;
  bankDoc?: string;
  employeeId?: Types.ObjectId;
}

const govtDetailSchema = new Schema<GovtDetail>(
  {
    aadharCardNumber: { type: String },
    aadharDoc: { type: String },
    panCardNumber: { type: String },
    panDoc: { type: String },
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
  }
)

const BankDetailSchema = new Schema<BankDetail>(
  {
    bankName: { type: String },
    branchName: { type: String },
    accountNumber: { type: String },
    IFSCCode: { type: String },
    MICRCode: { type: String },
    bankDoc: { type: String },
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
  }
)

export const GovtIDDetailModel = mongoose.model<GovtDetail>("govtDetail", govtDetailSchema);
export const BankDetailSchemaModel = mongoose.model<BankDetail>("bankDetail", BankDetailSchema);



const employeeSchema = new Schema<EmployeeDetails>(
  {
    password: { type: String, required: true },
    designationId: {
      type: Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,
  }
);


export const EmployeeCounterModel = mongoose.model<ICounter>("EmployeeCounter", CounterSchema);

employeeSchema.pre('save', async function (next: any) {


  try {

    let currentcount = await EmployeeCounterModel.findOne();

    if (!currentcount) {
      currentcount = await EmployeeCounterModel.create({ count: 1000 });
    } else {

      currentcount = await EmployeeCounterModel.findOneAndUpdate(
        {},
        { $inc: { count: 1 } },
        { new: true }
      );
    }
    this.employeeId = currentcount?.count as number;
    next();
  } catch (err: any) {
    next(err);
  }
});




const EmployeeModel = userModel.discriminator<EmployeeDetails>(
  "EmployeeMaster",
  employeeSchema
);




export { EmployeeModel };


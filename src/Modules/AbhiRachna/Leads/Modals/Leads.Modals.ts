import { UpdatedBy } from "aws-sdk/clients/appflow";
import mongoose, { Schema, Document, Types, Query } from "mongoose";

export interface ILead extends Document {
  name: string;
  mobile: number;
  email: string;
  address: string;
  description: string;

  assignedTo: Types.ObjectId;
  assignedBy: Types.ObjectId;
  status:
  | "new"
  | "assigned"
  | "talking"
  | "designing"
  | "negotiation"
  | "closed"
  | "lost";
  leadtype: "manual" | "customer";
  createdBy: Types.ObjectId;
  estimateDone: boolean;
  createdAt: Date;
  updatedAt: Date;
  randomLeadId: number;
  _oldStatus?: string | null;
  assignedDesigner: Types.ObjectId;
  assignedSurveyor: Types.ObjectId;
  updatedBy: Types.ObjectId;
  haveIssue: boolean;
  issueByUser: Types.ObjectId;
}

export interface IAddLeadDiscountRequest {
  leadId: Types.ObjectId;
  requestedBy: Types.ObjectId;
  discountPercent: number;
  leadName: string;
  quotation: number;
  status: "pending" | "rejected" | "approved";
}

export interface IReferenceDetails extends Document {
  leadId: Types.ObjectId;
  referenceBy: "builder" | "developer" | "vendor" | "real state" | "other";
  referenceType: "yes" | "no";
  refrenceNumber: Number;
  refereeName: String;
}

// Define TS interface
export interface ILeadAlternativeDetails extends Document {
  leadId: Types.ObjectId;
  name: string;
  number: number;
  relationship: "father" | "mother" | "brother" | "other" | "wife";
  addressType: "billing" | "site";
  optionalAddress: string;
}

//lead basic details
export interface ILeadBasicDetails extends Document {
  leadId: Types.ObjectId;
  leadQuality: "cold" | "hot" | "medium";
  commentsTalking: string;
  tokenReceived: boolean;
  approvedTokenBydirector: boolean;
  approvedDesignByDesigner: boolean;
  approvedBySurveyor: boolean;
  Quatation: number;
  documents: string[];
  commnetnNegatiation: string;
  discountype: "rupees" | "percantage";
  totalDiscount: number;
  designers: Types.ObjectId[];
  closedDocuments: string[];
  discountType: string;
  negoApproved: boolean;
  amountAfterDiscount: number;
  employeeId: Types.ObjectId;
  discountBysalesman: number;
  salesmanDiscount: number;
  discountByDirector: number;
  salesmanPendingDiscount: number;
  addDiscountByDirector: boolean;
}

export interface ICounter extends Document {
  count: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILeadLogs {
  leadId: Types.ObjectId;
  updated_from: string;
  updated_to: string;
  createdAt: Date;
  updatedAt: Date;
}

export const CounterSchema: Schema<ICounter> = new Schema(
  {
    count: {
      type: Number,
      default: 100000,
    },
  },
  {
    timestamps: true,
  }
);

const LeadSchema: Schema<ILead> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    mobile: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    assignedDesigner: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    assignedSurveyor: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    randomLeadId: {
      type: Number,
    },
    status: {
      type: String,
      enum: [
        "new",
        "assigned",
        "talking",
        "designing",
        "negotiation",
        "closed",
        "lost",
      ],
      default: "new",
    },
    leadtype: {
      type: String,
      enum: ["manual", "customer"],
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: false,
    },
    estimateDone: {
      type: Boolean,
      default: false,
    },
    haveIssue: {
      type: Boolean,
      default: false,
    },
    issueByUser: {

      type: mongoose.Schema.Types.ObjectId,

    }
  },
  {
    timestamps: true,
  }
);

const ReferenceDetailsSchema: Schema<IReferenceDetails> = new Schema(
  {
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
    },

    referenceType: {
      type: String,
      enum: ["yes", "no"],
      required: true,
    },

    referenceBy: {
      type: String,
      enum: ["vendor", "real state", "developer", "builder"],
      required: false,
    },

    refrenceNumber: {
      type: Number,
      required: false,
    },
    refereeName: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const leadAlternativeDetailsSchema = new Schema<ILeadAlternativeDetails>(
  {
    leadId: {
      type: Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    number: {
      type: Number,
      required: true,
    },
    relationship: {
      type: String,
      required: true,
      enum: ["father", "mother", "brother", "friend", "other", "wife"],
    },
    addressType: {
      type: String,
      // enum: ["billing", "site"],
    },
    optionalAddress: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const LeadBasicDetailsSchema = new Schema<ILeadBasicDetails>(
  {
    leadId: { type: Schema.Types.ObjectId, ref: "Lead", required: true },
    leadQuality: {
      type: String,
      enum: ["cold", "hot", "medium"],
      required: true,
    },
    negoApproved: { type: Boolean, default: false },
    commentsTalking: { type: String, required: true },
    tokenReceived: { type: Boolean, default: false }, //change this in future
    approvedTokenBydirector: { type: Boolean, default: false }, //change this in future
    approvedDesignByDesigner: { type: Boolean, default: false }, //change this in future
    approvedBySurveyor: { type: Boolean, default: false }, //change this in future
    Quatation: { type: Number },
    documents: [{ type: String }],
    commnetnNegatiation: { type: String },

    // in percentage
    totalDiscount: { type: Number },
    discountBysalesman: { type: Number },
    salesmanDiscount: { type: Number, default: 5 },
    discountByDirector: { type: Number },
    addDiscountByDirector: { type: Boolean, default: false },
    // salesmanDiscount - discountBysalesman
    // salesmanPendingDiscount: { type: Number, default: 5 },
    // designers: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Employee",
    //   },
    // ],
    closedDocuments: [{ type: String }],
    amountAfterDiscount: { type: Number },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
  },
  { timestamps: true }
);

export const LeadAlternativeDetailsModel =
  mongoose.model<ILeadAlternativeDetails>(
    "LeadAlternativeDetails",
    leadAlternativeDetailsSchema
  );

export const ReferenceDetailsModel = mongoose.model<IReferenceDetails>(
  "ReferenceDetails",
  ReferenceDetailsSchema
);

export const CounterModel = mongoose.model<ICounter>("Counter", CounterSchema);

//use for random lead id generate

LeadSchema.pre("save", async function (next) {
  try {
    console.log("check");
    let currentcount = await CounterModel.findOne();

    if (!currentcount) {
      currentcount = await CounterModel.create({ count: 100000 });
    } else {
      currentcount = await CounterModel.findOneAndUpdate(
        {},
        { $inc: { count: 1 } },
        { new: true }
      );
    }

    if (!currentcount) {
    }

    this.randomLeadId = currentcount?.count as number;
    next();
  } catch (err: any) {
    next(err);
  }
});

const LeadUpdateLogsSchema: Schema<ILeadLogs> = new Schema(
  {
    leadId: { type: Schema.Types.ObjectId, ref: "Lead", required: true },
    updated_to: {
      type: String,
      required: true,
    },
    updated_from: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

LeadSchema.pre<ILead>("save", async function (next) {
  if (this.isNew) {
    this._oldStatus = null;
    return next();
  }

  if (this.isModified("status")) {
    const Model = this.constructor as mongoose.Model<ILead>;
    const oldDoc = await Model.findById(this._id).lean();

    this._oldStatus = oldDoc ? oldDoc.status : null;
  } else {
    this._oldStatus = null;
  }

  next();
});

LeadSchema.post("save", async function (doc) {
  const currentStatus = doc.status;

  // Check if status changed and was not null
  if (this._oldStatus !== null && this._oldStatus !== currentStatus) {
    if (currentStatus === "lost") {
      const alreadyLostOnce = await LeadUpdateLogsModel.exists({
        leadId: doc._id,
        updated_to: "lost",
      });

      if (alreadyLostOnce) {
        await LeadUpdateLogsModel.deleteOne({
          leadId: doc._id,
          updated_to: "lost",
        });
      }
    }

    await LeadUpdateLogsModel.create({
      leadId: doc._id,
      updated_from: this._oldStatus,
      updated_to: doc.status,
    });
  }
});

const AddLeadDiscountRequestSchema: Schema<IAddLeadDiscountRequest> =
  new Schema(
    {
      leadId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lead",
        required: true,
      },
      requestedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      discountPercent: {
        type: Number,
        required: true,
      },
      leadName: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        enum: ["pending", "rejected", "approved"],
        default: "pending",
        required: true,
      },

      quotation: {
        type: Number,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

export const LeadModel = mongoose.model<ILead>("Lead", LeadSchema);
export const LeadDiscountRequestModel = mongoose.model<IAddLeadDiscountRequest>(
  "LeadDiscountRequest",
  AddLeadDiscountRequestSchema
);
export const LeadUpdateLogsModel = mongoose.model<ILeadLogs>(
  "LeadUpdateLog",
  LeadUpdateLogsSchema
);
export const LeadBasicDetailsModel = mongoose.model<ILeadBasicDetails>(
  "LeadBasicDetails",
  LeadBasicDetailsSchema
);

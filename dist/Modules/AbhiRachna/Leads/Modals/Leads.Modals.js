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
exports.LeadBasicDetailsModel = exports.LeadUpdateLogsModel = exports.LeadDiscountRequestModel = exports.LeadModel = exports.CounterModel = exports.ReferenceDetailsModel = exports.LeadAlternativeDetailsModel = exports.CounterSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
exports.CounterSchema = new mongoose_1.Schema({
    count: {
        type: Number,
        default: 100000,
    },
}, {
    timestamps: true,
});
const LeadSchema = new mongoose_1.Schema({
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
    assignedTo: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Employee" },
    assignedDesigner: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Employee" },
    assignedSurveyor: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Employee" },
    assignedBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Employee",
        required: true,
    },
    updatedBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
        type: mongoose_1.default.Schema.Types.ObjectId,
    }
}, {
    timestamps: true,
});
const ReferenceDetailsSchema = new mongoose_1.Schema({
    leadId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
}, {
    timestamps: true,
});
const leadAlternativeDetailsSchema = new mongoose_1.Schema({
    leadId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, {
    timestamps: true,
});
const LeadBasicDetailsSchema = new mongoose_1.Schema({
    leadId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Lead", required: true },
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
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Employee",
    },
}, { timestamps: true });
exports.LeadAlternativeDetailsModel = mongoose_1.default.model("LeadAlternativeDetails", leadAlternativeDetailsSchema);
exports.ReferenceDetailsModel = mongoose_1.default.model("ReferenceDetails", ReferenceDetailsSchema);
exports.CounterModel = mongoose_1.default.model("Counter", exports.CounterSchema);
//use for random lead id generate
LeadSchema.pre("save", async function (next) {
    try {
        console.log("check");
        let currentcount = await exports.CounterModel.findOne();
        if (!currentcount) {
            currentcount = await exports.CounterModel.create({ count: 100000 });
        }
        else {
            currentcount = await exports.CounterModel.findOneAndUpdate({}, { $inc: { count: 1 } }, { new: true });
        }
        if (!currentcount) {
        }
        this.randomLeadId = currentcount?.count;
        next();
    }
    catch (err) {
        next(err);
    }
});
const LeadUpdateLogsSchema = new mongoose_1.Schema({
    leadId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Lead", required: true },
    updated_to: {
        type: String,
        required: true,
    },
    updated_from: {
        type: String,
        required: false,
    },
}, { timestamps: true });
LeadSchema.pre("save", async function (next) {
    if (this.isNew) {
        this._oldStatus = null;
        return next();
    }
    if (this.isModified("status")) {
        const Model = this.constructor;
        const oldDoc = await Model.findById(this._id).lean();
        this._oldStatus = oldDoc ? oldDoc.status : null;
    }
    else {
        this._oldStatus = null;
    }
    next();
});
LeadSchema.post("save", async function (doc) {
    const currentStatus = doc.status;
    // Check if status changed and was not null
    if (this._oldStatus !== null && this._oldStatus !== currentStatus) {
        if (currentStatus === "lost") {
            const alreadyLostOnce = await exports.LeadUpdateLogsModel.exists({
                leadId: doc._id,
                updated_to: "lost",
            });
            if (alreadyLostOnce) {
                await exports.LeadUpdateLogsModel.deleteOne({
                    leadId: doc._id,
                    updated_to: "lost",
                });
            }
        }
        await exports.LeadUpdateLogsModel.create({
            leadId: doc._id,
            updated_from: this._oldStatus,
            updated_to: doc.status,
        });
    }
});
const AddLeadDiscountRequestSchema = new mongoose_1.Schema({
    leadId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Lead",
        required: true,
    },
    requestedBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
}, {
    timestamps: true,
});
exports.LeadModel = mongoose_1.default.model("Lead", LeadSchema);
exports.LeadDiscountRequestModel = mongoose_1.default.model("LeadDiscountRequest", AddLeadDiscountRequestSchema);
exports.LeadUpdateLogsModel = mongoose_1.default.model("LeadUpdateLog", LeadUpdateLogsSchema);
exports.LeadBasicDetailsModel = mongoose_1.default.model("LeadBasicDetails", LeadBasicDetailsSchema);

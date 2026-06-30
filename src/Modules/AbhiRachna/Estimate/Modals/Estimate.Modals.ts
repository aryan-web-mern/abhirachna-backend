

import mongoose, { Schema ,Types} from "mongoose";

const DesignOptionSchema = new mongoose.Schema({
  category: {
    type: String,      
    required: true
  },
  label: {
    type: String,      
    enum: ["Basic", "Standard", "Premium", "None"],
    required: true
  },
  pricePerSqft: {
    type: Number,      
    required: true
  },
  details: {
    type: [String], 
    default: [],
  },
  extraDetails: {
    type: String
  }
}, {
  timestamps: true      
});



const AreaSchema = new Schema(
  {
    SleepingArea: { type: Number, required: true ,default:0},
    Bathroom: { type: Number, required: true,default:0 },
    Kitchen: { type: Number, required: true,default:0 },
    Dining: { type: Number, required: true,default:0 },
    UtilityArea:{ type: Number, required: true ,default:0},
  },

  { _id: false }
);

export interface IEstimate extends Document {
  leadId: Types.ObjectId;
  AreaDetails: {
    SleepingArea: number;
    Bathroom: number;
    Kitchen: number;
    Dining: number;
    UtilityArea:number;
  };
  selectedDesignOptions: Types.ObjectId[];
  layoutType:String, 
  squareFeetRange:String,
  totalPerSqftCost:number,
  minEstimate:number,
  maxEstimate:number,
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}


const EstimateSchema = new Schema<IEstimate>(
  {
    leadId: { type: Schema.Types.ObjectId, ref: "Lead", required: true },

    AreaDetails: {
      type: AreaSchema,
      required: true,
    },

   squareFeetRange: { type: String, required: true }, 
  totalPerSqftCost: { type: Number, required: true }, 
  minEstimate: { type: Number, required: true }, 
  maxEstimate: { type: Number, required: true }, 
  layoutType: { type: String, required: true },

    selectedDesignOptions: [
      {
        type: Schema.Types.ObjectId,
        ref: "DesignOption",
        required: true,
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);




export const DesignOptionModel = mongoose.model("DesignOption", DesignOptionSchema);
export const EstimateModel = mongoose.model<IEstimate>("Estimate", EstimateSchema);

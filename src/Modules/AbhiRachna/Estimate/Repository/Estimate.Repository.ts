import mongoose from "mongoose";
import { LeadModel } from "../../Leads/Modals/Leads.Modals";
import { DesignOptionModel, EstimateModel } from "../Modals/Estimate.Modals";
import { sendToQueueCreateFolder } from "../../../../RabbitMq/producer";


export const createDesignOptionRepository = async (data: any) => {
  try {
    const { category, label } = data;
    const existing = await DesignOptionModel.findOne({ category, label });

    if (existing) {
      throw new Error(`Design option with category "${category}" and label "${label}" already exists`);
    }
    return await DesignOptionModel.create(data);
  } catch (err: any) {
    throw new Error("Repo error (createDesignOption): " + err.message);
  }
};

export const getAllDesignOptionsRepository = async () => {
  try {
    const all = await DesignOptionModel.aggregate([
      {
        $addFields: {
          sortOrder: {
            $switch: {
              branches: [
                { case: { $eq: ["$label", "Premium"] }, then: 1 },
                { case: { $eq: ["$label", "Standard"] }, then: 2 },
                { case: { $eq: ["$label", "Basic"] }, then: 3 },
                { case: { $eq: ["$label", "None"] }, then: 4 }
              ],
              default: 5
            }
          }
        }
      },
      {
        $sort: {
          category: 1,
          sortOrder: 1
        }
      },
      {
        $group: {
          _id: "$category",
          items: { $push: "$$ROOT" }
        }
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          items: 1
        }
      }
    ]);
    const grouped: Record<string, any[]> = {};

    all.forEach((item) => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });

    return grouped;
  } catch (err: any) {
    throw new Error("Repo error (getAllDesignOptions): " + err.message);
  }
};


export const getSingleDesignOptionRepository = async (id: string) => {
  try {
    const option = await DesignOptionModel.findById(id);
    if (!option) throw new Error("Design option not found");
    return option;
  } catch (err: any) {
    throw new Error("Repo error (getSingleDesignOption): " + err.message);
  }
};




export const deleteDesignOptionRepository = async (id: string) => {
  try {
    const result = await DesignOptionModel.findByIdAndDelete(id);
    if (!result) throw new Error("Design option not found");
    return result;
  } catch (err: any) {
    throw new Error("Repo error (deleteDesignOption): " + err.message);
  }
};

export const updateDesignOptionRepository = async (id: string, data: any) => {
  try {
    const result = await DesignOptionModel.findByIdAndUpdate(id, data);
    if (!result) throw new Error("Design option not found");
    return result;
  } catch (err: any) {
    throw new Error("Repo error (updateDesignOption): " + err.message);
  }
};




export const createLeadWithEstimateRepository = async (data: any) => {
  const {
    name,
    mobile,
    address,
    createdBy,
    leadtype,
    selectedDesignOptions,
    squareFeetRange,
    AreaDetails,
    layoutType
  } = data;

  const session = await LeadModel.startSession();
  session.startTransaction();

  try {

    const newLead = await LeadModel.create([{
      name,
      mobile,
      address,
      createdBy,
      leadtype,
      estimateDone: false,

    }], { session });

    const lead = newLead[0];


    const [minSqft, maxSqft] = squareFeetRange.split("-").map(Number);

    const selectedOptions = await DesignOptionModel.find({ _id: { $in: selectedDesignOptions } });
    const totalPerSqftCost = selectedOptions.reduce((acc, item) => acc + item.pricePerSqft, 0);

    const minEstimate = minSqft * totalPerSqftCost;
    const maxEstimate = maxSqft * totalPerSqftCost;

    const estimate = await EstimateModel.create([{
      leadId: lead._id,
      createdBy,
      minEstimate,
      selectedDesignOptions,
      AreaDetails,
      maxEstimate,
      squareFeetRange,
      totalPerSqftCost,
      layoutType
    }], { session });


    lead.estimateDone = true;
    await lead.save({ session });

    await session.commitTransaction();
    session.endSession();

   // Convert both to string
   // Type assertion
   const leadIdStr = (lead._id as mongoose.Types.ObjectId).toString();
   const createdByStr = (lead.createdBy as mongoose.Types.ObjectId).toString(); 
   
   console.log(createdByStr, leadIdStr, "check for lead");
   
   // Send to queue
   await sendToQueueCreateFolder(leadIdStr, createdByStr);


    return {
      lead,
      estimate: estimate[0],
    };




  } catch (err: any) {
    await session.abortTransaction();
    session.endSession();
    throw new Error("Repo Error (createLeadWithEstimate): " + err.message);
  }
};



export const createEstimateForExistingLeadRepo = async (data: any) => {
  const {
    leadId,
    createdBy,
    selectedDesignOptions,
    squareFeetRange,
    AreaDetails,
    layoutType,
    currentUser
  } = data;

  const session = await LeadModel.startSession();
  session.startTransaction();

  try {
    const leadObjectId = new mongoose.Types.ObjectId(leadId);

    // Check if the lead exists
    const existingLead = await LeadModel.findById(leadObjectId).session(session);
    if (!existingLead) {
      throw new Error("Lead not found");
    }

    // Parse sqft range and calculate estimate
    const [minSqft, maxSqft] = squareFeetRange.split("-").map(Number);
    const selectedOptions = await DesignOptionModel.find({ _id: { $in: selectedDesignOptions } });
    const totalPerSqftCost = selectedOptions.reduce((acc, item) => acc + item.pricePerSqft, 0);

    const minEstimate = minSqft * totalPerSqftCost;
    const maxEstimate = maxSqft * totalPerSqftCost;

    // Create Estimate
    const estimate = await EstimateModel.create([{
      leadId: leadObjectId,
      createdBy,
      selectedDesignOptions,
      AreaDetails,
      squareFeetRange,
      layoutType,
      totalPerSqftCost,
      minEstimate,
      maxEstimate
    }], { session });

    // Update lead with estimateDone = true
    existingLead.estimateDone = true;
    existingLead.updatedBy=new mongoose.Types.ObjectId(createdBy);
    await existingLead.save({ session });

    await session.commitTransaction();
    session.endSession();

    return {
      lead: existingLead,
      estimate: estimate[0]
    };

  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new Error("Repo Error (createEstimateForExistingLeadRepo): " + error.message);
  }
};


export const updateForExistingLeadRepo = async (estimateId: string, data: any) => {
  const {
    leadId,
    createdBy,
    selectedDesignOptions,
    squareFeetRange,
    AreaDetails,
    layoutType,
    currentUser
  } = data;


  try {
    const leadObjectId = new mongoose.Types.ObjectId(leadId);

    // Check if the lead exists
    const existingLead = await LeadModel.findById(leadObjectId)
    if (!existingLead) {
      throw new Error("Lead not found");
    }

    // Parse sqft range and calculate estimate
    const [minSqft, maxSqft] = squareFeetRange.split("-").map(Number);
    const selectedOptions = await DesignOptionModel.find({ _id: { $in: selectedDesignOptions } });
    const totalPerSqftCost = selectedOptions.reduce((acc, item) => acc + item.pricePerSqft, 0);

    const minEstimate = minSqft * totalPerSqftCost;
    const maxEstimate = maxSqft * totalPerSqftCost;

    // updatee Estimate
    const estimate = await EstimateModel.findOneAndUpdate({_id: estimateId},{
      
      leadId: leadObjectId,
      createdBy,
      selectedDesignOptions,
      AreaDetails,
      squareFeetRange,
      layoutType,
      totalPerSqftCost,
      minEstimate,
      maxEstimate,
    
    });

    existingLead.updatedBy=new mongoose.Types.ObjectId(createdBy);
    

    await existingLead.save()

    if (!estimate) {
      throw new Error("Repo Error (createEstimateForExistingLeadRepo): Estimate not existed");
    }

  } catch (error: any) {
    throw new Error("Repo Error (createEstimateForExistingLeadRepo): " + error.message);
  }
};


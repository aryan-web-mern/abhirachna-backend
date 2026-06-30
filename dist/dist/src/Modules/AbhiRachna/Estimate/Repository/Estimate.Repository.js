"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateForExistingLeadRepo = exports.createEstimateForExistingLeadRepo = exports.createLeadWithEstimateRepository = exports.updateDesignOptionRepository = exports.deleteDesignOptionRepository = exports.getSingleDesignOptionRepository = exports.getAllDesignOptionsRepository = exports.createDesignOptionRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Leads_Modals_1 = require("../../Leads/Modals/Leads.Modals");
const Estimate_Modals_1 = require("../Modals/Estimate.Modals");
const producer_1 = require("../../../../RabbitMq/producer");
const createDesignOptionRepository = async (data) => {
    try {
        const { category, label } = data;
        const existing = await Estimate_Modals_1.DesignOptionModel.findOne({ category, label });
        if (existing) {
            throw new Error(`Design option with category "${category}" and label "${label}" already exists`);
        }
        return await Estimate_Modals_1.DesignOptionModel.create(data);
    }
    catch (err) {
        throw new Error("Repo error (createDesignOption): " + err.message);
    }
};
exports.createDesignOptionRepository = createDesignOptionRepository;
const getAllDesignOptionsRepository = async () => {
    try {
        const all = await Estimate_Modals_1.DesignOptionModel.aggregate([
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
        const grouped = {};
        all.forEach((item) => {
            if (!grouped[item.category]) {
                grouped[item.category] = [];
            }
            grouped[item.category].push(item);
        });
        return grouped;
    }
    catch (err) {
        throw new Error("Repo error (getAllDesignOptions): " + err.message);
    }
};
exports.getAllDesignOptionsRepository = getAllDesignOptionsRepository;
const getSingleDesignOptionRepository = async (id) => {
    try {
        const option = await Estimate_Modals_1.DesignOptionModel.findById(id);
        if (!option)
            throw new Error("Design option not found");
        return option;
    }
    catch (err) {
        throw new Error("Repo error (getSingleDesignOption): " + err.message);
    }
};
exports.getSingleDesignOptionRepository = getSingleDesignOptionRepository;
const deleteDesignOptionRepository = async (id) => {
    try {
        const result = await Estimate_Modals_1.DesignOptionModel.findByIdAndDelete(id);
        if (!result)
            throw new Error("Design option not found");
        return result;
    }
    catch (err) {
        throw new Error("Repo error (deleteDesignOption): " + err.message);
    }
};
exports.deleteDesignOptionRepository = deleteDesignOptionRepository;
const updateDesignOptionRepository = async (id, data) => {
    try {
        const result = await Estimate_Modals_1.DesignOptionModel.findByIdAndUpdate(id, data);
        if (!result)
            throw new Error("Design option not found");
        return result;
    }
    catch (err) {
        throw new Error("Repo error (updateDesignOption): " + err.message);
    }
};
exports.updateDesignOptionRepository = updateDesignOptionRepository;
const createLeadWithEstimateRepository = async (data) => {
    const { name, mobile, address, createdBy, leadtype, selectedDesignOptions, squareFeetRange, AreaDetails, layoutType } = data;
    const session = await Leads_Modals_1.LeadModel.startSession();
    session.startTransaction();
    try {
        const newLead = await Leads_Modals_1.LeadModel.create([{
                name,
                mobile,
                address,
                createdBy,
                leadtype,
                estimateDone: false,
            }], { session });
        const lead = newLead[0];
        const [minSqft, maxSqft] = squareFeetRange.split("-").map(Number);
        const selectedOptions = await Estimate_Modals_1.DesignOptionModel.find({ _id: { $in: selectedDesignOptions } });
        const totalPerSqftCost = selectedOptions.reduce((acc, item) => acc + item.pricePerSqft, 0);
        const minEstimate = minSqft * totalPerSqftCost;
        const maxEstimate = maxSqft * totalPerSqftCost;
        const estimate = await Estimate_Modals_1.EstimateModel.create([{
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
        const leadIdStr = lead._id.toString();
        const createdByStr = lead.createdBy.toString();
        console.log(createdByStr, leadIdStr, "check for lead");
        // Send to queue
        await (0, producer_1.sendToQueueCreateFolder)(leadIdStr, createdByStr);
        return {
            lead,
            estimate: estimate[0],
        };
    }
    catch (err) {
        await session.abortTransaction();
        session.endSession();
        throw new Error("Repo Error (createLeadWithEstimate): " + err.message);
    }
};
exports.createLeadWithEstimateRepository = createLeadWithEstimateRepository;
const createEstimateForExistingLeadRepo = async (data) => {
    const { leadId, createdBy, selectedDesignOptions, squareFeetRange, AreaDetails, layoutType, currentUser } = data;
    const session = await Leads_Modals_1.LeadModel.startSession();
    session.startTransaction();
    try {
        const leadObjectId = new mongoose_1.default.Types.ObjectId(leadId);
        // Check if the lead exists
        const existingLead = await Leads_Modals_1.LeadModel.findById(leadObjectId).session(session);
        if (!existingLead) {
            throw new Error("Lead not found");
        }
        // Parse sqft range and calculate estimate
        const [minSqft, maxSqft] = squareFeetRange.split("-").map(Number);
        const selectedOptions = await Estimate_Modals_1.DesignOptionModel.find({ _id: { $in: selectedDesignOptions } });
        const totalPerSqftCost = selectedOptions.reduce((acc, item) => acc + item.pricePerSqft, 0);
        const minEstimate = minSqft * totalPerSqftCost;
        const maxEstimate = maxSqft * totalPerSqftCost;
        // Create Estimate
        const estimate = await Estimate_Modals_1.EstimateModel.create([{
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
        existingLead.updatedBy = new mongoose_1.default.Types.ObjectId(createdBy);
        await existingLead.save({ session });
        await session.commitTransaction();
        session.endSession();
        return {
            lead: existingLead,
            estimate: estimate[0]
        };
    }
    catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw new Error("Repo Error (createEstimateForExistingLeadRepo): " + error.message);
    }
};
exports.createEstimateForExistingLeadRepo = createEstimateForExistingLeadRepo;
const updateForExistingLeadRepo = async (estimateId, data) => {
    const { leadId, createdBy, selectedDesignOptions, squareFeetRange, AreaDetails, layoutType, currentUser } = data;
    try {
        const leadObjectId = new mongoose_1.default.Types.ObjectId(leadId);
        // Check if the lead exists
        const existingLead = await Leads_Modals_1.LeadModel.findById(leadObjectId);
        if (!existingLead) {
            throw new Error("Lead not found");
        }
        // Parse sqft range and calculate estimate
        const [minSqft, maxSqft] = squareFeetRange.split("-").map(Number);
        const selectedOptions = await Estimate_Modals_1.DesignOptionModel.find({ _id: { $in: selectedDesignOptions } });
        const totalPerSqftCost = selectedOptions.reduce((acc, item) => acc + item.pricePerSqft, 0);
        const minEstimate = minSqft * totalPerSqftCost;
        const maxEstimate = maxSqft * totalPerSqftCost;
        // updatee Estimate
        const estimate = await Estimate_Modals_1.EstimateModel.findOneAndUpdate({ _id: estimateId }, {
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
        existingLead.updatedBy = new mongoose_1.default.Types.ObjectId(createdBy);
        await existingLead.save();
        if (!estimate) {
            throw new Error("Repo Error (createEstimateForExistingLeadRepo): Estimate not existed");
        }
    }
    catch (error) {
        throw new Error("Repo Error (createEstimateForExistingLeadRepo): " + error.message);
    }
};
exports.updateForExistingLeadRepo = updateForExistingLeadRepo;

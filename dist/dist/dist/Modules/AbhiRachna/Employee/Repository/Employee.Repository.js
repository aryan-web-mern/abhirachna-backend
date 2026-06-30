"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterCmsDataRepository = exports.getEmployeeRepository = void 0;
const Employees_Modals_1 = require("../../Auth/Modals/Employees.Modals");
const mongoose_1 = __importDefault(require("mongoose"));
const getAllLeadMember_1 = require("../../../..//Services/getAllLeadMember");
const functions_1 = require("../../../../utils/functions");
const getEmployeeRepository = async (req, key, role, leadId) => {
    try {
        const matchStage = { _id: { $ne: req?.user?._id } };
        let allMember = [];
        if (leadId) {
            allMember = await (0, getAllLeadMember_1.getAllLeadMembers)(leadId);
        }
        if (key) {
            matchStage.$or = [
                { fullName: { $regex: key, $options: "i" } },
                { employeeId: { $regex: key, $options: "i" } },
            ];
        }
        if (allMember.length > 0) {
            matchStage._id = { $nin: allMember?.map(id => new mongoose_1.default.Types.ObjectId(id)) };
        }
        if (role) {
            matchStage["designation.name"] = role;
        }
        const employees = await Employees_Modals_1.EmployeeModel.aggregate([
            {
                $lookup: {
                    from: "govtdetails",
                    localField: "_id",
                    foreignField: "employeeId",
                    as: "govtDetail",
                },
            },
            { $unwind: { path: "$govtDetail", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "bankdetails",
                    localField: "_id",
                    foreignField: "employeeId",
                    as: "bankDetail",
                },
            },
            { $unwind: { path: "$bankDetail", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "designations",
                    localField: "designationId",
                    foreignField: "_id",
                    as: "designation",
                },
            },
            { $unwind: "$designation" },
            { $match: matchStage },
            {
                $match: {
                    "designation.name": { $nin: ["director", "personal_assistant"] },
                },
            },
            { $project: { password: 0 } },
            {
                $sort: {
                    createdAt: -1
                }
            },
            { $addFields: { designationId: "$designation" } }
        ]);
        return employees;
    }
    catch (err) {
        throw new Error("Repo error (getEmployeeRepository): " + err.message);
    }
};
exports.getEmployeeRepository = getEmployeeRepository;
const filterCmsDataRepository = async (key, type, draft) => {
    try {
        key = key?.length > 0 ? key : "";
        const pipeline = [];
        if (!type)
            throw new Error("Please provide type!");
        const Model = functions_1.collectionMap?.[type];
        if (type === "blog")
            pipeline.push({
                $match: {
                    $or: [
                        { heading: { $regex: key, $options: "i" } },
                        { subheading: { $regex: key, $options: "i" } }
                    ]
                }
            });
        if (type === "testimonial")
            pipeline.push({
                $match: {
                    $or: [
                        { fullName: { $regex: key, $options: "i" } },
                        {
                            $expr: {
                                $regexMatch: {
                                    input: { $toString: "$phoneNumber" },
                                    regex: key,
                                    options: "i"
                                }
                            }
                        },
                        { text: { $regex: key, $options: "i" } },
                    ]
                }
            });
        if (type === "gallery")
            pipeline.push({
                $match: {
                    $or: [
                        { imageName: { $regex: key, $options: "i" } },
                        { theme: { $regex: key, $options: "i" } },
                    ]
                }
            });
        if (type === "job")
            pipeline.push({
                $match: {
                    $or: [
                        { jobTitle: { $regex: key, $options: "i" } },
                        { department: { $regex: key, $options: "i" } },
                        { jobKey: { $regex: key, $options: "i" } },
                    ]
                }
            });
        if (draft !== undefined) {
            pipeline.push({ $match: { draft } });
        }
        const data = Model.aggregate([
            ...pipeline,
            {
                $limit: 20
            }
        ]);
        return data;
    }
    catch (err) {
        throw new Error("Repo  error (get filtered cms data): " + err.message);
    }
};
exports.filterCmsDataRepository = filterCmsDataRepository;

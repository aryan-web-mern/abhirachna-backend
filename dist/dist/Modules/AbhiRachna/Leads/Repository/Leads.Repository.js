"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLastDiscountReqRepo = exports.approveDiscountReqManuallyRepo = exports.approvedDiscountReqRepo = exports.addDiscountRepo = exports.createDiscountRequestRepo = exports.removeCollaboratorsRepo = exports.createLeadIssueRepository = exports.getLeadLogsCountRepository = exports.getFilteredLeadsRepo = exports.getupdatedLeadByIdRepo = exports.getTop3LeadMembersRepo = exports.restoreLeadRepository = exports.addCollaboratorsRepo = exports.approvedDesignByDesignerRepository = exports.getLeadStatsRepo = exports.getLeadByIdRepo = exports.getAllLeadMemberRepo = exports.getAllUserLeadRepo = exports.getAllLeadRepoByStatus = exports.assignLeadRepository = exports.updateEstimateRepository = exports.updateAltDetailsRepository = exports.updateReferenceDetailsRepository = exports.updateLeadRepository = exports.createLeadRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Leads_Modals_1 = require("../Modals/Leads.Modals");
const TalkingLead_Modals_1 = require("../../TalkingLead/Modals/TalkingLead.Modals");
const moment_1 = __importDefault(require("moment"));
const producer_1 = require("../../../../RabbitMq/producer");
const helpers_1 = require("../helpers");
const Employees_Modals_1 = require("../../Auth/Modals/Employees.Modals");
const createLeadRepository = async (data) => {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { name, mobile, email, address, description, assignedTo, assignedBy, status, leadtype, createdBy, estimateDone, referenceType, referenceBy, refereeName, refrenceNumber, alternativeDetails, } = data;
        // Step 1: Create Lead using `.save()` to trigger pre('save') middleware
        const lead = new Leads_Modals_1.LeadModel({
            name,
            mobile,
            email,
            address,
            description,
            assignedTo,
            assignedBy,
            status,
            leadtype,
            createdBy,
            estimateDone,
            updatedBy: createdBy,
        });
        await lead.save({ session });
        // Step 2: Reference Details (Optional)
        if (referenceType) {
            await Leads_Modals_1.ReferenceDetailsModel.create([
                {
                    leadId: lead._id,
                    referenceType,
                    referenceBy: referenceType === "yes" ? referenceBy : undefined,
                    refrenceNumber,
                    refereeName,
                },
            ], { session });
        }
        // Step 3: Alternative Detail (Optional)
        if (alternativeDetails) {
            await Leads_Modals_1.LeadAlternativeDetailsModel.create([
                {
                    leadId: lead._id,
                    ...alternativeDetails,
                },
            ], { session });
        }
        await Leads_Modals_1.LeadUpdateLogsModel.create([{ leadId: lead._id, updated_from: "", updated_to: "new" }], { session });
        // Step 4: Commit transaction
        await session.commitTransaction();
        session.endSession();
        if (lead) {
            console.log("lead id in repo file **********", lead._id, "send to rabbit mq");
            await (0, producer_1.sendToQueueCreateFolder)(lead._id, createdBy);
        }
        return lead;
    }
    catch (error) {
        // Rollback transaction
        await session.abortTransaction();
        session.endSession();
        throw new Error("Error during creating lead in repository layer: " +
            error.message);
    }
};
exports.createLeadRepository = createLeadRepository;
const updateLeadRepository = async (leadId, updates, userId) => {
    const lead = await Leads_Modals_1.LeadModel.findById(leadId);
    if (!lead) {
        throw new Error("Lead not found");
    }
    Object.assign(lead, updates);
    lead.updatedBy = new mongoose_1.default.Types.ObjectId(userId);
    return await lead.save();
};
exports.updateLeadRepository = updateLeadRepository;
const updateReferenceDetailsRepository = async (leadId, referenceType, referenceBy, refereeName, refrenceNumber) => {
    try {
        if (referenceType === "yes") {
            await Leads_Modals_1.ReferenceDetailsModel.findOneAndUpdate({ leadId }, { referenceType, referenceBy, refereeName, refrenceNumber }, { upsert: true, new: true });
        }
        else {
            await Leads_Modals_1.ReferenceDetailsModel.findOneAndUpdate({ leadId }, { referenceType, referenceBy: "", refereeName: "", refrenceNumber: "" }, { upsert: true, new: true });
        }
    }
    catch (error) {
        throw new Error("Error during updating lead referemce repository layer: " +
            error.message);
    }
};
exports.updateReferenceDetailsRepository = updateReferenceDetailsRepository;
const updateAltDetailsRepository = async (leadId, altDetails) => {
    try {
        await Leads_Modals_1.LeadAlternativeDetailsModel.findOneAndUpdate({ leadId }, { ...altDetails, leadId }, { upsert: true, new: true });
    }
    catch (error) {
        throw new Error("Error during updating lead alternative details repository layer: " +
            error.message);
    }
};
exports.updateAltDetailsRepository = updateAltDetailsRepository;
const updateEstimateRepository = async (leadId, estimateDone, userId) => {
    try {
        const lead = await Leads_Modals_1.LeadModel.findById(leadId).lean();
        if (!lead) {
            throw new Error("Lead not found");
        }
        if (lead.estimateDone === true && estimateDone === true) {
            throw new Error("Estimate for this lead is already in true state");
        }
        const updatedLead = await Leads_Modals_1.LeadModel.findByIdAndUpdate(leadId, { estimateDone, updatedBy: userId }, { new: true });
        if (!updatedLead)
            throw new Error("Lead not found");
        return updatedLead;
    }
    catch (error) {
        throw new Error("Error during update estimate repository layer: " +
            error.message);
    }
};
exports.updateEstimateRepository = updateEstimateRepository;
const assignLeadRepository = async (leadId, assignedTo, assignedBy) => {
    try {
        const lead = await Leads_Modals_1.LeadModel.findById(leadId);
        if (!lead)
            throw new Error("Lead not found");
        if (lead.status.toLowerCase() !== "new") {
            throw new Error("Only new leads can be assigned");
        }
        lead.assignedTo = assignedTo;
        lead.assignedBy = assignedBy;
        lead.updatedBy = new mongoose_1.default.Types.ObjectId(assignedBy);
        lead.status = "assigned";
        await lead.save();
        return lead;
    }
    catch (error) {
        console.log(error);
        throw new Error("Error during update estimate repository layer: " +
            error.message);
    }
};
exports.assignLeadRepository = assignLeadRepository;
const getAllLeadRepoByStatus = async (userDesignation, key, page = 1, limit = 10, userId, filterIds, approved) => {
    const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
    let initPipeline = [];
    let filterCond = [];
    let statusCondition;
    statusCondition = (0, helpers_1.setStatusCondLead)(userDesignation, key);
    if (filterIds && filterIds?.length > 0) {
        const filterObjIds = filterIds.map((i) => new mongoose_1.default.Types.ObjectId(i));
        //  set pipeline for filter selected for multiple employees
        if (userDesignation === "director") {
            filterCond.push({
                $expr: {
                    $eq: [
                        {
                            $size: {
                                $filter: {
                                    input: filterObjIds,
                                    as: "id",
                                    cond: {
                                        $or: [
                                            { $eq: ["$$id", "$assignedTo"] },
                                            { $in: ["$$id", "$collabMembers"] },
                                        ],
                                    },
                                },
                            },
                        },
                        filterObjIds.length,
                    ],
                },
            });
        }
        else {
            filterCond.push({
                $and: [
                    { assignedTo: userObjectId },
                    { collabMembers: { $all: filterObjIds } },
                ],
            }, {
                $and: [
                    { collabMembers: userObjectId },
                    { collabMembers: { $all: filterObjIds } },
                ],
            });
        }
    }
    if (filterIds && filterIds?.length > 0) {
        initPipeline.push({
            $lookup: {
                from: "collaborations",
                localField: "_id",
                foreignField: "leadId",
                as: "collabs",
            },
        }, {
            $addFields: {
                collabMembers: {
                    $map: {
                        input: "$collabs",
                        as: "c",
                        in: "$$c.memberId",
                    },
                },
            },
        }, {
            $match: {
                $or: filterCond,
                ...(statusCondition ? { status: statusCondition } : {}),
            },
        }, {
            $project: {
                collabs: 0,
            },
        });
    }
    if (!filterIds?.length) {
        if (userDesignation === "director") {
            console.log("directorrr ***********", userDesignation);
            initPipeline = [
                ...(statusCondition ? [{ $match: { status: statusCondition } }] : []),
            ];
        }
        else {
            initPipeline.push({
                $match: { assignedTo: userObjectId, status: key },
            }, {
                $unionWith: {
                    coll: "collaborations",
                    pipeline: [
                        {
                            $match: {
                                memberId: userObjectId,
                            },
                        },
                        {
                            $lookup: {
                                from: "leads",
                                localField: "leadId",
                                foreignField: "_id",
                                pipeline: [
                                    ...(statusCondition
                                        ? [{ $match: { status: statusCondition } }]
                                        : []),
                                    // {
                                    //   $project: {
                                    //     _id: 0,
                                    //     memberId: 1
                                    //   }
                                    // }
                                ],
                                as: "leadDetails",
                            },
                        },
                        { $unwind: "$leadDetails" },
                        {
                            $replaceRoot: { newRoot: "$leadDetails" },
                        },
                    ],
                },
            });
        }
    }
    try {
        const skip = (page - 1) * limit;
        const leadData = await Leads_Modals_1.LeadModel.aggregate([
            ...initPipeline,
            {
                $lookup: {
                    from: "users",
                    localField: "assignedTo",
                    foreignField: "_id",
                    as: "assignedUserRaw",
                },
            },
            {
                $addFields: {
                    assignedUser: {
                        $arrayElemAt: [
                            {
                                $map: {
                                    input: "$assignedUserRaw",
                                    as: "user",
                                    in: {
                                        userId: "$$user._id",
                                        fullName: "$$user.fullName",
                                        profileImage: "$$user.profileImage",
                                    },
                                },
                            },
                            0,
                        ],
                    },
                },
            },
            {
                $project: {
                    assignedUserRaw: 0,
                },
            },
            {
                $lookup: {
                    from: "collaborations",
                    localField: "_id",
                    foreignField: "leadId",
                    pipeline: [
                        {
                            $project: {
                                _id: 0,
                                memberId: 1,
                            },
                        },
                    ],
                    as: "collaborators",
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "collaborators.memberId",
                    foreignField: "_id",
                    as: "collabUsersRaw",
                },
            },
            {
                $addFields: {
                    collabUsersDetail: {
                        $map: {
                            input: "$collabUsersRaw",
                            as: "user",
                            in: {
                                userId: "$$user._id",
                                fullName: "$$user.fullName",
                                profileImage: "$$user.profileImage",
                                employeeId: "$$user.employeeId",
                            },
                        },
                    },
                },
            },
            {
                $project: {
                    assignedUserRaw: 0,
                    collabUsersRaw: 0,
                    collaborators: 0,
                },
            },
            {
                $lookup: {
                    from: "leadbasicdetails",
                    let: { leadId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [{ $eq: ["$leadId", "$$leadId"] }],
                                },
                            },
                        },
                        {
                            $project: {
                                _id: 0,
                                tokenReceived: 1,
                                approvedTokenBydirector: 1,
                                approvedDesignByDesigner: 1,
                                approvedBySurveyor: 1,
                                negoApproved: 1,
                                discount: 1,
                                discountType: 1,
                                totalDiscount: 1,
                            },
                        },
                    ],
                    as: "basicDetails",
                },
            },
            {
                $unwind: {
                    path: "$basicDetails",
                    preserveNullAndEmptyArrays: true,
                },
            },
            ...(userDesignation === "designer"
                ? approved
                    ? [
                        {
                            $match: {
                                "basicDetails.approvedDesignByDesigner": true,
                            },
                        },
                    ]
                    : [
                        {
                            $match: {
                                $or: [
                                    { "basicDetails.approvedDesignByDesigner": false },
                                    {
                                        "basicDetails.approvedDesignByDesigner": {
                                            $exists: false,
                                        },
                                    },
                                ],
                            },
                        },
                    ]
                : []),
            {
                $lookup: {
                    from: "estimates",
                    localField: "_id",
                    foreignField: "leadId",
                    as: "estimates",
                },
            },
            {
                $addFields: {
                    minEstimate: { $min: "$estimates.minEstimate" },
                    maxEstimate: { $max: "$estimates.maxEstimate" },
                },
            },
            {
                $project: {
                    estimates: 0,
                },
            },
            {
                $group: {
                    _id: "$_id",
                    lead: { $first: "$$ROOT" },
                },
            },
            {
                $replaceRoot: { newRoot: "$lead" },
            },
            {
                $project: {
                    assignedBy: 0,
                    createdBy: 0,
                    collabMembers: 0,
                },
            },
            {
                $addFields: {
                    sortDate: {
                        $ifNull: ["$updatedAt", "$createdAt"],
                    },
                },
            },
            {
                $sort: {
                    sortDate: -1,
                },
            },
            {
                $facet: {
                    data: [{ $skip: skip }, { $limit: limit }],
                    totalCount: [{ $count: "count" }],
                },
            },
            {
                $addFields: {
                    totalCount: {
                        $cond: [
                            { $gt: [{ $size: "$totalCount" }, 0] },
                            { $arrayElemAt: ["$totalCount.count", 0] },
                            0,
                        ],
                    },
                },
            },
            {
                $project: {
                    data: 1,
                    totalCount: 1,
                },
            },
        ]);
        return leadData;
    }
    catch (error) {
        console.log(error);
        throw "Error During Getting Lead Data Repo Error ";
    }
};
exports.getAllLeadRepoByStatus = getAllLeadRepoByStatus;
const getAllUserLeadRepo = async (page = 1, limit = 10, userId) => {
    try {
        const skip = (page - 1) * limit;
        const leadData = await Leads_Modals_1.LeadModel.aggregate([
            {
                $match: { createdBy: new mongoose_1.default.Types.ObjectId(userId) },
            },
            {
                $lookup: {
                    from: "estimates", //  this should be the exact Mongo collection name
                    localField: "_id",
                    foreignField: "leadId",
                    as: "estimates",
                },
            },
            {
                $addFields: {
                    minEstimate: { $min: "$estimates.minEstimate" },
                    maxEstimate: { $max: "$estimates.maxEstimate" },
                },
            },
            {
                $project: {
                    estimates: 0, //  hide full estimates array if not needed
                },
            },
            {
                $skip: skip,
            },
            {
                $limit: limit,
            },
        ]);
        console.log(leadData, "check lead data>>>");
        return leadData;
    }
    catch (error) {
        throw "Error During Getting Lead Data Repo Error ";
    }
};
exports.getAllUserLeadRepo = getAllUserLeadRepo;
const getAllLeadMemberRepo = async (leadId) => {
    try {
        const leadmembers = await TalkingLead_Modals_1.CollaborationModel.find({
            leadId: leadId,
        }).select("_id");
        return leadmembers;
    }
    catch (error) {
        throw "Error During Getting Lead Team Member";
    }
};
exports.getAllLeadMemberRepo = getAllLeadMemberRepo;
const getLeadByIdRepo = async (leadId, userId) => {
    try {
        const leadData = await Leads_Modals_1.LeadModel.aggregate([
            {
                $match: {
                    _id: new mongoose_1.default.Types.ObjectId(leadId),
                },
            },
            {
                $lookup: {
                    from: "collaborations",
                    let: { leadId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$leadId", "$$leadId"] },
                            },
                        },
                        {
                            $lookup: {
                                from: "users",
                                localField: "memberId",
                                foreignField: "_id",
                                as: "memberDetails",
                            },
                        },
                        {
                            $unwind: "$memberDetails",
                        },
                        {
                            $project: {
                                _id: 1, // collaboration _id
                                memberId: {
                                    _id: "$memberDetails._id",
                                    fullName: "$memberDetails.fullName",
                                    email: "$memberDetails.email",
                                    phoneNumber: "$memberDetails.phoneNumber",
                                    role: "$memberDetails.role",
                                    employeeId: "$memberDetails.employeeId",
                                    profileImage: "$memberDetails.profileImage",
                                },
                            },
                        },
                    ],
                    as: "collabs",
                },
            },
            // {
            //   $addFields: {
            //     collabMembers: {
            //       $map: {
            //         input: "$collabs",
            //         as: "c",
            //         in: "$$c.memberId",
            //       },
            //     },
            //   },
            // },
            // {
            //   $project: {
            //     collabs: "$collabs",
            //   },
            // },
            {
                $lookup: {
                    from: "estimates",
                    localField: "_id",
                    foreignField: "leadId",
                    as: "estimate",
                },
            },
            {
                $unwind: {
                    path: "$estimate",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "designoptions",
                    let: { selectedOptions: "$estimate.selectedDesignOptions" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $cond: [
                                        {
                                            $gt: [
                                                { $size: { $ifNull: ["$$selectedOptions", []] } },
                                                0,
                                            ],
                                        },
                                        { $in: ["$_id", "$$selectedOptions"] },
                                        false,
                                    ],
                                },
                            },
                        },
                        {
                            $project: {
                                _id: 1,
                                category: 1,
                                label: 1,
                                pricePerSqft: 1,
                                details: 1,
                            },
                        },
                    ],
                    as: "designOptions",
                },
            },
            {
                $lookup: {
                    from: "referencedetails",
                    localField: "_id",
                    foreignField: "leadId",
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                leadId: 1,
                                referenceType: 1,
                                referenceBy: 1,
                                refrenceNumber: 1,
                                refereeName: 1,
                            },
                        },
                    ],
                    as: "referenceDetails",
                },
            },
            {
                $lookup: {
                    from: "leadalternativedetails",
                    localField: "_id",
                    foreignField: "leadId",
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                leadId: 1,
                                name: 1,
                                number: 1,
                                relationship: 1,
                                addressType: 1,
                                createdAt: 1,
                                optionalAddress: 1,
                            },
                        },
                    ],
                    as: "alternativeContactDetails",
                },
            },
            {
                $lookup: {
                    from: "leadbasicdetails",
                    localField: "_id",
                    foreignField: "leadId",
                    as: "leadBasicDetails",
                },
            },
            {
                $project: {
                    _id: 1,
                    leadDetails: {
                        name: "$name",
                        mobile: "$mobile",
                        email: "$email",
                        address: "$address",
                        status: "$status",
                        leadtype: "$leadtype",
                        createdBy: "$createdBy",
                        description: "$description",
                        createdAt: "$createdAt",
                        haveIssue: "$haveIssue",
                    },
                    approvedBySurveyor: "$leadBasicDetails.approvedBySurveyor",
                    Quatation: "$leadBasicDetails.Quatation",
                    discountBysalesman: "$leadBasicDetails.discountBysalesman",
                    salesmanDiscount: "$leadBasicDetails.salesmanDiscount",
                    salesmanPendingDiscount: "$leadBasicDetails.salesmanPendingDiscount",
                    amountAfterDiscount: "$leadBasicDetails.amountAfterDiscount",
                    addDiscountByDirector: "$leadBasicDetails.addDiscountByDirector",
                    discountByDirector: "$leadBasicDetails.discountByDirector",
                    siteInformation: "$estimate.AreaDetails",
                    layoutType: "$estimate.layoutType",
                    designOptions: { $ifNull: ["$designOptions", []] },
                    referenceDetails: { $ifNull: ["$referenceDetails", []] },
                    minEstimate: "$estimate.minEstimate",
                    maxEstimate: "$estimate.maxEstimate",
                    alternativeContactDetails: {
                        $ifNull: ["$alternativeContactDetails", []],
                    },
                    squareFeetRange: "$estimate.squareFeetRange",
                    estimateId: "$estimate._id",
                    collabs: "$collabs",
                },
            },
        ]);
        return leadData;
    }
    catch (error) {
        console.log(error, "check for error");
        throw "Error During Getting Lead Details Repo Layer";
    }
};
exports.getLeadByIdRepo = getLeadByIdRepo;
const getLeadStatsRepo = async (userDesignation, userId, chart, filter) => {
    try {
        let pipeline = [];
        if (userDesignation === "director") {
            pipeline = [];
        }
        else {
            pipeline.push({
                $match: { assignedTo: userId },
            }, {
                $project: {
                    _id: 1,
                    status: 1,
                    createdAt: 1,
                },
            }, {
                $unionWith: {
                    coll: "collaborations",
                    pipeline: [
                        {
                            $match: { memberId: userId },
                        },
                        {
                            $lookup: {
                                from: "leads",
                                localField: "leadId",
                                foreignField: "_id",
                                as: "lead",
                            },
                        },
                        { $unwind: "$lead" },
                        {
                            $project: {
                                _id: "$lead._id",
                                status: "$lead.status",
                                createdAt: "$lead.createdAt",
                            },
                        },
                    ],
                },
            });
        }
        pipeline.push({
            $group: {
                _id: "$_id",
                status: { $first: "$status" },
                createdAt: { $first: "$createdAt" },
            },
        });
        if (chart === "piechart") {
            let fromDate = null;
            let toDate = null;
            let matchCondition = {};
            if (filter === "weekly") {
                fromDate = (0, moment_1.default)().subtract(6, "days").startOf("day").toDate();
                toDate = (0, moment_1.default)().endOf("day").toDate();
                matchCondition = {
                    $and: [
                        { $eq: ["$leadId", "$$leadId"] },
                        { $gte: ["$createdAt", fromDate] },
                        { $lte: ["$createdAt", toDate] },
                    ],
                };
            }
            if (filter === "monthly") {
                fromDate = (0, moment_1.default)().startOf("month").toDate();
                toDate = (0, moment_1.default)().endOf("month").toDate();
                matchCondition = {
                    $and: [
                        { $eq: ["$leadId", "$$leadId"] },
                        { $gte: ["$createdAt", fromDate] },
                        { $lte: ["$createdAt", toDate] },
                    ],
                };
            }
            if (filter === "yearly") {
                const currentYear = (0, moment_1.default)().year();
                matchCondition = {
                    $and: [
                        { $eq: ["$leadId", "$$leadId"] },
                        { $eq: [{ $year: "$createdAt" }, currentYear] },
                    ],
                };
            }
            if (userDesignation === "designer") {
                pipeline.push({
                    $lookup: {
                        from: "leadupdatelogs",
                        let: { leadId: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            ...matchCondition.$and,
                                            {
                                                $or: [
                                                    "$updated_to",
                                                    ["designing", "approved_design"],
                                                ],
                                            },
                                        ],
                                    },
                                },
                            },
                        ],
                        as: "designerLogs",
                    },
                }, {
                    $unwind: {
                        path: "$designerLogs",
                        preserveNullAndEmptyArrays: true,
                    },
                }, {
                    $group: {
                        _id: "$designerLogs.updated_to",
                        totalCount: { $sum: 1 },
                    },
                }, {
                    $project: {
                        _id: 0,
                        status: {
                            $ifNull: ["$_id", "no_status"],
                        },
                        totalCount: 1,
                    },
                });
                pipeline.push({
                    $group: {
                        _id: null,
                        logs: { $push: { status: "$status", totalCount: "$totalCount" } },
                    },
                });
                pipeline.push({
                    $project: {
                        logs: {
                            $map: {
                                input: ["designing", "approved_design"],
                                as: "st",
                                in: {
                                    status: {
                                        $cond: [
                                            { $eq: ["$$st", "approved_design"] },
                                            "approved",
                                            "$$st",
                                        ],
                                    },
                                    totalCount: {
                                        $ifNull: [
                                            {
                                                $first: {
                                                    $map: {
                                                        input: {
                                                            $filter: {
                                                                input: "$logs",
                                                                as: "log",
                                                                cond: { $eq: ["$$log.status", "$$st"] },
                                                            },
                                                        },
                                                        as: "filtered",
                                                        in: "$$filtered.totalCount",
                                                    },
                                                },
                                            },
                                            0,
                                        ],
                                    },
                                },
                            },
                        },
                    },
                });
                pipeline.push({ $unwind: "$logs" });
                pipeline.push({ $replaceRoot: { newRoot: "$logs" } });
            }
            else {
                pipeline.push({
                    $lookup: {
                        from: "leadupdatelogs",
                        let: { leadId: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: matchCondition,
                                },
                            },
                        ],
                        as: "updateLogs",
                    },
                }, {
                    $match: {
                        "updateLogs.0": { $exists: true },
                    },
                }, { $unwind: "$updateLogs" }, {
                    $group: {
                        _id: "$updateLogs.updated_to",
                        totalCount: { $sum: 1 },
                    },
                }, {
                    $project: {
                        _id: 0,
                        status: "$_id",
                        totalCount: 1,
                    },
                });
                if (userDesignation !== "director") {
                    pipeline.push({
                        $match: {
                            status: { $ne: "new" },
                        },
                    });
                }
            }
        }
        // if (chart === "barchart") {
        //   if (filter === "weekly") {
        //     const endOfWeek = moment().endOf("day").toDate();
        //     const startOfWeek = moment()
        //       .subtract(6, "days")
        //       .startOf("day")
        //       .toDate();
        //     pipeline.push(
        //       {
        //         $lookup: {
        //           from: "leadupdatelogs",
        //           let: { leadId: "$_id" },
        //           pipeline: [
        //             {
        //               $match: {
        //                 $expr: {
        //                   $and: [
        //                     { $eq: ["$leadId", "$$leadId"] },
        //                     { $gte: ["$createdAt", startOfWeek] },
        //                     { $lt: ["$createdAt", endOfWeek] },
        //                   ],
        //                 },
        //               },
        //             },
        //           ],
        //           as: "updateLogs",
        //         },
        //       },
        //       {
        //         $match: {
        //           "updateLogs.0": { $exists: true },
        //         },
        //       },
        //       { $unwind: "$updateLogs" },
        //       {
        //         $project: {
        //           dayOfWeek: { $isoDayOfWeek: "$updateLogs.createdAt" },
        //           status: 1,
        //           updatedTo: "$updateLogs.updated_to",
        //         },
        //       },
        //       {
        //         $group: {
        //           _id: "$dayOfWeek",
        //           newLead: {
        //             $sum: {
        //               $cond: [{ $eq: ["$updatedTo", "assigned"] }, 1, 0],
        //             },
        //           },
        //           closedLead: {
        //             $sum: {
        //               $cond: [{ $eq: ["$updatedTo", "closed"] }, 1, 0],
        //             },
        //           },
        //           designLead: {
        //             $sum: {
        //               $cond: [{ $eq: ["$updatedTo", "designing"] }, 1, 0],
        //             },
        //           },
        //         },
        //       },
        //       {
        //         $unionWith: {
        //           coll: "leads",
        //           pipeline: [
        //             {
        //               $facet: {
        //                 days: [
        //                   {
        //                     $project: {
        //                       _id: 0,
        //                       days: [
        //                         {
        //                           _id: 1,
        //                           newLead: 0,
        //                           closedLead: 0,
        //                           designLead: 0,
        //                         },
        //                         {
        //                           _id: 2,
        //                           newLead: 0,
        //                           closedLead: 0,
        //                           designLead: 0,
        //                         },
        //                         {
        //                           _id: 3,
        //                           newLead: 0,
        //                           closedLead: 0,
        //                           designLead: 0,
        //                         },
        //                         {
        //                           _id: 4,
        //                           newLead: 0,
        //                           closedLead: 0,
        //                           designLead: 0,
        //                         },
        //                         {
        //                           _id: 5,
        //                           newLead: 0,
        //                           closedLead: 0,
        //                           designLead: 0,
        //                         },
        //                         {
        //                           _id: 6,
        //                           newLead: 0,
        //                           closedLead: 0,
        //                           designLead: 0,
        //                         },
        //                         {
        //                           _id: 7,
        //                           newLead: 0,
        //                           closedLead: 0,
        //                           designLead: 0,
        //                         },
        //                       ],
        //                     },
        //                   },
        //                   { $unwind: "$days" },
        //                   { $replaceRoot: { newRoot: "$days" } },
        //                 ],
        //               },
        //             },
        //             { $unwind: "$days" },
        //             { $replaceRoot: { newRoot: "$days" } },
        //           ],
        //         },
        //       },
        //       {
        //         $group: {
        //           _id: "$_id",
        //           newLead: { $sum: "$newLead" },
        //           closedLead: { $sum: "$closedLead" },
        //           designLead: { $sum: "$designLead" },
        //         },
        //       },
        //       {
        //         $project: {
        //           _id: 0,
        //           id: "$_id",
        //           title: {
        //             $arrayElemAt: [
        //               ["", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        //               "$_id",
        //             ],
        //           },
        //           newLead: 1,
        //           closedLead: 1,
        //           designLead: 1,
        //           totalLeads: { $add: ["$newLead", "$closedLead"] },
        //         },
        //       },
        //       {
        //         $sort: { id: 1 },
        //       }
        //     );
        //   }
        //   if (filter === "monthly") {
        //     const currentYear = moment().year();
        //     pipeline.push(
        //       {
        //         $lookup: {
        //           from: "leadupdatelogs",
        //           let: { leadId: "$_id" },
        //           pipeline: [
        //             {
        //               $match: {
        //                 $expr: {
        //                   $and: [
        //                     { $eq: ["$leadId", "$$leadId"] },
        //                     { $eq: [{ $year: "$createdAt" }, currentYear] },
        //                   ],
        //                 },
        //               },
        //             },
        //           ],
        //           as: "updateLogs",
        //         },
        //       },
        //       {
        //         $match: {
        //           "updateLogs.0": { $exists: true },
        //         },
        //       },
        //       { $unwind: "$updateLogs" },
        //       {
        //         $project: {
        //           month: { $month: "$updateLogs.createdAt" },
        //           status: 1,
        //           updatedTo: "$updateLogs.updated_to",
        //         },
        //       },
        //       {
        //         $group: {
        //           _id: "$month",
        //           newLead: {
        //             $sum: {
        //               $cond: [{ $eq: ["$updatedTo", "assigned"] }, 1, 0],
        //             },
        //           },
        //           closedLead: {
        //             $sum: {
        //               $cond: [{ $eq: ["$updatedTo", "closed"] }, 1, 0],
        //             },
        //           },
        //           designLead: {
        //             $sum: {
        //               $cond: [{ $eq: ["$updatedTo", "designing"] }, 1, 0],
        //             },
        //           },
        //         },
        //       },
        //       {
        //         $unionWith: {
        //           coll: "leads",
        //           pipeline: [
        //             {
        //               $facet: {
        //                 months: [
        //                   {
        //                     $project: {
        //                       _id: 0,
        //                       months: [
        //                         {
        //                           _id: 1,
        //                           newLead: 0,
        //                           closedLead: 0,
        //                           designLead: 0,
        //                         },
        //                         {
        //                           _id: 2,
        //                           newLead: 0,
        //                           closedLead: 0,
        //                           designLead: 0,
        //                         },
        //                         {
        //                           _id: 3,
        //                           newLead: 0,
        //                           closedLead: 0,
        //                           designLead: 0,
        //                         },
        //                         {
        //                           _id: 4,
        //                           newLead: 0,
        //                           closedLead: 0,
        //                           designLead: 0,
        //                         },
        //                         {
        //                           _id: 5,
        //                           newLead: 0,
        //                           closedLead: 0,
        //                           designLead: 0,
        //                         },
        //                         {
        //                           _id: 6,
        //                           newLead: 0,
        //                           closedLead: 0,
        //                           designLead: 0,
        //                         },
        //                         {
        //                           _id: 7,
        //                           newLead: 0,
        //                           closedLead: 0,
        //                           designLead: 0,
        //                         },
        //                         {
        //                           _id: 8,
        //                           newLead: 0,
        //                           closedLead: 0,
        //                           designLead: 0,
        //                         },
        //                         {
        //                           _id: 9,
        //                           newLead: 0,
        //                           closedLead: 0,
        //                           designLead: 0,
        //                         },
        //                         {
        //                           _id: 10,
        //                           newLead: 0,
        //                           closedLead: 0,
        //                           designLead: 0,
        //                         },
        //                         {
        //                           _id: 11,
        //                           newLead: 0,
        //                           closedLead: 0,
        //                           designLead: 0,
        //                         },
        //                         {
        //                           _id: 12,
        //                           newLead: 0,
        //                           closedLead: 0,
        //                           designLead: 0,
        //                         },
        //                       ],
        //                     },
        //                   },
        //                   { $unwind: "$months" },
        //                   { $replaceRoot: { newRoot: "$months" } },
        //                 ],
        //               },
        //             },
        //             { $unwind: "$months" },
        //             { $replaceRoot: { newRoot: "$months" } },
        //           ],
        //         },
        //       },
        //       {
        //         $group: {
        //           _id: "$_id",
        //           newLead: { $sum: "$newLead" },
        //           closedLead: { $sum: "$closedLead" },
        //           designLead: { $sum: "$designLead" },
        //         },
        //       },
        //       {
        //         $project: {
        //           _id: 0,
        //           id: "$_id",
        //           title: {
        //             $arrayElemAt: [
        //               [
        //                 "",
        //                 "Jan",
        //                 "Feb",
        //                 "Mar",
        //                 "Apr",
        //                 "May",
        //                 "Jun",
        //                 "Jul",
        //                 "Aug",
        //                 "Sep",
        //                 "Oct",
        //                 "Nov",
        //                 "Dec",
        //               ],
        //               "$_id",
        //             ],
        //           },
        //           newLead: 1,
        //           closedLead: 1,
        //           designLead: 1,
        //           totalLeads: { $add: ["$newLead", "$closedLead"] },
        //         },
        //       },
        //       {
        //         $sort: { id: 1 },
        //       }
        //     );
        //   }
        //   if (filter === "yearly") {
        //     pipeline.push(
        //       {
        //         $lookup: {
        //           from: "leadupdatelogs",
        //           let: { leadId: "$_id" },
        //           pipeline: [
        //             {
        //               $match: {
        //                 $expr: {
        //                   $eq: ["$leadId", "$$leadId"],
        //                 },
        //               },
        //             },
        //           ],
        //           as: "updateLogs",
        //         },
        //       },
        //       {
        //         $match: {
        //           "updateLogs.0": { $exists: true },
        //         },
        //       },
        //       { $unwind: "$updateLogs" },
        //       {
        //         $project: {
        //           year: { $year: "$updateLogs.createdAt" },
        //           status: 1,
        //           updatedTo: "$updateLogs.updated_to",
        //         },
        //       },
        //       {
        //         $group: {
        //           _id: "$year",
        //           newLead: {
        //             $sum: {
        //               $cond: [{ $eq: ["$updatedTo", "assigned"] }, 1, 0],
        //             },
        //           },
        //           closedLead: {
        //             $sum: {
        //               $cond: [{ $in: ["$updatedTo", ["closed"]] }, 1, 0],
        //             },
        //           },
        //           designLead: {
        //             $sum: {
        //               $cond: [{ $in: ["$updatedTo", ["designing"]] }, 1, 0],
        //             },
        //           },
        //         },
        //       },
        //       {
        //         $project: {
        //           _id: 0,
        //           id: "$_id",
        //           title: { $toString: "$_id" },
        //           newLead: 1,
        //           closedLead: 1,
        //           designLead: 1,
        //           totalLeads: { $add: ["$newLead", "$closedLead"] },
        //         },
        //       },
        //       {
        //         $sort: { id: 1 },
        //       }
        //     );
        //   }
        // }
        if (chart === "barchart") {
            let roleConditions = {};
            if (userDesignation === "designer") {
                roleConditions = {
                    newCond: { $eq: ["$updatedTo", "designing"] },
                    closedCond: { $eq: ["$updatedTo", "approved_design"] },
                    designCond: false,
                };
            }
            else if (userDesignation === "salesman") {
                roleConditions = {
                    newCond: { $eq: ["$updatedTo", "assigned"] },
                    closedCond: { $eq: ["$updatedTo", "closed"] },
                    designCond: false,
                };
            }
            else if (userDesignation === "director") {
                roleConditions = {
                    newCond: { $eq: ["$updatedTo", "new"] },
                    closedCond: { $eq: ["$updatedTo", "closed"] },
                    designCond: false,
                };
            }
            if (filter === "weekly") {
                const endOfWeek = (0, moment_1.default)().endOf("day").toDate();
                const startOfWeek = (0, moment_1.default)()
                    .subtract(6, "days")
                    .startOf("day")
                    .toDate();
                pipeline.push({
                    $lookup: {
                        from: "leadupdatelogs",
                        let: { leadId: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$leadId", "$$leadId"] },
                                            { $gte: ["$createdAt", startOfWeek] },
                                            { $lt: ["$createdAt", endOfWeek] },
                                        ],
                                    },
                                },
                            },
                        ],
                        as: "updateLogs",
                    },
                }, { $match: { "updateLogs.0": { $exists: true } } }, { $unwind: "$updateLogs" }, {
                    $project: {
                        dayOfWeek: { $isoDayOfWeek: "$updateLogs.createdAt" },
                        updatedTo: "$updateLogs.updated_to",
                    },
                }, {
                    $group: {
                        _id: "$dayOfWeek",
                        newLead: { $sum: { $cond: [roleConditions.newCond, 1, 0] } },
                        closedLead: {
                            $sum: { $cond: [roleConditions.closedCond, 1, 0] },
                        },
                        designLead: roleConditions.designCond
                            ? { $sum: { $cond: [roleConditions.designCond, 1, 0] } }
                            : { $sum: 0 },
                    },
                }, {
                    $unionWith: {
                        coll: "leads",
                        pipeline: [
                            {
                                $facet: {
                                    days: [
                                        {
                                            $project: {
                                                _id: 0,
                                                days: [
                                                    {
                                                        _id: 1,
                                                        newLead: 0,
                                                        closedLead: 0,
                                                        designLead: 0,
                                                    },
                                                    {
                                                        _id: 2,
                                                        newLead: 0,
                                                        closedLead: 0,
                                                        designLead: 0,
                                                    },
                                                    {
                                                        _id: 3,
                                                        newLead: 0,
                                                        closedLead: 0,
                                                        designLead: 0,
                                                    },
                                                    {
                                                        _id: 4,
                                                        newLead: 0,
                                                        closedLead: 0,
                                                        designLead: 0,
                                                    },
                                                    {
                                                        _id: 5,
                                                        newLead: 0,
                                                        closedLead: 0,
                                                        designLead: 0,
                                                    },
                                                    {
                                                        _id: 6,
                                                        newLead: 0,
                                                        closedLead: 0,
                                                        designLead: 0,
                                                    },
                                                    {
                                                        _id: 7,
                                                        newLead: 0,
                                                        closedLead: 0,
                                                        designLead: 0,
                                                    },
                                                ],
                                            },
                                        },
                                        { $unwind: "$days" },
                                        { $replaceRoot: { newRoot: "$days" } },
                                    ],
                                },
                            },
                            { $unwind: "$days" },
                            { $replaceRoot: { newRoot: "$days" } },
                        ],
                    },
                }, {
                    $group: {
                        _id: "$_id",
                        newLead: { $sum: "$newLead" },
                        closedLead: { $sum: "$closedLead" },
                        designLead: { $sum: "$designLead" },
                    },
                }, {
                    $project: {
                        _id: 0,
                        id: "$_id",
                        title: {
                            $arrayElemAt: [
                                ["", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                                "$_id",
                            ],
                        },
                        newLead: 1,
                        closedLead: 1,
                        designLead: 1,
                        totalLeads: { $add: ["$newLead", "$closedLead", "$designLead"] },
                    },
                }, { $sort: { id: 1 } });
            }
            if (filter === "monthly") {
                const currentYear = (0, moment_1.default)().year();
                pipeline.push({
                    $lookup: {
                        from: "leadupdatelogs",
                        let: { leadId: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$leadId", "$$leadId"] },
                                            { $eq: [{ $year: "$createdAt" }, currentYear] },
                                        ],
                                    },
                                },
                            },
                        ],
                        as: "updateLogs",
                    },
                }, { $match: { "updateLogs.0": { $exists: true } } }, { $unwind: "$updateLogs" }, {
                    $project: {
                        month: { $month: "$updateLogs.createdAt" },
                        updatedTo: "$updateLogs.updated_to",
                    },
                }, {
                    $group: {
                        _id: "$month",
                        newLead: { $sum: { $cond: [roleConditions.newCond, 1, 0] } },
                        closedLead: {
                            $sum: { $cond: [roleConditions.closedCond, 1, 0] },
                        },
                        designLead: roleConditions.designCond
                            ? { $sum: { $cond: [roleConditions.designCond, 1, 0] } }
                            : { $sum: 0 },
                    },
                }, {
                    $unionWith: {
                        coll: "leads",
                        pipeline: [
                            {
                                $facet: {
                                    months: [
                                        {
                                            $project: {
                                                _id: 0,
                                                months: Array.from({ length: 12 }, (_, i) => ({
                                                    _id: i + 1,
                                                    newLead: 0,
                                                    closedLead: 0,
                                                    designLead: 0,
                                                })),
                                            },
                                        },
                                        { $unwind: "$months" },
                                        { $replaceRoot: { newRoot: "$months" } },
                                    ],
                                },
                            },
                            { $unwind: "$months" },
                            { $replaceRoot: { newRoot: "$months" } },
                        ],
                    },
                }, {
                    $group: {
                        _id: "$_id",
                        newLead: { $sum: "$newLead" },
                        closedLead: { $sum: "$closedLead" },
                        designLead: { $sum: "$designLead" },
                    },
                }, {
                    $project: {
                        _id: 0,
                        id: "$_id",
                        title: {
                            $arrayElemAt: [
                                [
                                    "",
                                    "Jan",
                                    "Feb",
                                    "Mar",
                                    "Apr",
                                    "May",
                                    "Jun",
                                    "Jul",
                                    "Aug",
                                    "Sep",
                                    "Oct",
                                    "Nov",
                                    "Dec",
                                ],
                                "$_id",
                            ],
                        },
                        newLead: 1,
                        closedLead: 1,
                        designLead: 1,
                        totalLeads: { $add: ["$newLead", "$closedLead", "$designLead"] },
                    },
                }, { $sort: { id: 1 } });
            }
            if (filter === "yearly") {
                pipeline.push({
                    $lookup: {
                        from: "leadupdatelogs",
                        let: { leadId: "$_id" },
                        pipeline: [
                            { $match: { $expr: { $eq: ["$leadId", "$$leadId"] } } },
                        ],
                        as: "updateLogs",
                    },
                }, { $match: { "updateLogs.0": { $exists: true } } }, { $unwind: "$updateLogs" }, {
                    $project: {
                        year: { $year: "$updateLogs.createdAt" },
                        updatedTo: "$updateLogs.updated_to",
                    },
                }, {
                    $group: {
                        _id: "$year",
                        newLead: { $sum: { $cond: [roleConditions.newCond, 1, 0] } },
                        closedLead: {
                            $sum: { $cond: [roleConditions.closedCond, 1, 0] },
                        },
                        designLead: roleConditions.designCond
                            ? { $sum: { $cond: [roleConditions.designCond, 1, 0] } }
                            : { $sum: 0 },
                    },
                }, {
                    $project: {
                        _id: 0,
                        id: "$_id",
                        title: { $toString: "$_id" },
                        newLead: 1,
                        closedLead: 1,
                        designLead: 1,
                        totalLeads: { $add: ["$newLead", "$closedLead", "$designLead"] },
                    },
                }, { $sort: { id: 1 } });
            }
        }
        const result = await Leads_Modals_1.LeadModel.aggregate(pipeline);
        return result;
    }
    catch (error) {
        console.log(error, "check for error");
        throw new Error("Error During Getting Lead Details Repo Layer");
    }
};
exports.getLeadStatsRepo = getLeadStatsRepo;
const approvedDesignByDesignerRepository = async (leadId, userId) => {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const leadbasicdetails = await Leads_Modals_1.LeadBasicDetailsModel.findOne({ leadId })
            .populate("leadId")
            .session(session);
        if (leadbasicdetails?.approvedDesignByDesigner) {
            throw new Error("Design already approved by designer");
        }
        const leadoriginal = await Leads_Modals_1.LeadModel.findById(leadId).session(session);
        if (!leadbasicdetails || !leadbasicdetails.leadId || !leadoriginal) {
            throw new Error("Lead or Lead Basic Details not found");
        }
        const lead = leadbasicdetails.leadId;
        if (lead.assignedDesigner?.toString() !== userId.toString()) {
            throw new Error("Only assigned designer can update the status");
        }
        leadbasicdetails.approvedDesignByDesigner = true;
        leadoriginal.updatedBy = new mongoose_1.default.Types.ObjectId(userId);
        await Leads_Modals_1.LeadUpdateLogsModel.create([
            {
                leadId,
                updated_from: "designing",
                updated_to: "approved_design",
                createdAt: new Date(),
            },
        ], { session });
        await leadbasicdetails.save({ session });
        await leadoriginal.save({ session });
        await session.commitTransaction();
    }
    catch (error) {
        await session.abortTransaction();
        throw new Error("Error during updating lead reference repository layer: " +
            error.message);
    }
    finally {
        session.endSession();
    }
};
exports.approvedDesignByDesignerRepository = approvedDesignByDesignerRepository;
const addCollaboratorsRepo = async (leadId, userIds, loggedInUserId) => {
    try {
        const existingCount = await TalkingLead_Modals_1.CollaborationModel.countDocuments({
            leadId: new mongoose_1.default.Types.ObjectId(leadId),
        });
        if (existingCount >= 10) {
            throw new Error("Maximum 10 collaborators allowed for this lead.");
        }
        const collaborators = userIds.map((userId) => ({
            leadId: new mongoose_1.default.Types.ObjectId(leadId),
            memberId: new mongoose_1.default.Types.ObjectId(userId),
            addedBy: new mongoose_1.default.Types.ObjectId(loggedInUserId),
        }));
        const existingMembers = await TalkingLead_Modals_1.CollaborationModel.find({
            leadId: new mongoose_1.default.Types.ObjectId(leadId),
            memberId: { $in: collaborators.map((c) => c.memberId) },
        }).select("memberId");
        const existingIds = new Set(existingMembers.map((m) => m.memberId.toString()));
        const newCollaborators = collaborators.filter((c) => !existingIds.has(c.memberId.toString()));
        if (existingCount + newCollaborators.length > 10) {
            throw new Error(`You can add only ${10 - existingCount} more collaborators.`);
        }
        return await TalkingLead_Modals_1.CollaborationModel.insertMany(newCollaborators);
    }
    catch (error) {
        throw error;
    }
};
exports.addCollaboratorsRepo = addCollaboratorsRepo;
const restoreLeadRepository = async (leadId, userId) => {
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const lead = (await Leads_Modals_1.LeadModel.findById(leadId).session(session));
        if (!lead) {
            throw new Error("Lead not found");
        }
        let skipCount = 1;
        let lastUpdateLog = await Leads_Modals_1.LeadUpdateLogsModel.findOne({ leadId: lead._id })
            .sort({ createdAt: -1 })
            .skip(skipCount)
            .session(session);
        if (lastUpdateLog?.updated_to === "approved_design") {
            skipCount += 1;
            lastUpdateLog = await Leads_Modals_1.LeadUpdateLogsModel.findOne({ leadId: lead._id })
                .sort({ createdAt: -1 })
                .skip(skipCount)
                .session(session);
        }
        if (lastUpdateLog) {
            lead.status = lastUpdateLog.updated_to;
            lead.updatedBy = new mongoose_1.default.Types.ObjectId(userId);
            await lead.save({ session });
        }
        await session.commitTransaction();
        session.endSession();
    }
    catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Error in updateLeadStatusFromLatestLog:", error);
        throw new Error("Failed to update lead status");
    }
};
exports.restoreLeadRepository = restoreLeadRepository;
const getTop3LeadMembersRepo = async (leadId, userId) => {
    try {
        const leadObjectId = new mongoose_1.default.Types.ObjectId(leadId);
        const collabs = await TalkingLead_Modals_1.CollaborationModel.find({ leadId: leadObjectId });
        const leadDoc = await Leads_Modals_1.LeadModel.findOne({ _id: leadObjectId });
        const assignedIds = Array.isArray(leadDoc?.assignedTo)
            ? leadDoc.assignedTo.map((id) => id.toString())
            : leadDoc?.assignedTo
                ? [leadDoc.assignedTo.toString()]
                : [];
        const collabIds = collabs.map((c) => c.memberId.toString());
        const allMemberIds = [...new Set([...assignedIds, ...collabIds])];
        // if (!allMemberIds.includes(userId.toString())) {
        //   throw new Error("You are not part of this lead");
        // }
        const members = await Employees_Modals_1.EmployeeModel.find({ _id: { $in: allMemberIds } }, { fullName: 1, profileImage: 1, phoneNumber: 1 })
            .sort({ createdAt: -1 })
            .limit(3)
            .lean();
        return members;
    }
    catch (error) {
        throw new Error(error.message || "Failed to fetch top 3 lead members");
    }
};
exports.getTop3LeadMembersRepo = getTop3LeadMembersRepo;
const getupdatedLeadByIdRepo = async (leadId, userId) => {
    try {
        const objectId = new mongoose_1.default.Types.ObjectId(leadId);
        const leadData = await Leads_Modals_1.LeadModel.aggregate([
            {
                $match: { _id: objectId }, // ✅ Single LeadId filter
            },
            {
                $lookup: {
                    from: "users",
                    localField: "assignedTo",
                    foreignField: "_id",
                    as: "assignedUserRaw",
                },
            },
            {
                $addFields: {
                    assignedUser: {
                        $arrayElemAt: [
                            {
                                $map: {
                                    input: "$assignedUserRaw",
                                    as: "user",
                                    in: {
                                        userId: "$$user._id",
                                        fullName: "$$user.fullName",
                                        profileImage: "$$user.profileImage",
                                    },
                                },
                            },
                            0,
                        ],
                    },
                },
            },
            { $project: { assignedUserRaw: 0 } },
            {
                $lookup: {
                    from: "collaborations",
                    localField: "_id",
                    foreignField: "leadId",
                    pipeline: [{ $project: { _id: 0, memberId: 1 } }],
                    as: "collaborators",
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "collaborators.memberId",
                    foreignField: "_id",
                    as: "collabUsersRaw",
                },
            },
            {
                $addFields: {
                    collabUsersDetail: {
                        $map: {
                            input: "$collabUsersRaw",
                            as: "user",
                            in: {
                                userId: "$$user._id",
                                fullName: "$$user.fullName",
                                profileImage: "$$user.profileImage",
                            },
                        },
                    },
                },
            },
            { $project: { assignedUserRaw: 0, collabUsersRaw: 0, collaborators: 0 } },
            {
                $lookup: {
                    from: "leadbasicdetails",
                    let: { leadId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $and: [{ $eq: ["$leadId", "$$leadId"] }] },
                            },
                        },
                        {
                            $project: {
                                _id: 0,
                                tokenReceived: 1,
                                approvedTokenBydirector: 1,
                                approvedDesignByDesigner: 1,
                                approvedBySurveyor: 1,
                                negoApproved: 1,
                            },
                        },
                    ],
                    as: "basicDetails",
                },
            },
            {
                $unwind: { path: "$basicDetails", preserveNullAndEmptyArrays: true },
            },
            {
                $lookup: {
                    from: "estimates",
                    localField: "_id",
                    foreignField: "leadId",
                    as: "estimates",
                },
            },
            {
                $addFields: {
                    minEstimate: { $min: "$estimates.minEstimate" },
                    maxEstimate: { $max: "$estimates.maxEstimate" },
                },
            },
            { $project: { estimates: 0 } },
            {
                $addFields: {
                    sortDate: { $ifNull: ["$updatedAt", "$createdAt"] },
                },
            },
            {
                $project: {
                    assignedBy: 0,
                    createdBy: 0,
                    collabMembers: 0,
                },
            },
        ]);
        return leadData.length > 0 ? leadData[0] : null;
    }
    catch (error) {
        console.error("❌ Error in getupdatedLeadByIdRepo:", error);
        throw new Error("Failed to fetch updated lead details");
    }
};
exports.getupdatedLeadByIdRepo = getupdatedLeadByIdRepo;
const getFilteredLeadsRepo = async (key, type, userId, userDesignation) => {
    try {
        const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
        let initPipeline = [];
        let pipeline = [];
        // it fetches all privelege leads --- based on privelege
        if (userDesignation !== "director") {
            initPipeline.push({
                $match: { assignedTo: userObjectId },
            }, {
                $unionWith: {
                    coll: "collaborations",
                    pipeline: [
                        {
                            $match: {
                                memberId: userObjectId,
                            },
                        },
                        {
                            $lookup: {
                                from: "leads",
                                localField: "leadId",
                                foreignField: "_id",
                                as: "leadDetails",
                            },
                        },
                        { $unwind: "$leadDetails" },
                        {
                            $replaceRoot: { newRoot: "$leadDetails" },
                        },
                    ],
                },
            });
        }
        if (!type && key?.length > 0) {
            pipeline.push({
                $match: {
                    $or: [
                        { name: { $regex: key, $options: "i" } },
                        {
                            $expr: {
                                $regexMatch: {
                                    input: { $toString: "$mobile" },
                                    regex: key,
                                    options: "i",
                                },
                            },
                        },
                    ],
                },
            });
        }
        if (type?.toLowerCase() === "lead") {
            if (key)
                pipeline.push({
                    $match: {
                        $or: [
                            { name: { $regex: key, $options: "i" } },
                            {
                                $expr: {
                                    $regexMatch: {
                                        input: { $toString: "$mobile" },
                                        regex: key,
                                        options: "i",
                                    },
                                },
                            },
                        ],
                    },
                });
        }
        if (type?.toLowerCase() === "team") {
            pipeline.push({
                $match: {
                    collabUsersDetail: { $ne: [] },
                    ...(key?.trim() && {
                        "collabUsersDetail.fullName": { $regex: key.trim(), $options: "i" },
                    }),
                },
            });
        }
        if (type?.toLowerCase() === "referral") {
            pipeline.push({
                $lookup: {
                    from: "referencedetails",
                    localField: "_id",
                    foreignField: "leadId",
                    as: "referenceDetails",
                },
            }, {
                $match: {
                    referenceDetails: {
                        $elemMatch: {
                            referenceType: "yes",
                            ...(key?.trim() && {
                                refereeName: { $regex: key.trim(), $options: "i" },
                            }),
                        },
                    },
                },
            });
        }
        const leadData = await Leads_Modals_1.LeadModel.aggregate([
            ...initPipeline,
            {
                $lookup: {
                    from: "collaborations",
                    localField: "_id",
                    foreignField: "leadId",
                    pipeline: [
                        {
                            $project: {
                                _id: 0,
                                memberId: 1,
                            },
                        },
                    ],
                    as: "collaborators",
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "collaborators.memberId",
                    foreignField: "_id",
                    as: "collabUsersRaw",
                },
            },
            {
                $addFields: {
                    collabUsersDetail: {
                        $map: {
                            input: "$collabUsersRaw",
                            as: "user",
                            in: {
                                _id: 1,
                                userId: "$$user._id",
                                fullName: "$$user.fullName",
                                profileImage: "$$user.profileImage",
                            },
                        },
                    },
                },
            },
            {
                $project: {
                    assignedUserRaw: 0,
                    collabUsersRaw: 0,
                    collaborators: 0,
                },
            },
            ...pipeline,
            {
                $lookup: {
                    from: "leadbasicdetails",
                    let: { leadId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [{ $eq: ["$leadId", "$$leadId"] }],
                                },
                            },
                        },
                        {
                            $project: {
                                _id: 0,
                                tokenReceived: 1,
                                approvedTokenBydirector: 1,
                                approvedDesignByDesigner: 1,
                                approvedBySurveyor: 1,
                                negoApproved: 1,
                                discount: 1,
                                discountType: 1,
                            },
                        },
                    ],
                    as: "basicDetails",
                },
            },
            {
                $unwind: {
                    path: "$basicDetails",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "estimates",
                    localField: "_id",
                    foreignField: "leadId",
                    as: "estimates",
                },
            },
            {
                $addFields: {
                    minEstimate: { $min: "$estimates.minEstimate" },
                    maxEstimate: { $max: "$estimates.maxEstimate" },
                },
            },
            {
                $project: {
                    estimates: 0,
                },
            },
            {
                $group: {
                    _id: "$_id",
                    lead: { $first: "$$ROOT" },
                },
            },
            {
                $replaceRoot: { newRoot: "$lead" },
            },
            {
                $project: {
                    assignedBy: 0,
                    createdBy: 0,
                    collabMembers: 0,
                },
            },
            {
                $addFields: {
                    sortDate: {
                        $ifNull: ["$updatedAt", "$createdAt"],
                    },
                },
            },
            {
                $sort: {
                    sortDate: -1,
                },
            },
            {
                $limit: 50,
            },
        ]);
        return leadData;
    }
    catch (error) {
        console.log(error, "check error here");
        throw "Error During Getting Lead Data Repo Error ";
    }
};
exports.getFilteredLeadsRepo = getFilteredLeadsRepo;
const getLeadLogsCountRepository = async (userId, userDesignation) => {
    try {
        const filterPrivilegedLeads = [];
        const filterStatusBased = [];
        if (userDesignation !== "director") {
            filterPrivilegedLeads.push({
                $match: { assignedTo: userId },
            }, {
                $unionWith: {
                    coll: "collaborations",
                    pipeline: [
                        {
                            $match: {
                                memberId: userId,
                            },
                        },
                        {
                            $lookup: {
                                from: "leads",
                                localField: "leadId",
                                foreignField: "_id",
                                as: "leadDetails",
                            },
                        },
                        { $unwind: "$leadDetails" },
                        {
                            $replaceRoot: { newRoot: "$leadDetails" },
                        },
                    ],
                },
            });
        }
        if (userDesignation === "salesman") {
            filterStatusBased.push({
                $match: { "logs.updated_to": { $nin: ["new", "approved_design"] } },
            });
        }
        else if (userDesignation === "designer") {
            filterStatusBased.push({
                $match: { "logs.updated_to": { $in: ["assigned", "approved_design"] } },
            });
        }
        const count = Leads_Modals_1.LeadModel.aggregate([
            ...filterPrivilegedLeads,
            {
                $lookup: {
                    from: "leadupdatelogs",
                    localField: "_id",
                    foreignField: "leadId",
                    as: "logs",
                },
            },
            { $unwind: "$logs" },
            ...filterStatusBased,
            {
                $group: {
                    _id: null,
                    totalLogs: { $sum: 1 },
                },
            },
        ]);
        return count;
    }
    catch (error) {
        throw new Error("Error during fetching Total Count: " + error.message);
    }
};
exports.getLeadLogsCountRepository = getLeadLogsCountRepository;
const createLeadIssueRepository = async (leadId, userId, issIssueBool, userRole) => {
    try {
        const lead = await Leads_Modals_1.LeadModel.findById(leadId);
        if (!lead) {
            throw new Error("Lead not found");
        }
        if (issIssueBool === false) {
            const issueRaisedBy = lead.issueByUser?.toString();
            console.log(issueRaisedBy, "check for this here>>", lead);
            if (issueRaisedBy !== userId.toString() &&
                userRole.toLowerCase() !== "director") {
                throw new Error("Only the issue raiser or a Director can resolve the issue");
            }
        }
        const updateObj = {
            haveIssue: issIssueBool,
            updatedBy: new mongoose_1.default.Types.ObjectId(userId),
        };
        if (issIssueBool === true) {
            updateObj.issueByUser = new mongoose_1.default.Types.ObjectId(userId);
        }
        await Leads_Modals_1.LeadModel.findOneAndUpdate({ _id: leadId }, { $set: updateObj }, { new: true });
        if (!lead) {
            throw new Error("Lead not found");
        }
        lead.updatedBy = new mongoose_1.default.Types.ObjectId(userId);
        await lead.save();
        return;
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.createLeadIssueRepository = createLeadIssueRepository;
const removeCollaboratorsRepo = async (leadId, userIds, loggedInUserId) => {
    try {
        const leadSalesman = await Leads_Modals_1.LeadModel.findById(leadId)
            .select("assignedTo")
            .lean();
        if (leadSalesman?.assignedTo &&
            userIds.includes(leadSalesman?.assignedTo.toString())) {
            throw new Error("Cannot remove the assigned salesman from collaborators");
        }
        const leadDesigner = await Leads_Modals_1.LeadModel.findOne({ leadId })
            .select("assignedDesigner")
            .lean();
        if (leadDesigner?.assignedDesigner &&
            userIds.includes(leadDesigner?.assignedDesigner.toString())) {
            throw new Error("Cannot remove the assigned designer from collaborators");
        }
        const leadSurveyor = await Leads_Modals_1.LeadModel.findOne({ leadId })
            .select("assignedSurveyor")
            .lean();
        if (leadSurveyor?.assignedSurveyor &&
            userIds.includes(leadSurveyor?.assignedSurveyor.toString())) {
            throw new Error("Cannot remove the assigned surveyor from collaborators");
        }
        await TalkingLead_Modals_1.CollaborationModel.deleteMany({
            leadId,
            memberId: { $in: userIds },
        });
    }
    catch (error) {
        console.log(error);
        throw new Error(error?.message || "Error while removing collaborators (Repository Layer)");
    }
};
exports.removeCollaboratorsRepo = removeCollaboratorsRepo;
const createDiscountRequestRepo = async (leadId, requestedBy, discountPercent, leadName, quotation) => {
    try {
        await Leads_Modals_1.LeadDiscountRequestModel.create({
            leadId,
            requestedBy,
            discountPercent,
            leadName,
            quotation,
        });
    }
    catch (error) {
        throw new Error("Error during adding discount request in repository layer: " +
            error.message);
    }
};
exports.createDiscountRequestRepo = createDiscountRequestRepo;
// add discount by salesman from chat box
const addDiscountRepo = async (leadId, discountPercent, quotation, userDesignation) => {
    try {
        discountPercent = Number(discountPercent);
        quotation = Number(quotation);
        const leadBasicDetails = await Leads_Modals_1.LeadBasicDetailsModel.findOne({ leadId });
        if (!leadBasicDetails)
            throw new Error("Cannot find basic details of lead for this id");
        const salesmanDiscount = leadBasicDetails?.salesmanDiscount;
        const discountBysalesman = leadBasicDetails?.discountBysalesman || 0;
        const discountByDirector = leadBasicDetails?.discountByDirector || 0;
        if (userDesignation !== "director") {
            if (Number(salesmanDiscount) < discountPercent)
                throw new Error(`You cannot give discount more than ${salesmanDiscount}%`);
            leadBasicDetails.amountAfterDiscount =
                quotation - (quotation * (discountPercent + discountByDirector)) / 100;
            leadBasicDetails.discountBysalesman = discountPercent;
            leadBasicDetails.totalDiscount = discountByDirector + discountPercent;
        }
        else {
            leadBasicDetails.discountByDirector = discountPercent;
            leadBasicDetails.amountAfterDiscount =
                quotation - (quotation * (discountPercent + discountBysalesman)) / 100;
            leadBasicDetails.totalDiscount =
                leadBasicDetails.discountBysalesman + discountPercent;
            leadBasicDetails.addDiscountByDirector = true;
        }
        leadBasicDetails.Quatation = quotation;
        await leadBasicDetails.save();
    }
    catch (error) {
        console.log(error);
        throw new Error("Error during adding discount request in repository layer: " +
            error.message);
    }
};
exports.addDiscountRepo = addDiscountRepo;
// run when director approve salesman discount request from notification
const approvedDiscountReqRepo = async (reqId, reject) => {
    try {
        const req = await Leads_Modals_1.LeadDiscountRequestModel.findById(reqId);
        if (!req)
            throw new Error("Request not found");
        if (req?.status === "rejected")
            throw new Error("Request already rejected by director.");
        const discountPercent = req?.discountPercent;
        const leadId = req?.leadId;
        const basicDetails = await Leads_Modals_1.LeadBasicDetailsModel.findOne({ leadId });
        if (!basicDetails)
            throw new Error("Basic Detail of Lead not found");
        if (reject) {
            req.status = "rejected";
        }
        else {
            basicDetails.salesmanDiscount =
                basicDetails?.salesmanDiscount + discountPercent;
            req.status = "approved";
        }
        await basicDetails.save();
        await req.save();
    }
    catch (error) {
        console.log(error);
        throw new Error(error?.message || "Something went wrong");
    }
};
exports.approvedDiscountReqRepo = approvedDiscountReqRepo;
const approveDiscountReqManuallyRepo = async (leadId, reqId, discountBysalesman, discountByDirector, Quatation) => {
    try {
        const req = await Leads_Modals_1.LeadDiscountRequestModel.findById(reqId);
        if (!req)
            throw new Error("Request of salesman not found");
        const basicDetails = await Leads_Modals_1.LeadBasicDetailsModel.findOne({ leadId });
        if (!basicDetails)
            throw new Error("Basic Detail of Lead not found");
        basicDetails.salesmanDiscount =
            (basicDetails?.salesmanDiscount || 0) + discountBysalesman;
        basicDetails.discountByDirector =
            (basicDetails?.discountByDirector || 0) + discountByDirector;
        basicDetails.discountBysalesman =
            basicDetails.discountBysalesman + discountBysalesman;
        basicDetails.totalDiscount =
            basicDetails.discountBysalesman + basicDetails.discountByDirector;
        basicDetails.amountAfterDiscount =
            Quatation -
                (Quatation *
                    (basicDetails.salesmanDiscount + basicDetails.discountByDirector)) /
                    100;
        basicDetails.addDiscountByDirector = true;
        req.status = "approved";
        req.discountPercent = discountBysalesman;
        await basicDetails.save();
        await req.save();
    }
    catch (error) {
        throw new Error("Error during Manual approval of discount request in repository layer: " +
            error.message);
    }
};
exports.approveDiscountReqManuallyRepo = approveDiscountReqManuallyRepo;
const getLastDiscountReqRepo = async (leadId) => {
    try {
        const req = await Leads_Modals_1.LeadDiscountRequestModel.findOne({
            leadId,
            status: "pending",
        })
            .sort({ createdAt: -1 })
            .limit(1);
        if (!req)
            return null;
        return req;
    }
    catch (error) {
        console.log(error);
        throw new Error("Error during Manual approval of discount request in repository layer: " +
            error.message);
    }
};
exports.getLastDiscountReqRepo = getLastDiscountReqRepo;

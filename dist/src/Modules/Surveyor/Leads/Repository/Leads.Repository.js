"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSurveyorLeadsRepository = exports.createLeadRepository = exports.approveLeadBySurveyorRepo = void 0;
const Leads_Modals_1 = require("../../../AbhiRachna/Leads/Modals/Leads.Modals");
const producer_1 = require("../../../../RabbitMq/producer");
const approveLeadBySurveyorRepo = async (id, approvedBySurveyor, loggedInUserId) => {
    try {
        console.log(loggedInUserId, 'logged in user');
        const leadBasicDetail = await Leads_Modals_1.LeadBasicDetailsModel.findOne({ leadId: id });
        const lead = await Leads_Modals_1.LeadModel.findOne({ _id: id });
        if (!loggedInUserId)
            throw new Error("User Not Found");
        if (!lead)
            throw new Error("Lead not found");
        if (!leadBasicDetail)
            throw new Error("Lead Basic Detail not found");
        if (leadBasicDetail.approvedBySurveyor) {
            throw new Error("Already Approved");
        }
        leadBasicDetail.approvedBySurveyor = approvedBySurveyor;
        lead.updatedBy = loggedInUserId;
        await lead.save();
        return await Promise.all([leadBasicDetail.save(), lead.save()]);
    }
    catch (err) {
        throw new Error(err.message);
    }
};
exports.approveLeadBySurveyorRepo = approveLeadBySurveyorRepo;
const createLeadRepository = async (data) => {
    try {
        const lead = await Leads_Modals_1.LeadModel.create(data);
        if (!lead) {
            throw new Error("Something wrong during lead creation..");
        }
        await Leads_Modals_1.LeadUpdateLogsModel.create([
            {
                leadId: lead._id,
                updated_from: "",
                updated_to: "new",
            },
        ]);
        // Convert both to string
        // Type assertion
        const leadIdStr = lead._id.toString();
        const createdByStr = lead.createdBy.toString();
        console.log(createdByStr, leadIdStr, "check for lead");
        // Send to queue
        await (0, producer_1.sendToQueueCreateFolder)(leadIdStr, createdByStr);
        return lead;
    }
    catch (error) {
        throw new Error("Error during creating lead in repository layer: " +
            error.message);
    }
};
exports.createLeadRepository = createLeadRepository;
const getSurveyorLeadsRepository = async (surveyorId, isApproved, page, limit) => {
    try {
        const skip = (page - 1) * limit;
        let matchStage = {};
        if (isApproved !== "") {
            console.log("No filter applied for approval status.");
            matchStage = {
                "leadBasicDetails.approvedBySurveyor": isApproved,
            };
        }
        const leads = await Leads_Modals_1.LeadModel.aggregate([
            { $match: { assignedSurveyor: surveyorId } },
            {
                $lookup: {
                    from: "leadbasicdetails",
                    localField: "_id",
                    foreignField: "leadId",
                    pipeline: [
                        { $project: { approvedBySurveyor: 1, _id: 1, status: 1, updatedAt: 1 } },
                    ],
                    as: "leadBasicDetails",
                },
            },
            {
                $match: matchStage,
            },
            {
                $addFields: {
                    latestDetailUpdatedAt: {
                        $max: "$leadBasicDetails.updatedAt"
                    }
                }
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
                $addFields: {
                    sortDate: {
                        $cond: {
                            if: { $gt: ["$latestDetailUpdatedAt", "$createdAt"] },
                            then: "$latestDetailUpdatedAt",
                            else: "$updatedAt",
                        }
                    }
                }
            },
            {
                $sort: { sortDate: -1 }
            },
            {
                $facet: {
                    totalCount: [{ $count: "count" }],
                    data: [{ $skip: skip }, { $limit: limit }],
                },
            },
            {
                $project: {
                    totalCount: { $arrayElemAt: ["$totalCount.count", 0] },
                    data: 1,
                },
            },
        ]);
        return leads;
    }
    catch (error) {
        console.log(error);
        throw new Error("Error during creating lead in repository layer: " +
            error.message);
    }
};
exports.getSurveyorLeadsRepository = getSurveyorLeadsRepository;

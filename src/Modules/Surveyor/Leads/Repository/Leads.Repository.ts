import mongoose from "mongoose";
import {
  LeadBasicDetailsModel,
  LeadModel,
  LeadUpdateLogsModel,
} from "../../../AbhiRachna/Leads/Modals/Leads.Modals";
import { sendToQueueCreateFolder } from "../../../../RabbitMq/producer"

export const approveLeadBySurveyorRepo = async (
  id: string,
  approvedBySurveyor: boolean,
  loggedInUserId: any
) => {
  try {

    console.log(loggedInUserId,'logged in user')
    const leadBasicDetail = await LeadBasicDetailsModel.findOne({ leadId: id });
    const lead = await LeadModel.findOne({ _id: id });
    if (!loggedInUserId) throw new Error("User Not Found");
    if (!lead) throw new Error("Lead not found");
    if (!leadBasicDetail) throw new Error("Lead Basic Detail not found");
        if(leadBasicDetail.approvedBySurveyor){
      throw new Error("Already Approved")
    }
    leadBasicDetail.approvedBySurveyor = approvedBySurveyor;

    lead.updatedBy = loggedInUserId;
    await lead.save();


  return  await Promise.all([leadBasicDetail.save(), lead.save()]);
  } catch (err: any) {
    throw new Error( err.message);
  }
};

export const createLeadRepository = async (data: any) => {
  try {
    const lead = await LeadModel.create(data);
    if(!lead){
     throw new Error("Something wrong during lead creation..")
    }
    await LeadUpdateLogsModel.create([
      {
        leadId: lead._id,
        updated_from: "",
        updated_to: "new",
      },
    ]);
    

// Convert both to string
// Type assertion
const leadIdStr = (lead._id as mongoose.Types.ObjectId).toString();
const createdByStr = (lead.createdBy as mongoose.Types.ObjectId).toString(); 

console.log(createdByStr, leadIdStr, "check for lead");

// Send to queue
await sendToQueueCreateFolder(leadIdStr, createdByStr);



    return  lead

  } catch (error) {
    throw new Error(
      "Error during creating lead in repository layer: " +
      (error as Error).message
    );
  }
};

export const getSurveyorLeadsRepository = async (
  surveyorId: string,
  isApproved: string | boolean,
  page: number,
  limit: number
) => {
  try {
    const skip = (page - 1) * limit;
    let matchStage = {};

    if (isApproved !== "") {
      console.log("No filter applied for approval status.");
      matchStage = {
        "leadBasicDetails.approvedBySurveyor": isApproved,
      };
    }
    const leads = await LeadModel.aggregate([
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
  } catch (error) {
    console.log(error);
    throw new Error(
      "Error during creating lead in repository layer: " +
      (error as Error).message
    );
  }
};

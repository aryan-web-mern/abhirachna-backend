import { interceptors } from "axios";
import { EmployeeModel } from "../../Auth/Modals/Employees.Modals";
import { Request } from "express";
import mongoose from "mongoose";
import { getAllLeadMembers } from "../../../..//Services/getAllLeadMember";
import { collectionMap } from "../../../../utils/functions";


interface matchStageI {
  role?: string;
  $or?: any;
  [key: string]: any;
}

export const getEmployeeRepository = async (req: Request, key: string, role: string, leadId: string) => {
  try {
    const matchStage: matchStageI = { _id: { $ne: req?.user?._id } };


    let allMember: string[] = [];
    if (leadId) {
      allMember = await getAllLeadMembers(leadId);
    }
    if (key) {
      matchStage.$or = [
        { fullName: { $regex: key, $options: "i" } },
        { employeeId: { $regex: key, $options: "i" } },
      ];
    }


    if (allMember.length > 0) {
      matchStage._id = { $nin: allMember?.map(id => new mongoose.Types.ObjectId(id)) };
    }

    if (role) {
      matchStage["designation.name"] = role;
    }

    const employees: any = await EmployeeModel.aggregate([
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
  } catch (err: any) {
    throw new Error("Repo error (getEmployeeRepository): " + err.message);
  }
};



export const filterCmsDataRepository = async (key: string, type: string, draft: boolean | undefined) => {
  try {
    key = key?.length > 0 ? key : "";
    const pipeline = [];
    if (!type) throw new Error("Please provide type!")
    const Model = collectionMap?.[type];

    if (type === "blog") pipeline.push(
      {
        $match: {
          $or: [
            { heading: { $regex: key, $options: "i" } },
            { subheading: { $regex: key, $options: "i" } }
          ]
        }
      }
    )

    if (type === "testimonial") pipeline.push(
      {
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
      }
    )

    if (type === "gallery") pipeline.push(
      {
        $match: {
          $or: [
            { imageName: { $regex: key, $options: "i" } },
            { theme: { $regex: key, $options: "i" } },
          ]
        }
      }
    )

    if (type === "job") pipeline.push(
      {
        $match: {
          $or: [
            { jobTitle: { $regex: key, $options: "i" } },
            { department: { $regex: key, $options: "i" } },
            { jobKey: { $regex: key, $options: "i" } },
          ]
        }
      }
    )

    if (draft !== undefined) {
      pipeline.push({ $match: { draft }})
    }

    const data = Model.aggregate([
      ...pipeline,
      {
        $limit: 20
      }
    ])
    return data;
  } catch (err: any) {
    throw new Error("Repo  error (get filtered cms data): " + err.message);
  }
};
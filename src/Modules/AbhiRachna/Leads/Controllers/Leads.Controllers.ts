import { Request, Response, NextFunction } from "express";
import { ErrorResponse, STATUS_CODE, SuccessResponse } from "../../../../Api";
import {
  addCollaboratorsService,
  addDiscountService,
  approvedDesignByDesignerService,
  approvedDiscountReqService,
  approveDiscountReqManuallyService,
  assignLeadService,
  createDiscountRequestService,
  createLeadIssueService,
  createLeadService,
  getAllLeadMemberService,
  getAllLeadServiceByStatus,
  getAllUserLeadService,
  getFilteredLeadsService,
  getLastDiscountReqService,
  getLeadByIdService,
  getLeadStatsService,
  getTop3LeadMembersService,
  getUpdateLeadByIdService,
  removeCollaboratorsService,
  restoreLeadService,
  updateEstimateService,
  updateLeadService,
} from "../Services/Leads.Services";
import { getAllLeadMembers } from "../../../../Services/getAllLeadMember";
import { getLeadLogsCountRepository } from "../Repository/Leads.Repository";
import { AuthenticatedRequest } from "src/types/types";

export const createLeadController = async (
  req: Request & { user?: { _id: string } },
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const leaddata = req.body;
    if (!req.user || !req.user._id) {
      return ErrorResponse(
        res,
        STATUS_CODE.UNAUTHORIZED,
        "User not authenticated"
      );
    }

    const userId = req.user._id;
    const data = { ...leaddata, createdBy: userId };
    const newLead = await createLeadService(data);
    return SuccessResponse(res, STATUS_CODE.OK, "Lead created successfully");
  } catch (error) {
    next(error);
  }
};

export const updateLeadController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    if (!req.user || !req.user._id) {
      return ErrorResponse(
        res,
        STATUS_CODE.UNAUTHORIZED,
        "User not authenticated"
      );
    }

    const userId = req.user._id;
    const leadId = req.params.id;
    const updates = req.body;

    if (!leadId) {
      return ErrorResponse(res, STATUS_CODE.BAD_REQUEST, "Lead ID is required");
    }

    if (!updates) {
      return ErrorResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        "Provide Some Data for update"
      );
    }

    await updateLeadService(leadId, updates, userId);
    return SuccessResponse(res, STATUS_CODE.OK, "Lead updated successfully");
  } catch (error) {
    next(error);
  }
};

export const updateEstimateController = async (
  req: Request & { user?: { _id: string } },
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const leadId = req.params.id;
    if (!req.user || !req.user._id) {
      return ErrorResponse(
        res,
        STATUS_CODE.UNAUTHORIZED,
        "User not authenticated"
      );
    }

    const userId = req.user._id;
    const { estimateDone } = req.body;

    if (!leadId) {
      return ErrorResponse(res, STATUS_CODE.BAD_REQUEST, "Lead ID is required");
    }

    const updatedLead = await updateEstimateService(
      leadId,
      estimateDone,
      userId
    );

    return SuccessResponse(
      res,
      STATUS_CODE.OK,
      "Estimate updated successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const assignLeadController = async (
  req: Request & { user?: { _id: string } },
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const leadId = req.params.id;
    if (!req.user || !req.user._id) {
      return ErrorResponse(
        res,
        STATUS_CODE.UNAUTHORIZED,
        "User not authenticated"
      );
    }
    const assignedBy = req.user._id;
    const { assignedTo } = req.body;
    const result = await assignLeadService({ leadId, assignedTo, assignedBy });
    return SuccessResponse(res, STATUS_CODE.OK, "Lead assigned successfully");
  } catch (error) {
    next(error);
  }
};

export const getAllLeadWithByStatus = async (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    if (!req.user || !req.user._id) {
      return ErrorResponse(
        res,
        STATUS_CODE.UNAUTHORIZED,
        "User not authenticated"
      );
    }

    const userId = req?.user?._id;
    const userDesignation = req?.user?.designationId?.name;
    const { key, page, limit, approved } = req.query as {
      key: string;
      page: string;
      limit: string;
      approved?: string;
    };

    const pageNumber = parseInt(page);
    const pageLimit = parseInt(limit);
    let filterIds: string[] = [];
    if (typeof req.query?.userIds === "string") {
      filterIds = req.query.userIds.split(",");
    }

    const leads = await getAllLeadServiceByStatus(
      userDesignation,
      key,
      pageNumber,
      pageLimit,
      userId,
      filterIds,
      approved
    );

    return SuccessResponse(res, STATUS_CODE.OK, leads);
  } catch (error) {
    next(error);
  }
};

export const getAllLeads = async (
  req: Request & { user?: { _id: string } },
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    console.log("reqdede", req);
    console.log("req.user", req.user);
    if (!req.user || !req.user._id) {
      return ErrorResponse(
        res,
        STATUS_CODE.UNAUTHORIZED,
        "User not authenticated"
      );
    }

    const { page, limit } = req.query as {
      key: string;
      page: string;
      limit: string;
    };

    const pageNumber = parseInt(page);
    const pageLimit = parseInt(limit);
    const userId = req.user._id;

    const leads = await getAllUserLeadService(pageNumber, pageLimit, userId);

    return SuccessResponse(res, STATUS_CODE.OK, { data: leads });
  } catch (error) {
    next(error);
  }
};

export const getAllLeadMemberControler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { leadId } = req.query as { leadId: string };

    const membersdata = await getAllLeadMemberService(leadId);

    return SuccessResponse(res, STATUS_CODE.OK, membersdata);
  } catch (error) {
    next(error);
  }
};

export const getLeadByIdController = async (
  req: Request & { user?: { _id: string } },
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { leadId } = req.query as { leadId: string };

    if (!leadId) {
      ErrorResponse(res, STATUS_CODE.BAD_REQUEST, "Must Be Provide Lead Id");
    }

    if (!req.user || !req.user._id) {
      return ErrorResponse(
        res,
        STATUS_CODE.UNAUTHORIZED,
        "User not authenticated"
      );
    }

    const userId = req?.user?._id;

    const leadResult = await getLeadByIdService(leadId, userId);
    return SuccessResponse(res, STATUS_CODE.OK, leadResult);
  } catch (error) {
    next(error);
  }
};

export const getLeadStatsController = async (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    if (!req.user || !req.user._id) {
      return ErrorResponse(
        res,
        STATUS_CODE.UNAUTHORIZED,
        "User not authenticated"
      );
    }

    const userDesignation = req?.user?.designationId?.name;
    const userId = req?.user?._id;
    const chart = req.query?.chart as string;
    const { filter = "weekly" } = req?.query as { filter: string };

    if (!chart)
      return ErrorResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        "unable to find chart type"
      );
    const leadResult = await getLeadStatsService(
      userDesignation,
      userId,
      chart,
      filter
    );
    return SuccessResponse(res, STATUS_CODE.OK, leadResult);
  } catch (error) {
    next(error);
  }
};

export const approvedDesignByDesignerController = async (
  req: Request & { user?: { _id: string } },
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const leadId = req.params.id;
    const userId = req?.user?._id;

    if (!userId) {
      return ErrorResponse(
        res,
        STATUS_CODE.UNAUTHORIZED,
        "User not authenticated"
      );
    }

    if (!leadId) {
      return ErrorResponse(res, STATUS_CODE.BAD_REQUEST, "Lead ID is required");
    }

    const updatedLead = await approvedDesignByDesignerService(leadId, userId);

    return SuccessResponse(res, STATUS_CODE.OK, "Approved");
  } catch (error) {
    next(error);
  }
};

export const restoreLeadController = async (
  req: Request & { user?: { _id: string } },
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const leadId = req.params.id;
    const userId = req?.user?._id;

    if (!userId) {
      return ErrorResponse(
        res,
        STATUS_CODE.UNAUTHORIZED,
        "User not authenticated"
      );
    }

    if (!leadId) {
      return ErrorResponse(res, STATUS_CODE.BAD_REQUEST, "Lead ID is required");
    }

    const updatedLead = await restoreLeadService(leadId, userId);

    return SuccessResponse(res, STATUS_CODE.OK, "Approved");
  } catch (error) {
    next(error);
  }
};

export const addCollaboratorsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    if (!req.user || !req.user._id) {
      return ErrorResponse(
        res,
        STATUS_CODE.UNAUTHORIZED,
        "User not authenticated"
      );
    }

    const { leadId, userIds } = req.body;
    const loggedInUserId = req.user?._id;

    if (!leadId || !Array.isArray(userIds) || userIds.length === 0) {
      return ErrorResponse(res, 400, "leadId and userIds[] are required");
    }

    const result = await addCollaboratorsService(
      leadId,
      userIds,
      loggedInUserId
    );

    return SuccessResponse(res, 201, result);
  } catch (error: any) {
    next(error);
  }
};

export const getTop3LeadMembersController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { leadId } = req.params;

    if (!leadId) {
      return ErrorResponse(res, 400, "leadId is required");
    }

    if (!req.user || !req.user._id) {
      return ErrorResponse(
        res,
        STATUS_CODE.UNAUTHORIZED,
        "User not authenticated"
      );
    }
    const userId = req.user?._id;

    const members = await getTop3LeadMembersService(leadId, userId);
    return SuccessResponse(res, STATUS_CODE.OK, members);
  } catch (error: any) {
    return ErrorResponse(res, 500, error.message || "Something went wrong");
  }
};

export const getUpdatedLeadByIdController = async (
  req: Request & { user?: { _id: string } },
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { leadId } = req.params as { leadId: string };

    if (!leadId) {
      return ErrorResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        "Must Provide Lead Id"
      );
    }

    if (!req.user || !req.user._id) {
      return ErrorResponse(
        res,
        STATUS_CODE.UNAUTHORIZED,
        "User not authenticated"
      );
    }

    const userId = req.user._id;
    const leadResult = await getUpdateLeadByIdService(leadId, userId);

    return SuccessResponse(res, STATUS_CODE.OK, leadResult);
  } catch (error) {
    next(error);
  }
};

export const getFilteredLeadsController = async (
  req: Request & { user?: { _id: string } },
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    if (!req.user || !req.user._id) {
      return ErrorResponse(
        res,
        STATUS_CODE.UNAUTHORIZED,
        "User not authenticated"
      );
    }

    const { type, key } = req.query as { type: string; key: string };
    const userDesignation = req?.user?.designationId?.name as string;

    const userId = req.user._id;
    const leadResult = await getFilteredLeadsService(
      key,
      type,
      userId,
      userDesignation
    );

    return SuccessResponse(res, STATUS_CODE.OK, leadResult);
  } catch (error) {
    next(error);
  }
};

export const createLeadIssueController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.params;
    const { isIssue } = req.body;



    const issIssueBool = isIssue === true;



    if (!id) {
      return ErrorResponse(res, 400, "Lead ID is required");
    }

    if (!req.user || !req.user._id) {
      return ErrorResponse(
        res,
        STATUS_CODE.UNAUTHORIZED,
        "User not authenticated"
      );
    }

    const userId = req.user._id;
  
       const userRole=req?.user?.designationId?.name
    const result = await createLeadIssueService(id, userId, issIssueBool,userRole);
    return SuccessResponse(res, STATUS_CODE.OK, "Issue created successfully");
  } catch (error) {
    next(error);
  }
};

export const getLeadLogsCountController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    if (!req?.user) {
      return ErrorResponse(
        res,
        STATUS_CODE.UNAUTHORIZED,
        "User not authenticated"
      );
    }
    const { _id: userId, designationId } = req.user || {};
    const userDesignation = designationId?.name;
    const result = await getLeadLogsCountRepository(userId, userDesignation);
    return SuccessResponse(res, STATUS_CODE.OK, result);
  } catch (error) {
    next(error);
  }
};

export const removeCollaboratorsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    if (!req.user || !req.user._id) {
      return ErrorResponse(
        res,
        STATUS_CODE.UNAUTHORIZED,
        "User not authenticated"
      );
    }

    const userId = req.user._id;
    const { leadId, collaboratorId } = req.body;

    if (!leadId || !collaboratorId) {
      return ErrorResponse(
        res,
        400,
        "Lead ID and Collaborator ID are required"
      );
    }

    const result = await removeCollaboratorsService(
      leadId,
      collaboratorId,
      userId
    );
    return SuccessResponse(res, 200, "Collaborator removed successfully");
  } catch (error) {
    next(error);
  }
};


export const createDiscountRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    if (!req.user || !req.user._id) {
      return ErrorResponse(
        res,
        STATUS_CODE.UNAUTHORIZED,
        "User not authenticated"
      );
    }

    const {quotation, discountPercent, leadName } = req.body;
    const requestedBy = req.user?._id;
    const leadId = req?.params?.id
    if(!leadId) throw new Error("Lead Id not found");
    const result = await createDiscountRequestService(
      leadId,
      requestedBy,
      Number(discountPercent),
      leadName,
      Number(quotation),
    );

    return SuccessResponse(res, 200, "Discount request Created succesfully!");
  } catch (error: any) {
    next(error);
  }
};


export const addDiscount = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    if (!req.user || !req.user._id) {
      return ErrorResponse(
        res,
        STATUS_CODE.UNAUTHORIZED,
        "User not authenticated"
      );
    }

    const { quotedPrice: quotation, totalDiscountPercentage: discountPercent } = req.body;
    const leadId = req?.params?.id
    if(!leadId) throw new Error("Lead Id not found");

    const result = await addDiscountService(
      leadId,
      Number(discountPercent),
      Number(quotation),
      req?.user?.designationId?.name
    );

    return SuccessResponse(res, 200, "Discount added succesfully!");
  } catch (error: any) {
    next(error);
  }
};

// use for both approved and reject-- in reject case pass reject in payload
export const  approvedDiscountReq = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    if (!req.user || !req.user._id) {
      return ErrorResponse(
        res,
        STATUS_CODE.UNAUTHORIZED,
        "User not authenticated"
      );
    }
    const ReqId = req?.params?.id;
    const reject = req?.query?.reject === "true" ? true : false;
    if(!ReqId) throw new Error("Request Id Id not found")

    const result = await approvedDiscountReqService(ReqId, reject);

    return SuccessResponse(res, 200, "Discount approved succesfully!");
  } catch (error: any) {
    next(error);
  }
};


export const  approvedDiscountReqManually = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    if (!req.user || !req.user._id) {
      return ErrorResponse(
        res,
        STATUS_CODE.UNAUTHORIZED,
        "User not authenticated"
      );
    }
    const {leadId, discountBysalesman, discountByDirector, Quatation} = req.body;

    const ReqId = req?.params?.id
    if(!ReqId) throw new Error("Request Id Id not found");

    const result = await approveDiscountReqManuallyService(leadId, ReqId, Number(discountBysalesman), Number(discountByDirector), Number(Quatation));

    return SuccessResponse(res, 200, "Discount approved succesfully!");
  } catch (error: any) {
    next(error);
  }
};

export const  getLastDiscountReq = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    if (!req.user || !req.user._id) {
      return ErrorResponse(
        res,
        STATUS_CODE.UNAUTHORIZED,
        "User not authenticated"
      );
    }

    const leadId = req?.params?.id
    if(!leadId) throw new Error("Lead Id Id not found");


    const result = await getLastDiscountReqService(leadId);

    return SuccessResponse(res, 200, result || null);
  } catch (error: any) {
    next(error);
  }
};
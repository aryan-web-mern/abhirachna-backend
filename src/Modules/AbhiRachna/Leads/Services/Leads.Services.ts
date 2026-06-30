import { addCollaboratorsRepo, addDiscountRepo, approvedDesignByDesignerRepository, approvedDiscountReqRepo, approveDiscountReqManuallyRepo, assignLeadRepository, createDiscountRequestRepo, createLeadIssueRepository, createLeadRepository, getAllLeadMemberRepo, getAllLeadRepoByStatus, getAllUserLeadRepo, getFilteredLeadsRepo, getLastDiscountReqRepo, getLeadByIdRepo, getLeadLogsCountRepository, getLeadStatsRepo, getTop3LeadMembersRepo, getupdatedLeadByIdRepo, removeCollaboratorsRepo, restoreLeadRepository, updateAltDetailsRepository, updateEstimateRepository, updateLeadRepository, updateReferenceDetailsRepository } from "../Repository/Leads.Repository";

export const createLeadService = async (leadData: any) => {
  try {
    const lead = await createLeadRepository(leadData);
    return lead;
  } catch (error) {
    throw new Error("Error during creating lead in service layer: " + (error as Error).message);
  }
};


export const updateLeadService = async (leadId: string, updates: any, userId: string) => {
  try {
    await updateLeadRepository(leadId, updates, userId);

    if ("referenceType" in updates) {
      await updateReferenceDetailsRepository(leadId, updates.referenceType, updates.referenceBy, updates?.refereeName, updates?.refrenceNumber);
    }

    if ("alternativeDetails" in updates && updates.alternativeDetails) {
      await updateAltDetailsRepository(leadId, updates.alternativeDetails);
    }

    if ("status" in updates) {
      await updateLeadRepository(leadId, updates, userId);
    }
    return;

  } catch (error) {
    console.log(error, 'check for error>>')
    throw new Error("Error during lead update in service layer");
  }
};




export const updateEstimateService = async (leadId: string, estimateDone = true, userId: string) => {
  try {
    return await updateEstimateRepository(leadId, estimateDone, userId);
  } catch (error) {
    throw new Error("Error during estimate update in service layer");
  }
};



export const assignLeadService = async ({
  leadId,
  assignedTo,
  assignedBy,
}: {
  leadId: string;
  assignedTo: string;
  assignedBy: string;
}) => {
  try {
    return await assignLeadRepository(leadId, assignedTo, assignedBy);
  } catch (error) {
    throw new Error("Error while assigning lead Service layer");
  }
};


export const getAllLeadServiceByStatus = async (userDesignation: string, key: string, page: number, limit: number, userId?: string, filterIds?: string[], approved?: string) => {
  try {


    return await getAllLeadRepoByStatus(userDesignation, key, page, limit, userId, filterIds, approved);



  } catch (error) {

    throw new Error("Error While getting Lead With Status")
  }
}


export const getAllUserLeadService = async (page: number, limit: number, userId: string) => {
  try {


    return await getAllUserLeadRepo(page, limit, userId);



  } catch (error) {

    throw new Error("Error While getting Lead With Status")
  }
}



export const getAllLeadMemberService = async (leadId: string) => {
  try {

    return await getAllLeadMemberRepo(leadId);

  } catch (error:any) {

    throw new Error(error)
  }
}


export const getLeadByIdService = async (leadId: string, userId: string) => {
  try {

    return await getLeadByIdRepo(leadId, userId);
  } catch (error) {
    throw new Error("Error While getting Lead Details")
  }
}

export const getLeadStatsService = async (userDesignation: string, userId: string, chart: string, filter: string) => {
  try {

    return await getLeadStatsRepo(userDesignation, userId, chart, filter);

  } catch (error) {

    throw new Error("Error While getting Lead stats")
  }
}


export const approvedDesignByDesignerService = async (leadId: string, userId: string) => {
  try {
    return await approvedDesignByDesignerRepository(leadId, userId);
  } catch (error) {
    throw new Error((error as Error)?.message || "Error during estimate update in service layer");
  }
};

export const restoreLeadService = async (leadId: string, userId: string) => {
  try {
    return await restoreLeadRepository(leadId, userId);
  } catch (error) {
    throw new Error((error as Error)?.message || "Error during estimate update in service layer");
  }
};

export const getFilteredLeadsService = async (key: string,
  type: string,
  userId: string,
  userDesignation: string
) => {
  try {
    return await getFilteredLeadsRepo(key, type, userId, userDesignation);
  } catch (error) {
    console.log(error)
    throw new Error((error as Error)?.message || "Error during fetching leads");
  }
};






export const addCollaboratorsService = async (leadId: string, userIds: string[], loggedInUserId: string) => {
  try {
    if (!leadId || userIds.length === 0) {
      throw new Error("LeadId and userIds are required");
    }

    return await addCollaboratorsRepo(leadId, userIds, loggedInUserId);
  } catch (error) {
    throw error;
  }
};



export const getTop3LeadMembersService = async (leadId: string, userId: string) => {
  try {
    return await getTop3LeadMembersRepo(leadId, userId);
  } catch (error: any) {
    throw new Error(error.message || "Service failed while fetching members");
  }
};



export const getUpdateLeadByIdService = async (leadId: string, userId: string) => {
  try {
    return await getupdatedLeadByIdRepo(leadId, userId);
  } catch (error) {
    throw new Error("Error while getting Lead Details (Service Layer)");
  }
};

export const getLeadLogsCountService = async (userId: string, userDesignation: string) => {
  try {
    return await getLeadLogsCountRepository(userId, userDesignation);
  } catch (error) {

    throw new Error("Error during estimate update in service layer");
  }
};

export const createLeadIssueService = async (leadId: string, userId: string, issIssueBool: boolean,userRole:string) => {
  try {

    return await createLeadIssueRepository(leadId, userId, issIssueBool,userRole);
  } catch (error:any) {
    throw new Error(error);
  }
}


export const removeCollaboratorsService = async (leadId: string, userIds: string[], loggedInUserId: string) => {
  try {
    if (!leadId || userIds.length === 0) {
      throw new Error("LeadId and userIds are required");
    }

    return await removeCollaboratorsRepo(leadId, userIds, loggedInUserId);
  } catch (error) {
    throw new Error((error as Error)?.message || "Error while removing collaborators (Service Layer)");
  }
};

export const createDiscountRequestService = async (leadId: string,
  requestedBy: string,
  discountPercent: number,
  leadName: string,
  quotation: number,) => {
  try {
    return await createDiscountRequestRepo(leadId, requestedBy, discountPercent, leadName, quotation);
  } catch (error) {
    console.log(error)
    throw new Error("Error While adding request")
  }
}

export const addDiscountService = async (leadId: string,
  discountPercent: number,
  quotation: number,
  userDesignation: string | undefined
) => {
  try {
    return await addDiscountRepo(leadId, discountPercent, quotation, userDesignation);
  } catch (error: any) {
    console.log(error)
    throw new Error(error?.message || "Error While adding discount")
  }
}

export const approvedDiscountReqService = async (id: string, reject: boolean) => {
  try {
    return await approvedDiscountReqRepo(id, reject);
  } catch (error: any) {
    console.log(error)
    throw new Error(error?.message || "Error While adding request")
  }
}

export const approveDiscountReqManuallyService = async (leadId: string, reqId: string, discountBysalesman: number, discountByDirector: number, Quatation: number) => {
  try {
    return await approveDiscountReqManuallyRepo(leadId, reqId, discountBysalesman, discountByDirector, Quatation);
  } catch (error: any) {
    console.log(error)
    throw new Error(error?.message || "Error While adding request")
  }
}

export const getLastDiscountReqService = async (leadId: string) => {
  try {
    return await getLastDiscountReqRepo(leadId);
  } catch (error: any) {
    console.log(error)
    throw new Error(error?.message || "Error While adding request")
  }
}
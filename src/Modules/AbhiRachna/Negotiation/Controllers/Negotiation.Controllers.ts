import { ErrorResponse, STATUS_CODE } from "../../../../Api"


import { updateLeadToNegotiationService } from "../Services/Negotiation.Services";
import { NextFunction, Request, Response } from "express";
export const updateLeadToNegotiationController = async (req: Request & { user?: { _id: string } }, res: Response, next: NextFunction): Promise<any> => {
  const { leadId } = req.params;
  const { commentNegotiation, Quatation } = req.body;
  if(!commentNegotiation.trim()|| !Quatation.toString().trim()){
    return ErrorResponse(res, STATUS_CODE.BAD_REQUEST, "Please provide comments for negotiation");
  }

  const files = req.files as {
    [fieldname: string]: Express.MulterS3.File[];
  };

  const filesList = files?.documents || [];

  const documents = filesList?.map((file) => file.key)

 


  if (!req.user || !req.user._id) {
    return ErrorResponse(res, STATUS_CODE.UNAUTHORIZED, "User not authenticated");
  }
  const employeeId = req.user._id;
   const role= req?.user?.designationId?.name;



  try {


    const result = await updateLeadToNegotiationService(
      leadId,
      commentNegotiation,
      documents,
      Number(Quatation),
      employeeId,
      role
    );

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

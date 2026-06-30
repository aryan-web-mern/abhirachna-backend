import { ErrorResponse, STATUS_CODE, SuccessResponse } from "../../../../Api";
import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../../../types/types";
import { Types } from "mongoose";
import {
  completeMeetingServices,
  createMeetingServices,
  deleteMeetingServices,
  EditMeetingServices,
  getLeadNumberAndNameService,
  getMeetingListByDateService,
  getMeetingListByMonthService,
} from "../Services/Meeting.Services";

export const createMeetingController = async (
  req: AuthenticatedRequest,
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

    const userId: string = req?.user?._id;

    const { date, starttime, meetingType, leadId, timeZone } = req.body as {
      date: string;

      starttime: string;
      meetingType: "in-person" | "virtual" | "hybrid";
      leadId: Types.ObjectId;
      timeZone: string;
    };

    if (starttime === "" || !leadId) {
      return ErrorResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        "Not Allow Empty Fields"
      );
    }

    const result = await createMeetingServices({
      date,
      starttime,
      meetingType,
      leadId,
      userId,
      timeZone,
      userDesignation: req.user?.designationId?.name,
    });

    return SuccessResponse(res, STATUS_CODE.OK, "Create Meeting Successfully");
  } catch (error) {
    next(error);
  }
};

export const completeMeetingController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { meetingId, leadId } = req.body as {
      meetingId: string;
      leadId: string;
    };

    if (!req.user || !req.user._id) {
      return ErrorResponse(
        res,
        STATUS_CODE.UNAUTHORIZED,
        "User not authenticated"
      );
    }

    const userId = req.user?._id;

    if (!meetingId) {
      return ErrorResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        "Meeting ID is required"
      );
    }

    const result = await completeMeetingServices(meetingId, userId, leadId);

    return SuccessResponse(
      res,
      STATUS_CODE.OK,
      "Meeting completed successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const getLeadNumberAndName = async (
  req: AuthenticatedRequest,
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

    const userId = req.user?._id;
    const key = req.query?.key as string || "";
    const designation = req.user?.designationId?.name;
    const { page, limit } = req.query;
    const pageNum = Number(page);
    const limitNum = Number(limit);

    const leadInfo = await getLeadNumberAndNameService(
      userId,
      pageNum,
      limitNum,
      designation,
      key
    );

    if (!leadInfo) {
      return ErrorResponse(res, STATUS_CODE.NOT_FOUND, "Lead not found");
    }

    return SuccessResponse(res, STATUS_CODE.OK, leadInfo);
  } catch (error) {
    next(error);
  }
};

export const getMeetingListByMonth = async (
  req: AuthenticatedRequest,
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
    const userDesignation = req?.user?.designationId?.name
    const userId = req.user?._id;
    const date = req.query?.date as string;

    const leadInfo = await getMeetingListByMonthService(userId, date, userDesignation);

    return SuccessResponse(res, STATUS_CODE.OK, leadInfo);
  } catch (error) {
    next(error);
  }
};

export const getMeetingListByDateController = async (
  req: AuthenticatedRequest,
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

    const userId = req.user?._id;
    const designation = req.user?.designationId?.name;
    const date = req.query?.date as string;

    const leadInfo = await getMeetingListByDateService(
      userId,
      date,
      designation
    );

    return SuccessResponse(res, STATUS_CODE.OK, leadInfo);
  } catch (error) {
    next(error);
  }
};

export const editMeetingController = async (
  req: AuthenticatedRequest,
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
    const userId = req.user?._id;
    const role = req.user?.designationId?.name;

    if (!role) {
      return ErrorResponse(res, STATUS_CODE.BAD_REQUEST, "Role is missing");
    }
    const { meetingId, date, starttime, meetingType } = req.body as {
      meetingId: string;
      date: string;
      starttime: string;
      meetingType: "in-person" | "virtual" | "hybrid";
    };
    if (!meetingId) {
      return ErrorResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        "Meeting ID is required"
      );
    }

    const result = await EditMeetingServices(
      meetingId,
      date,
      starttime,
      meetingType,
      userId,
      role
    );

    return SuccessResponse(res, STATUS_CODE.OK, "Meeting edited successfully");
  } catch (error) {
    
    next(error);
  }
};

export const deleteMeetingController = async (
  req: AuthenticatedRequest,
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

    const userId = req.user?._id;
    const role = req.user?.designationId?.name;
    if (!role) {
      return ErrorResponse(res, STATUS_CODE.BAD_REQUEST, "Role is missing");
    }

    const { meetingId } = req.params as {
      meetingId: string;
    };

    if (!meetingId) {
      return ErrorResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        "Meeting ID is required"
      );
    }


    const result = await deleteMeetingServices(meetingId, userId, role);

    if (!result) {
      return ErrorResponse(res, STATUS_CODE.NOT_FOUND, "Meeting not found");
    }

    return SuccessResponse(res, STATUS_CODE.OK, "Meeting deleted successfully");
  } catch (error) {
    next(error);
  }
};

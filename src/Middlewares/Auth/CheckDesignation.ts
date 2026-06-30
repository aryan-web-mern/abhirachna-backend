import { Request, Response, NextFunction, RequestHandler } from "express";
import { EmployeeModel } from "../../Modules/AbhiRachna/Auth/Modals/Employees.Modals";
import { ErrorResponse } from "../../Api";
import { STATUS_CODE } from "../../Api"; // Your custom code constants
import { Document } from "mongoose";
import { userModel } from "../../Modules/AbhiRachna/Auth/Modals/User.Modals";

interface Designation {
  _id: string;
  name: string;
}

export const checkDesignation =
  (allowedDesignations: string[]) =>
    async (
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

        const userId = req.user._id;

        const user = await EmployeeModel.findById(userId).populate(
          "designationId"
        );

        if (!user || !user.designationId) {
          return ErrorResponse(
            res,
            STATUS_CODE.UNAUTHORIZED,
            "Invalid user or designation"
          );
        }

        const userDesignation = (
          user.designationId as Designation
        ).name?.toLowerCase();

        if (!allowedDesignations.includes(userDesignation)) {
          return ErrorResponse(
            res,
            STATUS_CODE.UNAUTHORIZED,
            "You are not authorized"
          );
        }
        next();
      } catch (error) {
        return ErrorResponse(
          res,
          STATUS_CODE.INTERNAL_SERVER_ERROR,
          "Internal server error"
        );
      }
    };

export const checkRole =
  (allowedRoles: string[]) =>
    async (
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

        const userId = req.user._id;

        let user = await EmployeeModel.findById(userId);

        if (!user) {
          user = await userModel.findById(userId);
        }

        if (!user || !user.role) {
          return ErrorResponse(
            res,
            STATUS_CODE.UNAUTHORIZED,
            "Invalid user or role"
          );
        }


        const userRole = user?.role?.toLowerCase();
        const normalizedAllowedRoles = allowedRoles.map(role => role.toLowerCase());


        if (!normalizedAllowedRoles.includes(userRole)) {
          return ErrorResponse(
            res,
            STATUS_CODE.UNAUTHORIZED,
            "You are not authorized person"
          );
        }
        next();
      } catch (error) {
        return ErrorResponse(
          res,
          STATUS_CODE.INTERNAL_SERVER_ERROR,
          "Internal server error"
        );
      }
    };


export const validateLeadsAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    let status = req?.query?.key as string;
    const designation = req?.user?.designationId?.name;
 if(!status){
  status="public"
 }

    if (designation === "director" || designation === "personal_assistant") return next();
    if (designation === "salesman" && ["assigned", "talking", "designing", "negotiation", "closed", "lost", "public"].includes?.(status)) return next();
    if (designation === "designer" && ["designing", "negotiation","public"].includes?.(status)) return next();
    if (designation === "surveyor") return next();

    return ErrorResponse(
      res,
      STATUS_CODE.UNAUTHORIZED,
      `You are not authorized to get leads of status ${status}.`
    );
  }
  catch (error) {
    return ErrorResponse(
      res,
      STATUS_CODE.INTERNAL_SERVER_ERROR,
      "Internal server error"
    );
  }
}
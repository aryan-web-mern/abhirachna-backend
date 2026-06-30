import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import { ErrorResponse } from "../../Api";
import { EmployeeModel } from "../../Modules/AbhiRachna/Auth/Modals/Employees.Modals"
import { sessionModel, userModel } from "../../Modules/AbhiRachna/Auth/Modals/User.Modals";

interface AuthenticatedRequest extends Request {
  user?: any;
  sessionId?: string;
}

export const checkAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {

    let token = req.cookies?.token;


    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }



    if (!token) {
      return ErrorResponse(res, 401, "Unauthorized: No token provided");
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    const userId = decoded.id;
    const sessionId = decoded.sessionId;
    // const userId = "6881e53fb2b6744dd80b5700"
    if (req.headers["x-upload-type"] === "Lead") {
      const session = await sessionModel.findOne({ userId, sessionId: sessionId });
      if (!session)  return ErrorResponse(res, 401, "Session Expired!");
    }

    let user = await EmployeeModel.findById(userId).select("-password").populate("designationId");
    if (!user) {
      user = await userModel.findById(userId);;
    }

    if (!user) {
      return ErrorResponse(res, 401, "Unauthorized: User not found");
    }


    req.user = user;
    req.sessionId = sessionId;
    console.log(user, 'check for user>>>')
    next();
  } catch (error: any) {
    console.error("checkAuth error:", error.message);
    return ErrorResponse(res, 401, "Unauthorized: Invalid token");
  }
};

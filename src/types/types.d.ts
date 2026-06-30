import { Request } from "express";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      _id: string;
      email?: string;
      name?: string;
      designationId?: {name: string}
     
    },
     timeZone?: string;
  }
}


export interface AuthenticatedRequest extends Request {
  user?: { _id: string,role?:string , designationId?: any, profileImage?: string};
}
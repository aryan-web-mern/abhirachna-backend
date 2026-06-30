import { Request, Response, NextFunction } from "express";
import { ErrorResponse, STATUS_CODE } from "../../Api";

const requireParameters = <T extends string[]>(...parameters: T) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const body = req.body;
    console.log(body,'check for body>>')

  if (!body || typeof body !== 'object') {
  
      ErrorResponse(
            res,
            STATUS_CODE.BAD_REQUEST,
            'Request body is missing or invalid'
          );

          return;
  }
    try {
      for (const key of parameters) {
        
        if (!req.body[key] || req.body[key].toString().trim() === "") {
          ErrorResponse(
            res,
            STATUS_CODE.BAD_REQUEST,
            `Missing or Inavlid ${key}`
          );
          return;
        }
      }
      next();
    } catch (error) {
      next(new Error((error as { message: string }).message));
    }
  };
};

export default requireParameters;





import { NextFunction, Request, Response } from "express";
import { ErrorResponse, STATUS_CODE } from "../Api";
import setLogger from "../Logger/logger";


const NotFound: (req: Request, res: Response, next: NextFunction) => void = (req, res, next) => {
  setLogger({ req})?.log('error', 'error', { message: "Route not found" });
  return ErrorResponse(res, STATUS_CODE.NOT_FOUND, `Route not found : ${req.originalUrl}`)
};

export { NotFound };

import { NextFunction, Request, Response } from "express";
import { STATUS_CODE } from "../Api";

const ServerError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error caught: ", err);
  let message = "Something went wrong";

  // Handle MongoDB Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  }

  // Handle MongoDB CastError
  if (err.name === "CastError") {
    message = `Invalid ${err.path}: ${err.value}`;
  }
  res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
    message: message,
    error: err.message,
    stack: err.stack,
    url: req.originalUrl,
  });
};

export { ServerError };

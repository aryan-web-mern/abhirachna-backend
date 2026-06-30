import { Response } from "express";

const SuccessResponse = (res: Response, status: number, data: Object | null) => {
  return res.status(status).json({ success: true, data });
};

export { SuccessResponse };

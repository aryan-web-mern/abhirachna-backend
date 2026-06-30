import { filterCmsDataService, getEmployeesService } from "../Services/Employee.Services";

import { Request, Response, NextFunction } from 'express';

export const getEmployeesController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { key, role,leadId } = req.query as { key: string; role: string ,leadId:string};

    const data = await getEmployeesService(req, key, role,leadId);

    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const filterCmsDataController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let { key, type, draft } = req.query as { key: string; type: string, draft: string | boolean  | undefined};
      draft = draft === "true" ? true : draft === "false" ?  false : undefined;
    const data = await filterCmsDataService(key, type, draft);

    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

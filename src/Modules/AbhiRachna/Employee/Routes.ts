import express from "express";
import { filterCmsDataController, getEmployeesController } from "./Controllers/Employee.Controller";
import { checkAuth } from "../../..//Middlewares/Auth/ValidateCokkies";
import { checkDesignation } from "../../../Middlewares/Auth/CheckDesignation";

const router = express.Router();

router.get("/employees-list",checkAuth ,getEmployeesController)
router.get("/cms-filter",checkAuth, checkDesignation(["cms"]),filterCmsDataController)



export default router;

// importing necessary modules

import { Router } from "express";
import requireParameters from "../../../Middlewares/Global/requireParameters";
import { addDesignationController, getAllDesignationsController } from "./Controllers/Designation.controller";
import { checkAuth } from "../../../Middlewares/Auth/ValidateCokkies";


// Intializing the router
const router = Router();

//Dfine the route for create new designation here.....$

router.post(
  "/register",
  requireParameters(
    "DesignationName",
  ),
  addDesignationController
);

router.get(
  "/get-all-designations",
  checkAuth,
  getAllDesignationsController
);

export default router;

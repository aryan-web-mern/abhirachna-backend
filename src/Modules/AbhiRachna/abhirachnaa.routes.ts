import express from "express";
import EmployeeRoutes from './Employee/Routes'

const router = express.Router();


router.use("/employee", EmployeeRoutes)

export default router;

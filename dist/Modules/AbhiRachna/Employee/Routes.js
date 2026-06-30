"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Employee_Controller_1 = require("./Controllers/Employee.Controller");
const ValidateCokkies_1 = require("../../..//Middlewares/Auth/ValidateCokkies");
const CheckDesignation_1 = require("../../../Middlewares/Auth/CheckDesignation");
const router = express_1.default.Router();
router.get("/employees-list", ValidateCokkies_1.checkAuth, Employee_Controller_1.getEmployeesController);
router.get("/cms-filter", ValidateCokkies_1.checkAuth, (0, CheckDesignation_1.checkDesignation)(["cms"]), Employee_Controller_1.filterCmsDataController);
exports.default = router;

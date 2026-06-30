"use strict";
// importing necessary modules
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const requireParameters_1 = __importDefault(require("../../../Middlewares/Global/requireParameters"));
const Designation_controller_1 = require("./Controllers/Designation.controller");
const ValidateCokkies_1 = require("../../../Middlewares/Auth/ValidateCokkies");
// Intializing the router
const router = (0, express_1.Router)();
//Dfine the route for create new designation here.....$
router.post("/register", (0, requireParameters_1.default)("DesignationName"), Designation_controller_1.addDesignationController);
router.get("/get-all-designations", ValidateCokkies_1.checkAuth, Designation_controller_1.getAllDesignationsController);
exports.default = router;

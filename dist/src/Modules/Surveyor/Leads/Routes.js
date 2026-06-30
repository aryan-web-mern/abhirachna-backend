"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Leads_Controllers_1 = require("./Controllers/Leads.Controllers");
const ValidateCokkies_1 = require("../../../Middlewares/Auth/ValidateCokkies");
const CheckDesignation_1 = require("../../../Middlewares/Auth/CheckDesignation");
const requireParameters_1 = __importDefault(require("../../../Middlewares/Global/requireParameters"));
const router = express_1.default.Router();
router.put("/request/:id", ValidateCokkies_1.checkAuth, (0, CheckDesignation_1.checkDesignation)(["surveyor"]), Leads_Controllers_1.approveLeadBySurveyorController);
router.post("/lead", ValidateCokkies_1.checkAuth, (0, CheckDesignation_1.checkDesignation)(["surveyor"]), (0, requireParameters_1.default)("name", "mobile", "email", "address"), Leads_Controllers_1.createLeadController);
router.get("/surveyor-leads", ValidateCokkies_1.checkAuth, (0, CheckDesignation_1.checkDesignation)(["surveyor"]), Leads_Controllers_1.getSurveyorLeadsController);
exports.default = router;

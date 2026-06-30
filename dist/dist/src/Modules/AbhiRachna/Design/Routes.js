"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ValidateCokkies_1 = require("../../../Middlewares/Auth/ValidateCokkies");
const Design_Controller_1 = require("./Controller/Design.Controller");
const router = express_1.default.Router();
router.put("/status/:leadId", ValidateCokkies_1.checkAuth, Design_Controller_1.changeToDesigningStatus);
exports.default = router;

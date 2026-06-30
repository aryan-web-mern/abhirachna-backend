"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Director_Controllers_1 = require("./Controllers/Director.Controllers");
const ValidateCokkies_1 = require("../../../Middlewares/Auth/ValidateCokkies");
const router = express_1.default.Router();
router.put("/request/token/:leadId", ValidateCokkies_1.checkAuth, Director_Controllers_1.approveDesigningByDirectorController);
router.put("/request/nego-approve/:leadId", ValidateCokkies_1.checkAuth, Director_Controllers_1.approveNegoByDirectorController);
exports.default = router;

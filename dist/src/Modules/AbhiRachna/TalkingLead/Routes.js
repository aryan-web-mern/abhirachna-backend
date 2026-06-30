"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ValidateCokkies_1 = require("../../../Middlewares/Auth/ValidateCokkies");
const TalkingLead_Controllers_1 = require("./Controllers/TalkingLead.Controllers");
const router = express_1.default.Router();
router.put("/status/:id", ValidateCokkies_1.checkAuth, TalkingLead_Controllers_1.updateToTalkingController);
exports.default = router;

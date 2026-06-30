"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Support_Controller_1 = require("./Controller/Support.Controller");
const router = express_1.default.Router();
router.post("/send-msg", Support_Controller_1.saveUserMsgController);
router.post("/schedule-meeting", Support_Controller_1.scheduleMeetingController);
exports.default = router;

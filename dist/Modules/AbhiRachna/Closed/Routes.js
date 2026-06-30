"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ValidateCokkies_1 = require("../../../Middlewares/Auth/ValidateCokkies");
const Uploads_1 = require("../../../Middlewares/Multers/S3Uploads/Uploads");
const Closed_Controllers_1 = require("./Controllers/Closed.Controllers");
const router = express_1.default.Router();
router.put("/:leadId", ValidateCokkies_1.checkAuth, Uploads_1.uploadS3.fields([{ name: "documents", maxCount: 10 }]), Closed_Controllers_1.updateLeadToClosedController);
exports.default = router;

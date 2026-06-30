"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ValidateCokkies_1 = require("../../../Middlewares/Auth/ValidateCokkies");
const requireParameters_1 = __importDefault(require("../../../Middlewares/Global/requireParameters"));
const Negotiation_Controllers_1 = require("./Controllers/Negotiation.Controllers");
const Uploads_1 = require("../../../Middlewares/Multers/S3Uploads/Uploads");
const router = express_1.default.Router();
router.patch("/:leadId/move-to-negotiation", ValidateCokkies_1.checkAuth, Uploads_1.uploadS3.fields([{ name: "documents", maxCount: 10 }]), (0, requireParameters_1.default)('Quatation', 'commentNegotiation'), Negotiation_Controllers_1.updateLeadToNegotiationController);
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Routes_1 = __importDefault(require("./TestMonials/Routes"));
const Routes_2 = __importDefault(require("./Blogs/Routes"));
const Routes_3 = __importDefault(require("./Careers/Routes"));
const Routes_4 = __importDefault(require("./Support/Routes"));
const Routes_5 = __importDefault(require("./Gallery/Routes"));
const router = express_1.default.Router();
router.use("/testmonials", Routes_1.default);
router.use("/blog", Routes_2.default);
router.use("/careers", Routes_3.default);
router.use("/gallery", Routes_5.default);
router.use("/support", Routes_4.default);
exports.default = router;

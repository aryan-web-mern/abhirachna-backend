"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DesignationModel = void 0;
const mongoose_1 = require("mongoose");
const designationSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        enum: ["director", "salesman", "designer", "personal_assistant", "client", 'surveyor'],
    },
    description: {
        type: String,
        required: false
    }
});
const DesignationModel = (0, mongoose_1.model)("Designation", designationSchema);
exports.DesignationModel = DesignationModel;

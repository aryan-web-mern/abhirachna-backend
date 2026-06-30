"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEstimateByLeadIdController = exports.updateEstimateExitingLeadController = exports.createEstimateExitingLeadController = exports.createLeadWithEstimateController = exports.updateDesignOptionController = exports.deleteDesignOptionController = exports.getSingleDesignOptionController = exports.getAllDesignOptionsController = exports.createDesignOptionController = void 0;
const Api_1 = require("../../../../Api");
const Estimate_Services_1 = require("../Services/Estimate.Services");
const Estimate_Modals_1 = require("../Modals/Estimate.Modals");
const createDesignOptionController = async (req, res, next) => {
    try {
        const created = await (0, Estimate_Services_1.createDesignOptionService)(req.body);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, "Design option created");
    }
    catch (err) {
        next(err);
    }
};
exports.createDesignOptionController = createDesignOptionController;
const getAllDesignOptionsController = async (req, res, next) => {
    try {
        const result = await (0, Estimate_Services_1.getAllDesignOptionsService)();
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, result);
    }
    catch (err) {
        next(err);
    }
};
exports.getAllDesignOptionsController = getAllDesignOptionsController;
const getSingleDesignOptionController = async (req, res, next) => {
    try {
        const result = await (0, Estimate_Services_1.getSingleDesignOptionService)(req.params.id);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, result);
    }
    catch (err) {
        next(err);
    }
};
exports.getSingleDesignOptionController = getSingleDesignOptionController;
const deleteDesignOptionController = async (req, res, next) => {
    try {
        const id = req.params.id;
        await (0, Estimate_Services_1.deleteDesignOptionService)(id);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, "Design option deleted");
    }
    catch (err) {
        next(err);
    }
};
exports.deleteDesignOptionController = deleteDesignOptionController;
const updateDesignOptionController = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const updated = await (0, Estimate_Services_1.updateDesignOptionService)(id, data);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, "Design option updated");
    }
    catch (err) {
        next(err);
    }
};
exports.updateDesignOptionController = updateDesignOptionController;
const createLeadWithEstimateController = async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.UNAUTHORIZED, "User not authenticated");
        }
        const currentUser = req.user._id;
        const data = { createdBy: currentUser, ...req.body };
        const result = await (0, Estimate_Services_1.createLeadWithEstimateService)(data);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, result);
    }
    catch (err) {
        next(err);
    }
};
exports.createLeadWithEstimateController = createLeadWithEstimateController;
const createEstimateExitingLeadController = async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.UNAUTHORIZED, "User not authenticated");
        }
        const currentUser = req.user._id;
        const data = { createdBy: currentUser, ...req.body };
        const result = await (0, Estimate_Services_1.createExitingLeadEstimateService)(data);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, result);
    }
    catch (err) {
        next(err);
    }
};
exports.createEstimateExitingLeadController = createEstimateExitingLeadController;
const updateEstimateExitingLeadController = async (req, res, next) => {
    try {
        const estimateId = req?.params?.id;
        if (!req.user || !req.user._id) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.UNAUTHORIZED, "User not authenticated");
        }
        if (!estimateId) {
            return (0, Api_1.ErrorResponse)(res, Api_1.STATUS_CODE.NOT_FOUND, "Estimate id not found");
        }
        const currentUser = req.user._id;
        const data = { createdBy: currentUser, ...req.body };
        await (0, Estimate_Services_1.updateExitingLeadEstimateService)(estimateId, data);
        return (0, Api_1.SuccessResponse)(res, Api_1.STATUS_CODE.OK, "Estimate updated successfully!");
    }
    catch (err) {
        next(err);
    }
};
exports.updateEstimateExitingLeadController = updateEstimateExitingLeadController;
const getEstimateByLeadIdController = async (req, res, next) => {
    try {
        let estimateId = '';
        if (req.headers["x-upload-type"] === "Lead") {
            const estimateDoc = await Estimate_Modals_1.EstimateModel.findOne({ leadId: req.params?.estimateId });
            if (!estimateDoc) {
                return res.status(404).json({ success: false, message: "Estimate not found" });
            }
            estimateId = estimateDoc?._id?.toString() || '';
        }
        else {
            estimateId = req.params.estimateId;
        }
        const estimate = await (0, Estimate_Services_1.getEstimateByLeadIdService)(estimateId);
        if (!estimate) {
            return res.status(404).json({ success: false, message: "Estimate not found" });
        }
        res.status(200).json({ success: true, data: estimate });
    }
    catch (err) {
        next(err);
    }
};
exports.getEstimateByLeadIdController = getEstimateByLeadIdController;

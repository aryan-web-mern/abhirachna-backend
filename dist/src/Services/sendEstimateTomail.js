"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEstimateToAdmin = void 0;
const producer_1 = require("../RabbitMq/producer");
const getEstimateTemplate_1 = require("./getEstimateTemplate");
const sendEstimateToAdmin = async (estimateData) => {
    const plainEstimate = estimateData?.toObject();
    const htmlContent = (0, getEstimateTemplate_1.generateEstimateHtml)(plainEstimate);
    const mailPayload = {
        to: "abhirachnaasolutions@gmail.com.rani@psquarecompany.com",
        subject: "New Estimate Or Lead",
        text: "New Estimate or Lead Data Mentioned",
        html: htmlContent,
    };
    await (0, producer_1.sendToQueue)(mailPayload);
};
exports.sendEstimateToAdmin = sendEstimateToAdmin;

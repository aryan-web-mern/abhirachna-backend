"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToQueueCreateFolder = exports.sendToQueue = void 0;
const connection_1 = require("./connection");
const sendToQueue = async (mailPayload) => {
    try {
        await (0, connection_1.createConnection)();
        const channel = (0, connection_1.getChannel)();
        const queue = "send_email_updates";
        await channel.assertQueue(queue, { durable: true });
        const payload = mailPayload;
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(payload)), {
            persistent: true,
        });
    }
    catch (error) {
        console.error("Error in sending message to RabbitMQ:", error);
    }
};
exports.sendToQueue = sendToQueue;
const sendToQueueCreateFolder = async (leadId, userId) => {
    try {
        await (0, connection_1.createConnection)();
        const channel = (0, connection_1.getChannel)();
        const queue = "create_folder";
        await channel.assertQueue(queue, { durable: true });
        // Proper payload banao
        const payload = {
            leadId: leadId?.toString(),
            userId: userId?.toString(),
        };
        console.log("Payload sending to RabbitMQ:", payload);
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(payload)), {
            persistent: true,
        });
        console.log("Message sent to queue:", queue);
    }
    catch (error) {
        console.error("Error in sending message to RabbitMQ:", error);
    }
};
exports.sendToQueueCreateFolder = sendToQueueCreateFolder;

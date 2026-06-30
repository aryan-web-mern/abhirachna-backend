"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startConsuming = void 0;
const mailer_1 = __importDefault(require("../Services/mailer"));
const connection_1 = require("./connection");
const startConsuming = async () => {
    try {
        await (0, connection_1.createConnection)();
        const channel = (0, connection_1.getChannel)();
        const queue = "send_email_updates";
        await channel.assertQueue(queue, { durable: true }); //durable for persistence
        channel.prefetch(1);
        console.log("Consumer listening on queue:", queue);
        channel.consume(queue, async (msg) => {
            if (!msg)
                return;
            let parsed;
            try {
                parsed = JSON.parse(msg.content.toString());
            }
            catch (err) {
                console.error("Invalid message JSON:", msg.content.toString());
                channel.ack(msg); // discard bad messages
                return;
            }
            const attempt = parsed.attempt || 1;
            try {
                await (0, mailer_1.default)(parsed);
                channel.ack(msg);
            }
            catch (error) {
                if (attempt < 3) {
                    const retryMessage = { ...parsed, attempt: attempt + 1 };
                    channel.sendToQueue(queue, Buffer.from(JSON.stringify(retryMessage)), {
                        persistent: true,
                    });
                }
                else {
                    console.error("Max retry attempts reached. Discarding message:", parsed);
                    // Optionally send to DLQ here
                }
                channel.ack(msg);
            }
        });
    }
    catch (error) {
        console.error("Error setting up RabbitMQ consumer:", error);
    }
};
exports.startConsuming = startConsuming;

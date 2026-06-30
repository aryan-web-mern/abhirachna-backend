"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
    if (k2 === undefined)
        k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function () { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function (o, m, k, k2) {
    if (k2 === undefined)
        k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function (o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function (o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function (o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o)
                if (Object.prototype.hasOwnProperty.call(o, k))
                    ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule)
            return mod;
        var result = {};
        if (mod != null)
            for (var k = ownKeys(mod), i = 0; i < k.length; i++)
                if (k[i] !== "default")
                    __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeConnection = exports.getChannel = exports.createConnection = void 0;
const amqp = __importStar(require("amqplib"));
const Appconfig_1 = __importDefault(require("../Config/Appconfig"));
let connection = null;
let channel = null;
const createConnection = async () => {
    if (connection && channel)
        return { connection, channel };
    try {
        //create connection to RabbitMQ server
        const uri = Appconfig_1.default.mq_url;
        connection = await amqp.connect(uri);
        if (!connection) {
            throw new Error("Failed to establish RabbitMQ connection.");
        }
        channel = await connection.createChannel();
        return { connection, channel };
    }
    catch (error) {
        console.error("Failed to connect to RabbitMQ:", error);
        throw error;
    }
};
exports.createConnection = createConnection;
const getChannel = () => {
    if (!channel) {
        throw new Error("RabbitMQ channel not established. Call createConnection first.");
    }
    return channel;
};
exports.getChannel = getChannel;
const closeConnection = async () => {
    try {
        if (connection && channel) {
            await connection.close();
            await channel.close();
            console.log("RabbitMQ connection closed");
        }
    }
    catch (error) {
        console.error("Error closing RabbitMQ connection:", error);
    }
};
exports.closeConnection = closeConnection;

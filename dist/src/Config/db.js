"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidObjectId = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Appconfig_1 = __importDefault(require("./Appconfig"));
const tables = ['leads', 'leadbasicdetails'];
// MongoDB connection URI
const uri = Appconfig_1.default.databaseUrl;
// const sessionuri = Appconfig.session_url;
async function connectToMongoDB() {
    try {
        // Connect to MongoDB using Mongoose
        await mongoose_1.default.connect(uri, { retryWrites: true });
        console.log("Connected to MongoDB with Mongoose!");
    }
    catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw new Error(error);
    }
}
const isValidObjectId = (id) => {
    return mongoose_1.default.Types.ObjectId.isValid(id);
};
exports.isValidObjectId = isValidObjectId;
// Exporting the function for connection
exports.default = connectToMongoDB;

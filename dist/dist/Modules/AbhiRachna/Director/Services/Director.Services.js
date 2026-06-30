"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.approveNegoByDirectorService = exports.approveDesigningByDirectorService = void 0;
const Director_Repository_1 = require("../Repository/Director.Repository");
const approveDesigningByDirectorService = async (leadId, userId, isToken) => {
    try {
        const result = await (0, Director_Repository_1.approveDesigningByDirectorRepository)(leadId, userId, isToken);
        return result;
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.approveDesigningByDirectorService = approveDesigningByDirectorService;
const approveNegoByDirectorService = async (leadId, userId, isToken) => {
    try {
        const result = await (0, Director_Repository_1.approveNegoByDirectorRepository)(leadId, userId, isToken);
        return result;
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.approveNegoByDirectorService = approveNegoByDirectorService;

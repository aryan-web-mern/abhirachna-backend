"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDateAccZone = void 0;
const getDateAccZone = (date, userTimeZone) => {
    const utcDate = new Date(date);
    return utcDate.toLocaleString("en-IN", {
        timeZone: userTimeZone,
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
};
exports.getDateAccZone = getDateAccZone;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setStatusCondLead = void 0;
const setStatusCondLead = (userDesignation, key) => {
    let statusFilter;
    switch (userDesignation) {
        case 'director':
            if (key === 'assigned') {
                statusFilter = { $in: ['assigned', 'talking'] };
            }
            else {
                statusFilter = key;
            }
            break;
        case 'salesman':
            statusFilter = key;
            break;
        case 'designer':
            if (key === 'designing') {
                statusFilter = { $in: ['designing', 'negotiation'] };
            }
            else {
                statusFilter = key;
            }
            break;
        case 'surveyor':
            if (key === 'assigned') {
                statusFilter = { $in: ['talking', 'designing', 'negotiation'] };
            }
            else {
                statusFilter = key;
            }
            break;
        default:
            statusFilter = key;
            break;
    }
    return statusFilter;
};
exports.setStatusCondLead = setStatusCondLead;

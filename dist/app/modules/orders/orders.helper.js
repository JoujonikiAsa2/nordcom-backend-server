"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvailableStatus = void 0;
const client_1 = require("@prisma/client");
const getAvailableStatus = (updatedOrder) => {
    let availableStatus = [];
    switch (updatedOrder) {
        case client_1.OrderStatus.PENDING:
            availableStatus = [
                client_1.OrderStatus.PAID,
                client_1.OrderStatus.SHIPPED,
                client_1.OrderStatus.COMPLETED,
                client_1.OrderStatus.CANCELLED,
            ];
            break;
        case client_1.OrderStatus.PAID:
            availableStatus = [
                client_1.OrderStatus.SHIPPED,
                client_1.OrderStatus.COMPLETED,
                client_1.OrderStatus.CANCELLED,
            ];
            break;
        case client_1.OrderStatus.SHIPPED:
            availableStatus = [client_1.OrderStatus.COMPLETED];
            break;
        case client_1.OrderStatus.COMPLETED:
            availableStatus = [];
            break;
        default:
            availableStatus = [client_1.OrderStatus.PENDING];
            break;
    }
    return availableStatus;
};
exports.getAvailableStatus = getAvailableStatus;

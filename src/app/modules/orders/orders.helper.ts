import { OrderStatus } from "@prisma/client";

export const getAvailableStatus = (updatedOrder: OrderStatus) => {
  let availableStatus: OrderStatus[] = [];
  switch (updatedOrder) {
    case OrderStatus.PENDING:
      availableStatus = [
        OrderStatus.PAID,
        OrderStatus.SHIPPED,
        OrderStatus.COMPLETED,
        OrderStatus.CANCELLED,
      ];
      break;
    case OrderStatus.PAID:
      availableStatus = [
        OrderStatus.SHIPPED,
        OrderStatus.COMPLETED,
        OrderStatus.CANCELLED,
      ];
      break;
    case OrderStatus.SHIPPED:
      availableStatus = [OrderStatus.COMPLETED];
      break;
    case OrderStatus.COMPLETED:
      availableStatus = [];
      break;
    default:
      availableStatus = [OrderStatus.PENDING];
      break;
  }
  return availableStatus;
};
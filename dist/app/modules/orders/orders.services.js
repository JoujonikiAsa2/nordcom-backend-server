"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderServices = void 0;
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const client_1 = require("@prisma/client");
const http_status_2 = __importDefault(require("http-status"));
const orders_helper_1 = require("./orders.helper");
const crypto_1 = require("crypto");
// new branch created
const createOrderInDB = (email) => __awaiter(void 0, void 0, void 0, function* () {
    // Check is user already exists
    const isUserExists = yield prisma_1.default.user.findFirst({
        where: { email },
    });
    if (!isUserExists)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User Not Found.");
    // Fetch this user's cart from cart table.
    const cart = yield prisma_1.default.cart.findFirst({
        where: { userId: isUserExists.id },
        include: {
            items: true,
        },
    });
    if (!cart)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Cart Not Found.");
    // Check if cart is empty
    const { items } = cart;
    if (items.length === 0) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Cart is empty. Cannot create order.");
    }
    const items_withProducts = items.map((item) => (Object.assign(Object.assign({}, item), { price: 0 }))); // Initialize price to 0
    console.log("Cart Details: ", items);
    const totalProduct = items.reduce((acc, item) => acc + item.quantity, 0);
    let totalAmount = 0;
    let currentIndex = 0;
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        for (const item of items) {
            const isProductExists = yield prisma_1.default.product.findUnique({
                where: { id: item.productId, isDeleted: false },
            });
            if (!isProductExists)
                throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Product Not Found.");
            // Check if product is in stock
            if (isProductExists.stock < item.quantity) {
                throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `${isProductExists.name} is out of stock.`);
            }
            totalAmount += isProductExists.price * item.quantity;
            items_withProducts[currentIndex].price =
                isProductExists.price * item.quantity;
            currentIndex++;
            // Update product stock
            const stockUpdated = yield prisma_1.default.product.update({
                where: { id: item.productId },
                data: {
                    stock: isProductExists.stock - item.quantity,
                },
            });
            if (!stockUpdated) {
                throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to update product stock.");
            }
        }
        // Create order
        const orderCreated = yield prisma_1.default.order.create({
            data: {
                userId: isUserExists.id,
                totalAmount,
                totalProduct,
                status: client_1.OrderStatus.PENDING,
                shippingId: (0, crypto_1.randomUUID)(),
                shippingFee: 70,
            },
        });
        if (!orderCreated) {
            throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to create order.");
        }
        // Create order items
        const orderItems = items_withProducts.map((item) => ({
            orderId: orderCreated.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
        }));
        // console.log("Order Items: ", orderItems);
        const orderItemsCreated = yield prisma_1.default.orderItem.createMany({
            data: orderItems,
        });
        if (!orderItemsCreated) {
            throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to create order items.");
        }
        // Clear cart items
        const cartItemsDeleted = yield prisma_1.default.cartItem.deleteMany({
            where: { cartId: cart.id },
        });
        if (!cartItemsDeleted) {
            throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to clear cart items.");
        }
        return orderCreated;
    }));
    return result;
});
const getAllOrdersFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.order.findMany();
    if (!result || result.length === 0) {
        throw new ApiError_1.default(http_status_2.default.NOT_FOUND, "No orders found.");
    }
    const orderWithAvailableStatus = result.map((order) => {
        return Object.assign(Object.assign({}, order), { availableStatus: (0, orders_helper_1.getAvailableStatus)(order.status) });
    });
    return orderWithAvailableStatus;
});
const changeOrderStatusInDB = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if order exists
    const isOrderExists = yield prisma_1.default.order.findUnique({
        where: { id },
    });
    if (!isOrderExists)
        throw new ApiError_1.default(http_status_2.default.NOT_FOUND, "Order Not Found.");
    // Update order status
    const updatedOrder = yield prisma_1.default.order.update({
        where: { id },
        data: {
            status,
        },
    });
    if (!updatedOrder)
        throw new ApiError_1.default(http_status_2.default.INTERNAL_SERVER_ERROR, "Failed to update order status.");
    return { updatedOrder };
});
exports.orderServices = {
    createOrderInDB,
    getAllOrdersFromDB,
    changeOrderStatusInDB,
};

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
exports.PaymentServices = void 0;
const stripe_1 = __importDefault(require("stripe"));
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const config_1 = __importDefault(require("../../../config"));
const client_1 = require("@prisma/client");
const payment_util_1 = require("./payment.util");
const sendEmail_1 = __importDefault(require("../../../helpers/sendEmail"));
const stripe = new stripe_1.default(config_1.default.STRIPE_SECRET_KEY, {
    apiVersion: "2024-04-10; custom_checkout_beta=v1",
});
const CreateChechoutSession = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const createCustomer = yield stripe.customers.create({
        email: payload === null || payload === void 0 ? void 0 : payload.email,
        name: payload === null || payload === void 0 ? void 0 : payload.name,
    });
    const paymentIntent = yield stripe.paymentIntents.create({
        amount: Number(payload.amount) * 100,
        currency: "bdt",
        payment_method_types: ["card"],
        customer: createCustomer.id,
    });
    return { clientSecret: paymentIntent.client_secret };
});
const CreatePaymentInDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield prisma_1.default.user.findUnique({
        where: { email: payload === null || payload === void 0 ? void 0 : payload.email },
    });
    if (!userInfo) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User does not exist");
    }
    const orderInfo = yield prisma_1.default.order.findUnique({
        where: { id: payload === null || payload === void 0 ? void 0 : payload.orderId },
        include: {
            user: true,
            orderItems: {
                include: {
                    product: true,
                },
            },
        },
    });
    if (!orderInfo) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Order does not exist");
    }
    const orderedItems = orderInfo === null || orderInfo === void 0 ? void 0 : orderInfo.orderItems.map((item) => item);
    for (const item of orderedItems) {
        const product = yield prisma_1.default.product.findUnique({
            where: {
                id: item.productId,
            },
        });
        if (product === null) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Product Not Available");
        }
    }
    // transaction id generate
    const trans_Id = (0, payment_util_1.generateTransactionId)();
    const isPaid = yield prisma_1.default.payment.findFirst({
        where: {
            orderId: orderInfo.id,
            status: client_1.PaymentStatus.PAID,
        },
    });
    if (isPaid !== null) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Already Paid");
    }
    const result = yield prisma_1.default.$transaction((tr_client) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const paymentInfo = yield tr_client.payment.create({
            data: {
                amount: orderInfo.totalAmount + Number(orderInfo.shippingFee) || 0,
                paidAt: new Date(),
                orderId: orderInfo.id,
                transactionId: payload.transactionId || trans_Id,
                status: client_1.PaymentStatus.PAID,
                method: (_a = payload.method) !== null && _a !== void 0 ? _a : "card",
            },
        });
        const payment = null;
        if (!payment) {
            yield prisma_1.default.order.delete({
                where: {
                    id: orderInfo.id,
                }
            });
            for (const item of orderedItems) {
                yield prisma_1.default.product.update({
                    where: { id: item.productId },
                    data: { stock: item.product.stock + item.quantity },
                });
            }
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Payment Failed");
        }
        const emailInfo = {
            name: userInfo.name,
            email: userInfo.email,
            subject: "Payment Confirmation",
            transactionId: paymentInfo.transactionId,
            orderId: orderInfo.id,
            amount: orderInfo.totalAmount,
            total_products: orderInfo.totalProduct,
            paidAt: paymentInfo.paidAt,
        };
        (0, sendEmail_1.default)(emailInfo, "payment");
        yield tr_client.order.update({
            where: {
                id: orderInfo.id,
            },
            data: {
                paymentStatus: client_1.PaymentStatus.PAID,
            },
        });
        return paymentInfo;
    }));
    return result;
});
const GetPaymentByTransId = (transId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.payment.findFirst({
        where: {
            transactionId: transId,
        },
    });
    if (result === null) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "No Payment Available");
    }
    return result;
});
const GetPaymentsByUserEmail = (email, orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield prisma_1.default.user.findFirst({
        where: {
            email,
        },
    });
    if (!userInfo) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "No User Available");
    }
    const result = yield prisma_1.default.payment.findMany({
        where: {
            order: {
                user: {
                    email: userInfo.email,
                },
            },
        },
    });
    if (result.length === 0) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "No Payment Available");
    }
    return result;
});
const GetPaymentById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.payment.findFirst({
        where: {
            id: id,
        },
    });
    if (result === null) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "No Payment Available");
    }
    return result;
});
const GetAllPaymentsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.payment.findMany({});
    if (result.length === 0) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "No Payments Available");
    }
    return result;
});
exports.PaymentServices = {
    CreateChechoutSession,
    CreatePaymentInDB,
    GetPaymentByTransId,
    GetPaymentsByUserEmail,
    GetPaymentById,
    GetAllPaymentsFromDB,
};

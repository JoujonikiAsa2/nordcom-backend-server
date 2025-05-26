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
    const orderedItems = orderInfo === null || orderInfo === void 0 ? void 0 : orderInfo.orderItems.map((item) => item.productId);
    orderedItems === null || orderedItems === void 0 ? void 0 : orderedItems.forEach((item) => __awaiter(void 0, void 0, void 0, function* () {
        const product = yield prisma_1.default.product.findUnique({
            where: {
                id: item,
            },
        });
        if (product === null) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User Not Found");
        }
        console.log("I got it");
    }));
    // transaction id generate
    const trans_Id = (0, payment_util_1.generateTransactionId)();
    const result = yield prisma_1.default.$transaction((tr_client) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const paymentInfo = yield prisma_1.default.payment.create({
            data: {
                amount: orderInfo.totalAmount || 0,
                paidAt: new Date(),
                orderId: orderInfo.id,
                transactionId: payload.transactionId || trans_Id,
                status: client_1.PaymentStatus.PAID,
                method: (_a = payload.method) !== null && _a !== void 0 ? _a : "card",
            },
        });
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
        yield prisma_1.default.order.update({
            where: {
                id: orderInfo.id,
            },
            data: {
                paymentStatus: true,
            },
        });
    }));
    return result;
});
const GetPaymentsByTransId = (transId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.payment.findFirst({
        where: {
            transactionId: transId,
        },
    });
    return result;
});
const GetPaymentsByUserEmail = (email, orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield prisma_1.default.user.findFirst({
        where: {
            email,
        },
    });
    if (!userInfo) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User does not exist");
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
    console.log();
    return result;
});
const GetPaymentById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.payment.findFirst({
        where: {
            id: id,
        },
    });
    return result;
});
const GetAllPaymentsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.payment.findMany({});
    return result;
});
exports.PaymentServices = {
    CreateChechoutSession,
    CreatePaymentInDB,
    GetPaymentsByTransId,
    GetPaymentsByUserEmail,
    GetPaymentById,
    GetAllPaymentsFromDB,
};

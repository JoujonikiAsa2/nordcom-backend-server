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
exports.CouponServices = void 0;
const prisma_1 = __importDefault(require("../../shared/prisma"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const GetCouponsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const coupon = yield prisma_1.default.coupon.findMany({
        include: {
            couponUsages: true,
        },
    });
    if (coupon.length === 0) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "No coupon Available");
    }
    return coupon;
});
const GetCouponByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const uniquecoupon = yield prisma_1.default.coupon.findUnique({
        where: {
            id,
        },
        include: {
            couponUsages: true,
        },
    });
    if (uniquecoupon === null) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "No coupon Available");
    }
    return uniquecoupon;
});
const CreateCouponIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { code } = payload;
    const iscouponExists = yield prisma_1.default.coupon.findFirst({
        where: { code },
    });
    if (iscouponExists !== null) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "coupon already exists!");
    }
    const result = yield prisma_1.default.coupon.create({
        data: payload,
    });
    return result;
});
const UpdateCouponIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const iscouponExists = yield prisma_1.default.coupon.findUnique({
        where: {
            id,
        },
    });
    if (iscouponExists === null) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "No coupon Available");
    }
    const result = yield prisma_1.default.coupon.update({
        where: { id },
        data: payload,
    });
    return result;
});
const DeleteCouponFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const iscouponExists = yield prisma_1.default.coupon.findUnique({
        where: {
            id,
        },
    });
    if (iscouponExists === null) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "No coupon Available");
    }
    yield prisma_1.default.coupon.delete({
        where: { id },
    });
    return null;
});
exports.CouponServices = {
    GetCouponsFromDB,
    GetCouponByIdFromDB,
    CreateCouponIntoDB,
    UpdateCouponIntoDB,
    DeleteCouponFromDB,
};

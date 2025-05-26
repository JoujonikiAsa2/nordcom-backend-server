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
exports.FavoriteProductServices = void 0;
const prisma_1 = __importDefault(require("../../shared/prisma"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const GetFavoriteProductsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const FavoriteProduct = yield prisma_1.default.favorite.findMany();
    if (FavoriteProduct.length === 0) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "No FavoriteProduct Available");
    }
    return FavoriteProduct;
});
const GetFavoriteProductByUserIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const uniqueFavoriteProduct = yield prisma_1.default.favorite.findMany({
        where: {
            userId: id,
        },
        include: {
            product: true,
            user: true,
        },
    });
    if (uniqueFavoriteProduct.length === 0) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "No FavoriteProduct Available");
    }
    return uniqueFavoriteProduct;
});
const CreateFavoriteProductIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, productId } = payload;
    const isFavoriteProductExists = yield prisma_1.default.favorite.findFirst({
        where: {
            userId: userId,
            productId: productId,
        },
    });
    if (isFavoriteProductExists !== null) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "FavoriteProduct already exists!");
    }
    const result = yield prisma_1.default.favorite.create({
        data: payload,
    });
    return result;
});
const RemoveFavoriteProductFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isFavoriteProductExists = yield prisma_1.default.favorite.findUnique({
        where: {
            id,
        },
    });
    if (isFavoriteProductExists === null) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "No FavoriteProduct Available");
    }
    const result = yield prisma_1.default.favorite.delete({
        where: {
            id,
        },
    });
    return result;
});
exports.FavoriteProductServices = {
    GetFavoriteProductsFromDB,
    GetFavoriteProductByUserIdFromDB,
    CreateFavoriteProductIntoDB,
    RemoveFavoriteProductFromDB,
};

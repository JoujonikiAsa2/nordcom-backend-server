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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductServices = void 0;
const prisma_1 = __importDefault(require("../../shared/prisma"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const GetProductsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const Product = yield prisma_1.default.product.findMany({
        where: {
            isDeleted: false,
        },
    });
    return Product;
});
const GetProductByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const uniqueProduct = yield prisma_1.default.product.findUnique({
        where: {
            id,
            isDeleted: false,
        },
    });
    return uniqueProduct;
});
const CreateProductIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { sku } = payload;
    const isProductExists = yield prisma_1.default.product.findFirst({
        where: { sku },
    });
    if (isProductExists !== null) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Product already exists!");
    }
    const result = yield prisma_1.default.product.create({
        data: payload,
    });
    return result;
});
const UpdateProductIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { specification, images, seoInformation, variants } = payload, rest = __rest(payload, ["specification", "images", "seoInformation", "variants"]);
    // let updatedData = null
    // const isProductExists = await prisma.product.findUnique({
    //   where: {
    //     id,
    //   },
    // });
    // if (isProductExists == null) {
    //   throw new ApiError(status.BAD_REQUEST, "Product does not exists!");
    // }
    // if (specification) {
    //   const result = await prisma.product.update({
    //     where: { id },
    //     data:{
    //       specification: [...specification]
    //     }
    //   });
    //   updatedData = result
    //   return updatedData
    // }
    return { rest, specification, images, variants, seoInformation, };
});
const DeleteProductFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isProductExists = yield prisma_1.default.product.findUnique({
        where: {
            id,
        },
    });
    if (isProductExists == null) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Product does not exists!");
    }
    yield prisma_1.default.product.delete({
        where: { id },
    });
    return null;
});
exports.ProductServices = {
    GetProductsFromDB,
    GetProductByIdFromDB,
    CreateProductIntoDB,
    UpdateProductIntoDB,
    DeleteProductFromDB,
};

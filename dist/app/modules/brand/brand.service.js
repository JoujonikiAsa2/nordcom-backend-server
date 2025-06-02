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
exports.BrandServices = void 0;
const prisma_1 = __importDefault(require("../../shared/prisma"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const GetBrandsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const brand = yield prisma_1.default.brand.findMany({
        where: { isDeleted: false },
        include: {
            products: true,
        },
    });
    if (brand.length === 0) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "No Brand Available");
    }
    return brand;
});
const GetBrandByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const uniqueBrand = yield prisma_1.default.brand.findUnique({
        where: {
            id,
            isDeleted: false,
        },
    });
    if (uniqueBrand === null) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "No Brand Available");
    }
    return uniqueBrand;
});
const CreateBrandIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, imageUrl } = payload;
    const modifiedPayload = {
        name,
        logoUrl: imageUrl,
        description: payload.description,
        isFeatured: payload.isFeatured,
    };
    const isBrandExists = yield prisma_1.default.brand.findFirst({
        where: {
            name: name,
        },
    });
    if (isBrandExists !== null) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Brand already exists!");
    }
    const result = yield prisma_1.default.brand.create({
        data: modifiedPayload,
    });
    return result;
});
const UpdateBrandIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, imageUrl } = payload;
    const modifiedPayload = {
        name,
        logoUrl: imageUrl,
        description: payload.description,
        isFeatured: payload.isFeatured,
    };
    const isBrandExists = yield prisma_1.default.brand.findUnique({
        where: {
            id,
        },
    });
    if (isBrandExists == null) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Brand does not exists!");
    }
    const result = yield prisma_1.default.brand.update({
        where: { id },
        data: imageUrl ? Object.assign(Object.assign({}, modifiedPayload), { logoUrl: imageUrl }) : payload,
    });
    return result;
});
const DeleteBrandFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isBrandExists = yield prisma_1.default.brand.findUnique({
        where: {
            id,
            isDeleted: false,
        },
    });
    if (isBrandExists === null) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "No Brand Available");
    }
    yield prisma_1.default.brand.update({
        where: {
            id,
        },
        data: {
            isDeleted: true,
        },
    });
    return null;
});
exports.BrandServices = {
    GetBrandsFromDB,
    GetBrandByIdFromDB,
    CreateBrandIntoDB,
    UpdateBrandIntoDB,
    DeleteBrandFromDB,
};

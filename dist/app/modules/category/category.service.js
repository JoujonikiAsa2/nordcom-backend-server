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
exports.CategoryServices = void 0;
const prisma_1 = __importDefault(require("../../shared/prisma"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const GetCategorysFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield prisma_1.default.category.findMany({
        include: {
            Products: true,
            children: true,
            parent: true
        }
    });
    if (category.length === 0) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "No Category Available");
    }
    return category;
});
const GetCategoryByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const uniqueCategory = yield prisma_1.default.category.findUnique({
        where: {
            id,
        },
    });
    if (uniqueCategory === null) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "No Category Available");
    }
    return uniqueCategory;
});
const CreateCategoryIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = payload;
    const isCategoryExists = yield prisma_1.default.category.findFirst({
        where: { name: name },
    });
    if (isCategoryExists !== null) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Category already exists!");
    }
    const result = yield prisma_1.default.category.create({
        data: payload,
    });
    return result;
});
const UpdateCategoryIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isCategoryExists = yield prisma_1.default.category.findUnique({
        where: {
            id,
        },
    });
    if (isCategoryExists === null) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "No Category Available");
    }
    const result = yield prisma_1.default.category.update({
        where: { id },
        data: payload,
    });
    return result;
});
const DeleteCategoryFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isCategoryExists = yield prisma_1.default.category.findUnique({
        where: {
            id,
        },
    });
    if (isCategoryExists === null) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "No Category Available");
    }
    yield prisma_1.default.category.delete({
        where: { id },
    });
    return null;
});
exports.CategoryServices = {
    GetCategorysFromDB,
    GetCategoryByIdFromDB,
    CreateCategoryIntoDB,
    UpdateCategoryIntoDB,
    DeleteCategoryFromDB,
};

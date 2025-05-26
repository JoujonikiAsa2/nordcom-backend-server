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
exports.NewsletterServices = void 0;
const prisma_1 = __importDefault(require("../../shared/prisma"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const GetNewslettersFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const newsletter = yield prisma_1.default.newsletter.findMany();
    if (newsletter.length === 0) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "No Newsletter Available");
    }
    return newsletter;
});
const GetNewsletterByEmailFromDB = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const uniqueNewsletter = yield prisma_1.default.newsletter.findFirst({
        where: {
            email
        },
    });
    if (uniqueNewsletter === null) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "No Newsletter Available");
    }
    return uniqueNewsletter;
});
const CreateNewsletterIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = payload;
    const isNewsletterExists = yield prisma_1.default.newsletter.findFirst({
        where: {
            email,
        },
    });
    if (isNewsletterExists !== null) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Newsletter already exists!");
    }
    const result = yield prisma_1.default.newsletter.create({
        data: payload,
    });
    return result;
});
const DeleteNewsletterFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isNewsletterExists = yield prisma_1.default.newsletter.findUnique({
        where: {
            id,
        },
    });
    if (isNewsletterExists === null) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "No Newsletter Available");
    }
    yield prisma_1.default.newsletter.delete({
        where: {
            id,
        },
    });
    return null;
});
exports.NewsletterServices = {
    GetNewslettersFromDB,
    GetNewsletterByEmailFromDB,
    CreateNewsletterIntoDB,
    DeleteNewsletterFromDB,
};

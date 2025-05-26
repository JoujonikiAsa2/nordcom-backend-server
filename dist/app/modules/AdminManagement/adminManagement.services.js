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
exports.AdminManagementServices = void 0;
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const http_status_1 = __importDefault(require("http-status"));
const ChangeUserStatusInDB = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(id, status);
    // Check if user exists
    const existingUser = yield prisma_1.default.user.findUnique({
        where: {
            id,
        },
    });
    if (!existingUser)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User Not Found.");
    // Update user status
    const updatedUser = yield prisma_1.default.user.update({
        where: {
            id,
        },
        data: {
            status,
        },
    });
    if (!updatedUser)
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to update user status.");
    return updatedUser;
});
const GetAllUsersFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prisma_1.default.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
        },
    });
    return users;
});
exports.AdminManagementServices = {
    GetAllUsersFromDB,
    ChangeUserStatusInDB,
};

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
exports.UserServices = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const client_1 = require("@prisma/client");
const registerUserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = payload;
    // Check if user already exists
    const user = yield prisma_1.default.user.findUnique({
        where: {
            email,
        },
    });
    if (user)
        throw new ApiError_1.default(http_status_1.default.CONFLICT, "User Already Exists.");
    // Hash password
    const hashedPassword = bcrypt_1.default.hashSync(password, 10);
    const userData = {
        name,
        email,
        password: hashedPassword,
    };
    const result = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        // Create user in DB
        const result = yield prisma.user.create({
            data: userData,
        });
        if (!result)
            throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to create user.");
        // Add user in user_extension table
        const userExtension = yield prisma.user_Extension.create({
            data: {
                userId: result.id,
                email: result.email,
            },
        });
        if (!userExtension)
            throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to create user.");
        return result;
    }));
    if (!result)
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to create user.");
    return {};
});
const updateUserInDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if user already exists
    const existingUser = yield prisma_1.default.user_Extension.findUnique({
        where: {
            email: user.email,
        },
    });
    if (!existingUser)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User Not Found.");
    const updatedUser = yield prisma_1.default.user_Extension.update({
        where: {
            email: user.email,
        },
        data: payload,
    });
    return updatedUser;
});
const getUserProfile = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: {
            id,
            status: client_1.UserStatus.ACTIVE,
        },
        include: {
            User_Extension: true,
        },
    });
    if (!user)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User Not Found.");
    return user;
});
exports.UserServices = {
    registerUserIntoDB,
    updateUserInDB,
    getUserProfile,
};

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
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield prisma_1.default.user.findUnique({
        where: {
            id,
        },
        include: {
            User_Extension: true,
        },
    });
    if (!userInfo)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User Not Found.");
    return userInfo;
});
const getUserProfile = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield prisma_1.default.user.findFirst({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email,
            status: client_1.UserStatus.ACTIVE,
        },
        include: {
            User_Extension: true,
        },
    });
    if (!userInfo)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User Not Found.");
    return userInfo;
});
const getAdminProfile = (email) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    const user = yield prisma_1.default.user.findUnique({
        where: {
            email,
        },
        select: {
            email: true,
            name: true,
            User_Extension: {
                select: {
                    phone: true,
                    address: true,
                    country: true,
                    postalCode: true,
                    bio: true,
                    imageUrl: true,
                },
            },
        },
    });
    if (!user)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User Not Found.");
    return {
        name: user.name,
        email: user.email,
        phone: (_a = user === null || user === void 0 ? void 0 : user.User_Extension) === null || _a === void 0 ? void 0 : _a.phone,
        address: (_b = user === null || user === void 0 ? void 0 : user.User_Extension) === null || _b === void 0 ? void 0 : _b.address,
        country: (_c = user === null || user === void 0 ? void 0 : user.User_Extension) === null || _c === void 0 ? void 0 : _c.country,
        postalCode: (_d = user === null || user === void 0 ? void 0 : user.User_Extension) === null || _d === void 0 ? void 0 : _d.postalCode,
        bio: (_e = user === null || user === void 0 ? void 0 : user.User_Extension) === null || _e === void 0 ? void 0 : _e.bio,
        imageUrl: (_f = user === null || user === void 0 ? void 0 : user.User_Extension) === null || _f === void 0 ? void 0 : _f.imageUrl,
    };
});
const getAllUsersFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findMany({
        select: {
            id: true,
            name: true,
            role: true,
            email: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            User_Extension: {
                select: {
                    phone: true,
                    address: true,
                    country: true,
                    imageUrl: true,
                },
            },
        },
    });
    const modifiedUsers = user.map((user) => {
        var _a, _b, _c, _d;
        return Object.assign(Object.assign({}, user), { phone: (_a = user === null || user === void 0 ? void 0 : user.User_Extension) === null || _a === void 0 ? void 0 : _a.phone, address: (_b = user === null || user === void 0 ? void 0 : user.User_Extension) === null || _b === void 0 ? void 0 : _b.address, country: (_c = user === null || user === void 0 ? void 0 : user.User_Extension) === null || _c === void 0 ? void 0 : _c.country, imageUrl: (_d = user === null || user === void 0 ? void 0 : user.User_Extension) === null || _d === void 0 ? void 0 : _d.imageUrl });
    });
    return modifiedUsers ? modifiedUsers : [];
});
exports.UserServices = {
    registerUserIntoDB,
    updateUserInDB,
    getUserById,
    getUserProfile,
    getAdminProfile,
    getAllUsersFromDB
};

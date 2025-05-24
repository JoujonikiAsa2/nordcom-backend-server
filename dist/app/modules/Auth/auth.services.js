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
exports.AuthServices = void 0;
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const sendEmail_1 = __importDefault(require("../../../Helpers/sendEmail"));
const jwtHelpers_1 = require("../../../Helpers/jwtHelpers");
const config_1 = __importDefault(require("../../../config"));
// new branch created
const prismaWithPassword = new client_1.PrismaClient();
const login = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    const isUserExists = yield prismaWithPassword.user.findUnique({
        where: {
            email,
        },
    });
    if (!isUserExists)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User Not Found.");
    if (isUserExists.status === "BLOCKED")
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "User is Blocked.");
    const isPasswordValid = yield bcrypt_1.default.compare(password, isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.password);
    if (!isPasswordValid)
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid Credentials.");
    const loggedInUser = {
        name: isUserExists.name,
        email: isUserExists.email,
        role: isUserExists.role,
    };
    console.log(loggedInUser);
    return loggedInUser;
});
const forgotPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield prismaWithPassword.user.findUnique({
        where: {
            email,
        },
    });
    if (!isUserExists)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User Not Found.");
    if (isUserExists.status === "BLOCKED")
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "User is Blocked.");
    const generateToken = yield jwtHelpers_1.jwtHelpers.generateToken({
        name: isUserExists.name,
        email: isUserExists.email,
        role: isUserExists.role,
    }, config_1.default.jwt.access_token_secret, "forgotPassword");
    // Set temporary forgot password token in user extension table
    const addForgetPassswordToken = yield prismaWithPassword.user.update({
        where: {
            email: isUserExists.email,
        },
        data: {
            forgotPasswordToken: generateToken,
        },
    });
    // Send email to user with reset password link
    const sendResetPasswordLink = (0, sendEmail_1.default)({
        email: isUserExists.email,
        subject: "Reset Password",
        token: generateToken,
        name: isUserExists.name,
        expiresIn: "1",
    }, "forgotPassword");
    if (!sendResetPasswordLink)
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to send reset password link.");
    const resetLink = `${config_1.default.client_url}/reset-password?token=${generateToken}&email=${email}`;
    return {
        resetLink,
    };
});
const resetPassword = (_a) => __awaiter(void 0, [_a], void 0, function* ({ token, password, }) {
    console.log({
        token,
        password,
    });
    const decodedToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.access_token_secret);
    if (!decodedToken)
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid Token.");
    // console.log("decodedToken", decodedToken);
    const isUserExists = yield prismaWithPassword.user.findUnique({
        where: {
            email: decodedToken.email,
        },
    });
    if (!isUserExists)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User Not Found.");
    if (isUserExists.status === "BLOCKED")
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "User is Blocked.");
    // Check if the token in the database matches the token provided
    const decodedTokenInDataBase = jwtHelpers_1.jwtHelpers.verifyToken(isUserExists.forgotPasswordToken, config_1.default.jwt.access_token_secret);
    if (decodedTokenInDataBase.email !== decodedToken.email) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid Reset Password Token.");
    }
    // Change user password
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    console.log("hashedPassword", hashedPassword);
    const updatedUser = yield prismaWithPassword.user.update({
        where: {
            email: isUserExists.email,
        },
        data: {
            password: hashedPassword,
            forgotPasswordToken: null, // Clear the forgot password token after resetting the password
        },
    });
    if (!updatedUser)
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to reset password.");
    return true;
});
const changePassword = (email) => __awaiter(void 0, void 0, void 0, function* () { });
exports.AuthServices = {
    login,
    forgotPassword,
    resetPassword,
    changePassword,
};

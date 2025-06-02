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
exports.AuthControllers = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const auth_services_1 = require("./auth.services");
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const login = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_services_1.AuthServices.login(req.body);
    let { name, email, role } = result;
    const tokenData = {
        name,
        email,
        role: role.toLowerCase(),
    };
    const accessToken = yield (0, jwtHelpers_1.generateToken)(tokenData, config_1.default.jwt.access_token_secret, "access");
    const refreshToken = yield (0, jwtHelpers_1.generateToken)(tokenData, config_1.default.jwt.refresh_token_secret, "access");
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Logged In Successfully",
        data: Object.assign(Object.assign({}, result), { redirectUrl: `/dashboard/${role.toLowerCase()}/profile`, role: role, accessToken,
            refreshToken }),
    });
}));
const forgotPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_services_1.AuthServices.forgotPassword(req.body.email);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Reset Password Link Sent Successfully",
        data: result,
    });
}));
const changePassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_services_1.AuthServices.changePassword(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Password Changed Successfully",
        data: result,
    });
}));
const resetPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_services_1.AuthServices.resetPassword(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Password Reset Successfully",
        data: result,
    });
}));
exports.AuthControllers = {
    login,
    forgotPassword,
    resetPassword,
    changePassword,
};

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
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config"));
const sendMailText_1 = require("./sendMailText");
const sendMail = (payload, emailType) => __awaiter(void 0, void 0, void 0, function* () {
    console.log({
        email: config_1.default.nodemailer_email,
        password: config_1.default.nodemailer_password,
    });
    const transporter = nodemailer_1.default.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: config_1.default.nodemailer_email,
            pass: config_1.default.nodemailer_password,
        },
    });
    const mailOptions = {
        from: "NordCom",
        to: payload.email,
        subject: payload.subject,
        html: emailType === "payment"
            ? (0, sendMailText_1.paymentVerificationEmailText)(payload)
            : (0, sendMailText_1.forgotPasswordEmailText)(payload),
    };
    try {
        let info = yield transporter.sendMail(mailOptions);
        console.log(info);
        return true;
    }
    catch (error) {
        console.log("Error:", error);
        return false;
    }
});
exports.default = sendMail;

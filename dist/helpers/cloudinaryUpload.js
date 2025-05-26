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
exports.UploadToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const stream_1 = require("stream");
const config_1 = __importDefault(require("../config"));
cloudinary_1.v2.config({
    cloud_name: config_1.default.cloudinary.cloud_name,
    api_key: config_1.default.cloudinary.api_key,
    api_secret: config_1.default.cloudinary.api_secret, // Click 'View API Keys' above to copy your API secret
});
const UploadToCloudinary = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        // console.log({ body: req.body, file: req.file });
        const buffer = (_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer;
        // console.log("req body 1", buffer);
        if (req.body.data) {
            req.body = JSON.parse(req.body.data);
        }
        // console.log("req body", req.body);
        return new Promise((res, rej) => {
            var _a;
            if (buffer) {
                const theTransformStream = cloudinary_1.v2.uploader.upload_stream({
                    public_id: (_a = req.file) === null || _a === void 0 ? void 0 : _a.originalname,
                    resource_type: "auto",
                }, (err, result) => {
                    if (err)
                        return rej(err);
                    if (result) {
                        req.body.imageUrl = result === null || result === void 0 ? void 0 : result.secure_url;
                        // console.log("req body", req.body);
                        next();
                    }
                });
                const stream = stream_1.Readable.from(buffer).pipe(theTransformStream);
                // console.log("body", req.body);
            }
            else {
                next();
            }
        });
    });
};
exports.UploadToCloudinary = UploadToCloudinary;

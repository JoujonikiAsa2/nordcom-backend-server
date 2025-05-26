"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pick = void 0;
const pick = (obj, key) => {
    const filteredObj = {};
    key.forEach((key) => {
        if (obj && obj.hasOwnProperty.call(obj, key)) {
            filteredObj[key] = obj[key];
        }
    });
    return filteredObj;
};
exports.pick = pick;

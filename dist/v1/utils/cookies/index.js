"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCookies = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// to delete the cookies from the response
const deleteCookies = (res, ...cookies) => {
    try {
        // now traverse in the cookies and clear the cookies
        cookies.forEach(cookieName => {
            var _a;
            res.clearCookie(cookieName, {
                // provide options
                path: ((_a = process.env) === null || _a === void 0 ? void 0 : _a.COOKIE_PATH) || '/',
            });
        });
    }
    catch (error) {
        throw new Error("Something went wrong while deleting cookies");
    }
};
exports.deleteCookies = deleteCookies;

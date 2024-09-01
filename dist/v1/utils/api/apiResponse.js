"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterUserObject = void 0;
const constants_1 = require("../secure/constants");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// to send the response
const apiResponse = ({ response, statusCode, message, data, error, user, info }) => {
    // to store the fullName to send as response in json
    let userFullName;
    // when data exists then only inject cookies
    if (data) {
        // removing fullName from the response as it is not required in cookies
        if ('fullName' in data) {
            userFullName = data.fullName;
            const { fullName } = data, dataWithoutName = __rest(data, ["fullName"]);
            data = dataWithoutName;
        }
        // Set data as cookies and insert in the response
        Object.entries(data).forEach(([key, value]) => {
            var _a;
            response.cookie(key, value, {
                httpOnly: true,
                maxAge: constants_1.COOKIE_AGE,
                secure: true,
                signed: true,
                path: ((_a = process.env) === null || _a === void 0 ? void 0 : _a.COOKIE_PATH) || '/', // update the path in future
            });
        });
    }
    // filtering user, removing non required fields like password, needed when updating user and only sending required fields
    let filteredUserObject;
    if (user) {
        if (data)
            filteredUserObject = filterUserObject(user, data.accessToken);
        else
            filteredUserObject = filterUserObject(user);
        return response.status(statusCode).json({ statusCode, message, data, error, user: filteredUserObject, info });
    }
    // send the response also with json
    return response.status(statusCode).json({ statusCode, message, data, error, user: userFullName && Object.assign({ fullName: userFullName }, data), info });
};
// filter the user object to only send required fields
const filterUserObject = (user, accessToken) => {
    const filteredUserObject = {
        fullName: user.fullName,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        accessToken: accessToken
    };
    if ((user === null || user === void 0 ? void 0 : user.refreshToken) && accessToken)
        filteredUserObject.refreshToken = user === null || user === void 0 ? void 0 : user.refreshToken;
    return filteredUserObject;
};
exports.filterUserObject = filterUserObject;
// exporting the response method
exports.default = apiResponse;

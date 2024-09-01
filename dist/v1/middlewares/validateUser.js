"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchLoggedinUserViaRefreshToken = fetchLoggedinUserViaRefreshToken;
exports.fetchLoggedinUserViaAccessToken = fetchLoggedinUserViaAccessToken;
const apiResponse_1 = __importDefault(require("../utils/api/apiResponse"));
const statusCodes_1 = __importDefault(require("../../statusCodes"));
const tokens_1 = require("../utils/secure/tokens");
// to fetch the user id from the refresh token
function fetchLoggedinUserViaRefreshToken(req, res, next) {
    var _a;
    try {
        // fetch the token from the cookie or from the headers, we are fetching token from the headers in multiple ways because the headers are case-insensitive
        const refreshToken = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken) || req.headers["refreshToken"] || req.headers['refreshtoken'];
        if (!refreshToken)
            return (0, apiResponse_1.default)({ response: res, statusCode: statusCodes_1.default.NotFound, message: "Authentication token is missing" });
        // now, validate the token and embed the userId inside the request
        const payloadData = (0, tokens_1.verifyToken)({ authToken: refreshToken, tokenType: tokens_1.PossibleTokenTypes.REFRESH_TOKEN });
        if (!payloadData)
            return (0, apiResponse_1.default)({ response: res, statusCode: statusCodes_1.default.Unauthorized, message: 'Token Verification failed' });
        // embed userId and refreshToken in the request
        req.userId = payloadData.user.id;
        req.refreshToken = refreshToken;
        return next();
    }
    catch (error) {
        // Handle specific token verification errors
        if (error instanceof Error) {
            let errorMessage = error.message || 'Token verification failed';
            if (error.message.includes('expired')) {
                errorMessage = 'Refresh token expired. Please log in again.';
            }
            return (0, apiResponse_1.default)({ response: res, statusCode: statusCodes_1.default.Unauthorized, message: errorMessage });
        }
        // Handle other unrecognized errors
        return (0, apiResponse_1.default)({ response: res, statusCode: statusCodes_1.default.InternalServerError, message: "Something went wrong while validating auth token", error });
    }
}
// to fetch the user id from the access token
function fetchLoggedinUserViaAccessToken(req, res, next) {
    var _a;
    try {
        // fetch the token from the cookie or from the headers, we are fetching token from the headers in multiple ways because the headers are case-insensitive
        const accessToken = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken) || req.headers["accessToken"] || req.headers["accesstoken"];
        if (!accessToken)
            return (0, apiResponse_1.default)({ response: res, statusCode: statusCodes_1.default.NotFound, message: "Authentication token is missing" });
        // now, validate the token and embed the userId inside the request
        const payloadData = (0, tokens_1.verifyToken)({ authToken: accessToken, tokenType: tokens_1.PossibleTokenTypes.ACCESS_TOKEN });
        if (!payloadData)
            return (0, apiResponse_1.default)({ response: res, statusCode: statusCodes_1.default.Unauthorized, message: 'Token Verification failed' });
        // embed userId and accessToken in the request
        req.userId = payloadData.user.id;
        req.accessToken = accessToken;
        return next();
    }
    catch (error) {
        // Handle specific token verification errors
        if (error instanceof Error) {
            let errorMessage = error.message || 'Token verification failed';
            if (error.message.includes('expired')) {
                errorMessage = 'Access token expired. Please log in again.';
            }
            return (0, apiResponse_1.default)({ response: res, statusCode: statusCodes_1.default.Unauthorized, message: errorMessage });
        }
        // Handle other unrecognized errors
        return (0, apiResponse_1.default)({ response: res, statusCode: statusCodes_1.default.InternalServerError, message: "Something went wrong while validating auth token", error });
    }
}

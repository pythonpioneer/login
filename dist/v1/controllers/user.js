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
exports.updateUserPassword = exports.updateUserInformation = exports.deleteUser = exports.loginViaTokens = exports.getCurrentUser = exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
const User_1 = require("../models/User");
const tokens_1 = require("../utils/secure/tokens");
const apiResponse_1 = __importDefault(require("../utils/api/apiResponse"));
const statusCodes_1 = __importDefault(require("../../statusCodes"));
const password_1 = require("../utils/secure/password");
const cookies_1 = require("../utils/cookies");
// to create a new users or register users (token not required)
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // fetching the data from the request body
        const { fullName, password } = req.body;
        const email = req.body.email.toLowerCase();
        // check that the email is unique
        const existingUser = yield User_1.User.findOne({ email });
        if (existingUser)
            return (0, apiResponse_1.default)({ response: res, statusCode: statusCodes_1.default.Conflict, message: "User Already exists with this email" });
        // now, create a new user with these provided data
        const user = yield User_1.User.create({
            email,
            password, // password is hashed by pre-hooks inside schema
            fullName
        });
        // now, sending user id as payload in the authentication token
        const payloadData = {
            user: {
                id: user.id
            }
        };
        // generate the authentication token
        const accessToken = (0, tokens_1.generateToken)({ payloadData, tokenType: tokens_1.PossibleTokenTypes.ACCESS_TOKEN });
        const refreshToken = (0, tokens_1.generateToken)({ payloadData, tokenType: tokens_1.PossibleTokenTypes.REFRESH_TOKEN });
        // if user not created or something went wrong while creating user
        if (!user)
            return (0, apiResponse_1.default)({ response: res, statusCode: statusCodes_1.default.BadRequest, message: "User Not Created" });
        // now save the token inside the user model
        user.refreshToken = refreshToken;
        user.save({ validateBeforeSave: false });
        // user's information 
        const data = {
            accessToken,
            refreshToken,
            fullName,
        };
        // user created successfully
        return (0, apiResponse_1.default)({ response: res, statusCode: statusCodes_1.default.OK, message: "User Created Successfully", data });
    }
    catch (error) {
        // Type assertion to handle MongoDB duplicate key error
        if ((error === null || error === void 0 ? void 0 : error.code) === 11000) {
            // Duplicate key error (e.g., email already exists)
            return (0, apiResponse_1.default)({ response: res, statusCode: statusCodes_1.default.BadRequest, message: "User Not Created", error });
        }
        // other unrecogonized errors
        return (0, apiResponse_1.default)({ response: res, statusCode: statusCodes_1.default.InternalServerError, message: "Internal Server Error", error });
    }
});
exports.registerUser = registerUser;
// to login users through email and password (token not required)
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // fetching data from request body and cookies
        const { email, password } = req.body;
        // now find the user, if user not exist, then login is not possible
        const user = yield User_1.User.findOne({ email });
        if (!user)
            return (0, apiResponse_1.default)({ response: res, statusCode: statusCodes_1.default.NotFound, message: "User with this Email does not exist." });
        // compare the user password
        const isPasswordMatched = yield (0, password_1.comparePassword)(password, user.password);
        if (!isPasswordMatched)
            return (0, apiResponse_1.default)({ response: res, statusCode: statusCodes_1.default.Unauthorized, message: "Invalid Credentials" });
        // payload for tokens
        const payloadData = {
            user: {
                id: user.id,
            }
        };
        // after successfull login, generate new tokens and give it to the client
        const accessToken = (0, tokens_1.generateToken)({ payloadData, tokenType: tokens_1.PossibleTokenTypes.ACCESS_TOKEN });
        const refreshToken = (0, tokens_1.generateToken)({ payloadData, tokenType: tokens_1.PossibleTokenTypes.REFRESH_TOKEN });
        user.refreshToken = refreshToken;
        user.save({ validateBeforeSave: false });
        // user's information 
        const data = {
            accessToken,
            refreshToken,
            fullName: user.fullName
        };
        // user logged in successfully
        return (0, apiResponse_1.default)({ response: res, statusCode: statusCodes_1.default.OK, message: "User Logged in Successfully", data });
    }
    catch (error) {
        // other unrecogonized errors
        return (0, apiResponse_1.default)({ response: res, statusCode: statusCodes_1.default.InternalServerError, message: "Internal Server Error", error });
    }
});
exports.loginUser = loginUser;
// to logout the user, only refresh token required (refresh token required)
const logoutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // fetching user information from request and fetch the user
        const userId = req.userId;
        const refreshToken = req.refreshToken;
        const user = yield User_1.User.findById(userId);
        if (!user)
            return (0, apiResponse_1.default)({ response: res, statusCode: statusCodes_1.default.NotFound, message: "User Not Found" });
        // user already logged out
        if (!user.refreshToken)
            return (0, apiResponse_1.default)({ response: res, statusCode: statusCodes_1.default.OK, message: "User Already logged out" });
        if (user.refreshToken !== refreshToken)
            return (0, apiResponse_1.default)({ response: res, statusCode: statusCodes_1.default.Forbidden, message: "Not allowed to logout" });
        // now, clear the tokens
        user.refreshToken = null;
        yield user.save({ validateBeforeSave: false });
        // now, delete unnecessary cookies
        (0, cookies_1.deleteCookies)(res, 'refreshToken', 'accessToken');
        return (0, apiResponse_1.default)({ response: res, statusCode: statusCodes_1.default.OK, message: "User logged out Successfully!" });
    }
    catch (error) {
        // other unrecogonized errors
        return (0, apiResponse_1.default)({ response: res, statusCode: statusCodes_1.default.InternalServerError, message: "Internal Server Error", error });
    }
});
exports.logoutUser = logoutUser;
// to fetch the logged in user details (access token required)
const getCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // fetching user information from request and fetch the user
        const userId = req.userId;
        const user = yield ((_a = User_1.User.findById(userId)) === null || _a === void 0 ? void 0 : _a.select('-password'));
        if (!user)
            return (0, apiResponse_1.default)({ response: res, statusCode: statusCodes_1.default.NotFound, message: "User Not Found" });
        // if user is logged in
        if (!user.refreshToken)
            return (0, apiResponse_1.default)({ response: res, statusCode: statusCodes_1.default.Forbidden, message: "Login To fetch user information." });
        // now, send the user
        return (0, apiResponse_1.default)({ response: res, statusCode: statusCodes_1.default.OK, message: "User Found", user });
    }
    catch (error) {
        // other unrecogonized errors
        return (0, apiResponse_1.default)({ response: res, statusCode: statusCodes_1.default.InternalServerError, message: "Internal Server Error", error });
    }
});
exports.getCurrentUser = getCurrentUser;
// to login through refresh token (refresh token required)
const loginViaTokens = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // fetching user information from request and fetch the user
        const userId = req.userId;
        const refreshToken = req.refreshToken;
        const user = yield User_1.User.findById(userId);
        if (!user)
            return (0, apiResponse_1.default)({ response: res, statusCode: statusCodes_1.default.NotFound, message: "User Not Found" });
        // now, check and match the refresh token
        if (!user.refreshToken)
            return (0, apiResponse_1.default)({ response: res, statusCode: statusCodes_1.default.Unauthorized, message: "Please login by providing credentials" });
        if (user.refreshToken !== refreshToken)
            return (0, apiResponse_1.default)({ response: res, statusCode: statusCodes_1.default.Unauthorized, message: "Please login by providing credentials" });
        // payload for tokens and generate a new access token
        const payloadData = {
            user: {
                id: user.id,
            }
        };
        const accessToken = (0, tokens_1.generateToken)({ payloadData, tokenType: tokens_1.PossibleTokenTypes.ACCESS_TOKEN });
        // user's information
        const data = {
            accessToken,
            refreshToken,
            fullName: user.fullName,
        };
        // user logged in successfully
        return (0, apiResponse_1.default)({ response: res, statusCode: statusCodes_1.default.OK, message: "User Logged in Successfully", data });
    }
    catch (error) {
        // other unrecogonized errors
        return (0, apiResponse_1.default)({ response: res, statusCode: statusCodes_1.default.InternalServerError, message: "Internal Server Error", error });
    }
});
exports.loginViaTokens = loginViaTokens;
// to delete the existing user (refresh token required)
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // fetch data from the request body
        const userId = req === null || req === void 0 ? void 0 : req.userId;
        const password = (_a = req.body) === null || _a === void 0 ? void 0 : _a.password;
        const refreshToken = req.refreshToken;
        // fetch the user info
        const user = yield User_1.User.findById(userId);
        if (!user)
            return (0, apiResponse_1.default)({ response: res, statusCode: statusCodes_1.default.NotFound, message: "User Not Found" });
        // now, check and match the refresh token, so no old tokens can access the delete request
        if (!user.refreshToken)
            return (0, apiResponse_1.default)({ response: res, statusCode: statusCodes_1.default.Unauthorized, message: "Please login by providing credentials" });
        if (user.refreshToken !== refreshToken)
            return (0, apiResponse_1.default)({ response: res, statusCode: statusCodes_1.default.Unauthorized, message: "Please login by providing credentials" });
        // compare the user password
        const isPasswordMatched = yield (0, password_1.comparePassword)(password, user.password);
        if (!isPasswordMatched)
            return (0, apiResponse_1.default)({ response: res, statusCode: statusCodes_1.default.Unauthorized, message: "Invalid Credentials" });
        // now, delete unnecessary cookies
        (0, cookies_1.deleteCookies)(res, 'accessToken', 'refreshToken');
        // now, delete the user
        const deletedUser = yield User_1.User.findByIdAndDelete(userId).select('-password -refreshToken');
        if (!deletedUser)
            return (0, apiResponse_1.default)({ response: res, statusCode: statusCodes_1.default.NotFound, message: "User not found during deletion" });
        // user deleted successfully
        return (0, apiResponse_1.default)({ response: res, statusCode: statusCodes_1.default.OK, message: "User Deleted Successfully", user: deletedUser });
    }
    catch (error) {
        // other unrecogonized errors
        return (0, apiResponse_1.default)({ response: res, statusCode: statusCodes_1.default.InternalServerError, message: "Internal Server Error", error });
    }
});
exports.deleteUser = deleteUser;
// to update the user information (access token required)
const updateUserInformation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // fetching data from request body
        const userId = req === null || req === void 0 ? void 0 : req.userId;
        const { email, fullName } = req.body;
        // fetch the user info
        const user = yield User_1.User.findById(userId);
        if (!user)
            return (0, apiResponse_1.default)({ response: res, statusCode: statusCodes_1.default.NotFound, message: "User Not Found" });
        // check that the user is still logged in
        if (!(user === null || user === void 0 ? void 0 : user.refreshToken))
            return (0, apiResponse_1.default)({ response: res, statusCode: statusCodes_1.default.Forbidden, message: "Please login by providing credentials" });
        // now, create the new user object with updated fields
        const updatedUserInfo = {};
        if (email) {
            // if the given email already exists
            const userWithGivenEmail = yield User_1.User.findOne({ email });
            if (userWithGivenEmail)
                return (0, apiResponse_1.default)({ response: res, statusCode: statusCodes_1.default.Conflict, message: "User with this email already exists" });
            // if user with this email doesn't exist
            updatedUserInfo["email"] = email;
        }
        if (fullName)
            updatedUserInfo["fullName"] = fullName;
        // when there is nothing to update
        const isUpdatedUserInfoEmpty = Object.keys(updatedUserInfo).length === 0;
        if (isUpdatedUserInfoEmpty)
            return (0, apiResponse_1.default)({ response: res, statusCode: statusCodes_1.default.UnprocessableEntity, message: "There is nothing to update" });
        // now, update the user
        const updatedUser = yield User_1.User.findByIdAndUpdate(userId, { $set: updatedUserInfo }, { new: true });
        if (!updatedUser)
            return (0, apiResponse_1.default)({ response: res, statusCode: statusCodes_1.default.InternalServerError, message: "User not updated" });
        // user updated successfully
        return (0, apiResponse_1.default)({ response: res, statusCode: statusCodes_1.default.OK, message: "User updated successfully", user: updatedUser });
    }
    catch (error) {
        // other unrecogonized errors
        return (0, apiResponse_1.default)({ response: res, statusCode: statusCodes_1.default.InternalServerError, message: "Internal Server Error", error });
    }
});
exports.updateUserInformation = updateUserInformation;
// to update the user password (refresh token required)
const updateUserPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // fetching data from request body
        const userId = req === null || req === void 0 ? void 0 : req.userId;
        const { password } = req.body;
        const refreshToken = req.refreshToken;
        // fetch the user info
        const user = yield User_1.User.findById(userId);
        if (!user)
            return (0, apiResponse_1.default)({ response: res, statusCode: statusCodes_1.default.NotFound, message: "User Not Found" });
        // now, check and match the refresh token, so no old tokens can access the delete request
        if (!user.refreshToken)
            return (0, apiResponse_1.default)({ response: res, statusCode: statusCodes_1.default.Forbidden, message: "Please login by providing credentials" });
        if (user.refreshToken !== refreshToken)
            return (0, apiResponse_1.default)({ response: res, statusCode: statusCodes_1.default.Forbidden, message: "Please login by providing credentials" });
        // now, create the new user object with updated fields, hashing the password using pre-hooks in mongoose-models
        // `save prehook` only get triggered when we use `save` method on the model to update the password/data
        const updatedUserInfo = { password };
        // when there is nothing to update, this code will not execute because this case is already handled by validation middlewares
        const isUpdatedUserInfoEmpty = Object.keys(updatedUserInfo).length === 0;
        if (isUpdatedUserInfoEmpty)
            return (0, apiResponse_1.default)({ response: res, statusCode: statusCodes_1.default.UnprocessableEntity, message: "There is nothing to update" });
        // now, update the user, using save method
        user.password = password;
        user.save();
        // user updated successfully
        return (0, apiResponse_1.default)({ response: res, statusCode: statusCodes_1.default.OK, message: "User's password updated successfully" });
    }
    catch (error) {
        // other unrecogonized errors
        return (0, apiResponse_1.default)({ response: res, statusCode: statusCodes_1.default.InternalServerError, message: "Internal Server Error", error });
    }
});
exports.updateUserPassword = updateUserPassword;

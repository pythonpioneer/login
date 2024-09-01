"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// importing requirements
const express_1 = __importDefault(require("express"));
const validationMiddleware_1 = __importStar(require("../middlewares/validationMiddleware"));
const user_1 = require("../validationSchema/user");
const user_2 = require("../controllers/user");
const validateUser_1 = require("../middlewares/validateUser");
// creating router for the routes
const router = express_1.default.Router();
// Route 1: To create an user: '/api/v1/user/register' [using POST] (login not required) (Token not required)
router.post('/register', (0, validationMiddleware_1.default)(user_1.registrationSchema, validationMiddleware_1.RequestData.BODY), user_2.registerUser);
// Route 2: To login an existing user: '/api/v1/user/login' [using POST] (login not required) (Token not required)
router.post('/login', (0, validationMiddleware_1.default)(user_1.loginSchema, validationMiddleware_1.RequestData.BODY), user_2.loginUser);
// Route 3: To logout the existing users: '/api/v1/user/logout' [using POST] (login required) (Refresh Token required)
router.post('/logout', validateUser_1.fetchLoggedinUserViaRefreshToken, user_2.logoutUser);
// Route 4: To delete the existing user: '/api/v1/user/' [using DELETE] (login required) 
router.delete('/', (0, validationMiddleware_1.default)(user_1.passwordValidationSchema, validationMiddleware_1.RequestData.BODY), validateUser_1.fetchLoggedinUserViaRefreshToken, user_2.deleteUser);
// Route 5: To get the details of the current user: '/api/v1/user/' [using GET] (login required) (Access Token required)
router.get('/', validateUser_1.fetchLoggedinUserViaAccessToken, user_2.getCurrentUser);
// Route 6: To login through tokens: '/api/v1/user/fast-login' [using GET] (login not required) (Refresh Token required)
router.post('/fast-login', validateUser_1.fetchLoggedinUserViaRefreshToken, user_2.loginViaTokens);
// Route 7: To update the user information (except password): '/api/v1/user/' [using PUT] (login required) (Access Token required)
router.put('/', (0, validationMiddleware_1.default)(user_1.updateUserInfoSchema, validationMiddleware_1.RequestData.BODY), validateUser_1.fetchLoggedinUserViaAccessToken, user_2.updateUserInformation);
// Route 8: To update the user password: '/api/v1/user/password' [using PATCH] (login required) (Refresh Token required)
router.patch('/password', (0, validationMiddleware_1.default)(user_1.passwordValidationSchema, validationMiddleware_1.RequestData.BODY), validateUser_1.fetchLoggedinUserViaRefreshToken, user_2.updateUserPassword);
// exporting the router object
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PossibleTokenTypes = exports.verifyToken = exports.generateToken = void 0;
// importing all requirements
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const constants_1 = require("./constants");
dotenv_1.default.config();
// to generate the auth token, and putting the data inside the token
const generateToken = ({ payloadData, tokenType = PossibleTokenTypes.ACCESS_TOKEN }) => {
    var _a, _b;
    try {
        // determing the signature based on the token type
        const SIGNATURE = (tokenType === PossibleTokenTypes.ACCESS_TOKEN) ? (_a = process.env) === null || _a === void 0 ? void 0 : _a.ACCESS_TOKEN_SIGNATURE : (_b = process.env) === null || _b === void 0 ? void 0 : _b.REFRESH_TOKEN_SIGNATURE;
        if (!SIGNATURE)
            throw new Error(`Signature is missing, while generating ${tokenType}.`);
        // determine the expiration time based on the token type
        const tokenAge = (tokenType === PossibleTokenTypes.ACCESS_TOKEN) ? constants_1.ACCESS_TOKEN_AGE : constants_1.REFRESH_TOKEN_AGE;
        const authToken = jsonwebtoken_1.default.sign(payloadData, SIGNATURE, { expiresIn: tokenAge });
        return authToken;
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Token generation failed: ${error.message || 'UNKNOWN'}`);
        }
        else {
            throw new Error('Token generation failed: UNKNOWN');
        }
    }
};
exports.generateToken = generateToken;
// to verify the generated token, and the data inside the token
const verifyToken = ({ authToken, tokenType = PossibleTokenTypes.ACCESS_TOKEN }) => {
    var _a, _b;
    // determing the signature based on the token type
    const SIGNATURE = (tokenType === PossibleTokenTypes.ACCESS_TOKEN) ? (_a = process.env) === null || _a === void 0 ? void 0 : _a.ACCESS_TOKEN_SIGNATURE : (_b = process.env) === null || _b === void 0 ? void 0 : _b.REFRESH_TOKEN_SIGNATURE;
    if (!SIGNATURE)
        throw new Error(`Signature is missing, while verifying the ${tokenType}.`);
    try {
        const decoded = jsonwebtoken_1.default.verify(authToken, SIGNATURE);
        return decoded;
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Token verification failed: ${error.message || 'UNKNOWN'}`);
        }
        else {
            throw new Error('Token verification failed: UNKNOWN');
        }
    }
};
exports.verifyToken = verifyToken;
// token types and constants
var PossibleTokenTypes;
(function (PossibleTokenTypes) {
    PossibleTokenTypes["ACCESS_TOKEN"] = "ACCESS_TOKEN";
    PossibleTokenTypes["REFRESH_TOKEN"] = "REFRESH_TOKEN";
})(PossibleTokenTypes || (exports.PossibleTokenTypes = PossibleTokenTypes = {}));

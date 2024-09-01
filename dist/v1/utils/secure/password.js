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
exports.comparePassword = exports.generatePassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
/**
 * This function generate the hash of given password
 * @param {String} password - It takes password as a plain text
 * @returns {String} - It return a hash password
 */
const generatePassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const SALT_ROUNDS = Number((_a = process.env) === null || _a === void 0 ? void 0 : _a.SALT_ROUNDS) || 13;
        const salt = yield bcryptjs_1.default.genSalt(SALT_ROUNDS);
        const securePassword = yield bcryptjs_1.default.hash(password, salt);
        return securePassword;
    }
    catch (error) {
        throw new Error(`Error generating password: ${error || 'UNKNOWN'}`);
    }
});
exports.generatePassword = generatePassword;
/**
 *  This funtion compare the hashed passwords using bcrypt
 * @param {String} currentPassword - It takes the non-hashed pssword or a simple text
 * @param {String} actualPassword - It takes the hashed password
 * @returns {Boolean} - It returns true, if password mathches else false
 * */
const comparePassword = (currentPassword, actualPassword) => __awaiter(void 0, void 0, void 0, function* () {
    if (!currentPassword || !actualPassword)
        throw new Error('All Fields are required');
    return bcryptjs_1.default.compareSync(currentPassword, actualPassword);
});
exports.comparePassword = comparePassword;

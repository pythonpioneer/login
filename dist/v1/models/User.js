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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const user_1 = require("../constants/user");
const password_1 = require("../utils/secure/password");
// destructuring all fields restrictions
const { emailMaxLength, passwordMinLength, passwordMaxLength, fullNameMinLength, fullNameMaxLength } = user_1.USER_FIELD_LENGTH_RESTRICTIONS;
// creating schema for user model
const UserSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [user_1.EMAIL_REGEX, 'Use a valid Email address.'],
        max: [emailMaxLength, `Email length can not be longer than ${emailMaxLength} characters.`]
    },
    password: {
        type: String,
        required: true,
        trim: true,
        match: [user_1.PASSWORD_REGEX, 'Use a valid Password.'],
        min: [passwordMinLength, `Password must be atleast ${passwordMinLength} characters long.`],
        max: [passwordMaxLength, `Password can not be longer than ${passwordMaxLength} characters.`]
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        min: [fullNameMinLength, `FullName must be atleast ${fullNameMinLength} character long.`],
        max: [fullNameMaxLength, `FullName can not be longer than ${fullNameMaxLength} characters.`]
    },
    refreshToken: {
        type: String,
        default: null,
    }
}, { timestamps: true });
// implementing hooks to encrypt password just before saving the password inside the database
UserSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // `this` is the Mongoose document
        const user = this;
        // If the password is not modified, proceed to the next middleware
        if (!user.isModified('password'))
            return next();
        try {
            // If user set a new password or modified the password, encrypt it
            user.password = yield (0, password_1.generatePassword)(user.password);
            next();
        }
        catch (err) {
            if (err instanceof Error)
                next(err);
            else
                next();
        }
    });
});
// export the user model
const User = mongoose_1.default.model('User', UserSchema);
exports.User = User;

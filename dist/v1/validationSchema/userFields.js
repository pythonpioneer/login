"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordValidation = exports.emailValidation = exports.fullNameValidation = void 0;
const zod_1 = require("zod");
const user_1 = require("../constants/user");
// destructuring all fields restrictions
const { emailMaxLength, passwordMinLength, passwordMaxLength, fullNameMinLength, fullNameMaxLength } = user_1.USER_FIELD_LENGTH_RESTRICTIONS;
// validating user's fullName
const fullNameValidation = zod_1.z
    .string()
    .trim()
    .min(fullNameMinLength, { message: `FullName must be atleast ${fullNameMinLength} character long.` })
    .max(fullNameMaxLength, { message: `FullName can not be longer than ${fullNameMaxLength} characters.` });
exports.fullNameValidation = fullNameValidation;
// validating user's email address
const emailValidation = zod_1.z
    .string()
    .trim()
    .toLowerCase()
    .regex(user_1.EMAIL_REGEX, { message: `Use a Valid Email Address.` })
    .max(emailMaxLength, { message: `Email length can not be longer than ${emailMaxLength} characters.` });
exports.emailValidation = emailValidation;
// validating user's password
const passwordValidation = zod_1.z
    .string()
    .trim()
    .regex(user_1.PASSWORD_REGEX, { message: `Use a valid Password.` })
    .min(passwordMinLength, { message: `Password must be atleast ${passwordMinLength} characters long.` })
    .max(passwordMaxLength, { message: `Password can not be longer than ${passwordMaxLength} characters.` });
exports.passwordValidation = passwordValidation;

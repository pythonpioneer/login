"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordValidationSchema = exports.updateUserInfoSchema = exports.loginSchema = exports.registrationSchema = void 0;
const zod_1 = require("zod");
const userFields_1 = require("./userFields");
// creating a validation schema for user registration
const registrationSchema = zod_1.z.object({
    fullName: userFields_1.fullNameValidation,
    email: userFields_1.emailValidation,
    password: userFields_1.passwordValidation,
});
exports.registrationSchema = registrationSchema;
// creating a validation schema to login the user
const loginSchema = zod_1.z.object({
    email: userFields_1.emailValidation,
    password: userFields_1.passwordValidation,
});
exports.loginSchema = loginSchema;
// validation schema to update the user information
const updateUserInfoSchema = zod_1.z.object({
    fullName: userFields_1.fullNameValidation.optional(),
    email: userFields_1.emailValidation.optional(),
});
exports.updateUserInfoSchema = updateUserInfoSchema;
// schema to validate the password
const passwordValidationSchema = zod_1.z.object({
    password: userFields_1.passwordValidation
});
exports.passwordValidationSchema = passwordValidationSchema;

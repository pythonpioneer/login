import { z } from "zod";
import { emailRegex, passwordRegex, userFieldLengthRestrictions } from "../constants/user";

// destructuring all fields restrictions
const { emailMaxLength, passwordMinLength, passwordMaxLength, fullNameMinLength, fullNameMaxLength } = userFieldLengthRestrictions;


// validating user's fullName
const fullNameValidation = z
    .string()
    .trim()
    .min(fullNameMinLength, { message: `FullName must be atleast ${fullNameMinLength} character long.` })
    .max(fullNameMaxLength, { message: `FullName can not be longer than ${fullNameMaxLength} characters.` });

// validating user's email address
const emailValidation = z
    .string()
    .trim()
    .toLowerCase()
    .regex(emailRegex, { message: `Use a Valid Email Address.` })
    .max(emailMaxLength, { message: `Email length can not be longer than ${emailMaxLength} characters.` });

// validating user's password
const passwordValidation = z
    .string()
    .trim()
    .regex(passwordRegex, { message: `Use a valid Password.` })
    .min(passwordMinLength, { message: `Password must be atleast ${passwordMinLength} characters long.` })
    .max(passwordMaxLength, { message: `Password can not be longer than ${passwordMaxLength} characters.` });

// exporting all the validation rules
export { fullNameValidation, emailValidation, passwordValidation };
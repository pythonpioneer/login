import { z } from "zod";
import { emailValidation, fullNameValidation, passwordValidation } from "./userFields";


// creating a validation schema for user registration
const registrationSchema = z.object({
    fullName: fullNameValidation,
    email: emailValidation,
    password: passwordValidation,
});

// creating a validation schema to login the user
const loginSchema = z.object({
    email: emailValidation,
    password: passwordValidation,
});

// export schemas
export { registrationSchema, loginSchema };
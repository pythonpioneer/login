import mongoose, { Schema } from "mongoose";
import { IUser } from "./interfaces";
import { emailRegex, passwordRegex, userFieldLengthRestrictions } from "../constants/user";

// destructuring all fields restrictions
const { emailMaxLength, passwordMinLength, passwordMaxLength, fullNameMinLength, fullNameMaxLength } = userFieldLengthRestrictions;


// creating schema for user model
const UserSchema: Schema<IUser> = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [emailRegex, 'Please use a valid Email address.'],
        max: [emailMaxLength, `Email length can not be longer than ${emailMaxLength} characters.`]
    }, 
    password: {
        type: String,
        required: true,
        trim: true,
        match: [passwordRegex, 'Please use a valid Password.'],
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
});

// export the user model
const User = mongoose.model<IUser>('user', UserSchema);
export { User }
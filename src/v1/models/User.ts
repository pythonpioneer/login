import mongoose, { Schema } from "mongoose";
import { IUser } from "./interfaces";
import { EMAIL_REGEX, PASSWORD_REGEX, USER_FIELD_LENGTH_RESTRICTIONS } from "../constants/user";
import { generatePassword } from "../utils/secure/password";

// destructuring all fields restrictions
const { emailMaxLength, passwordMinLength, passwordMaxLength, fullNameMinLength, fullNameMaxLength } = USER_FIELD_LENGTH_RESTRICTIONS;


// creating schema for user model
const UserSchema: Schema<IUser> = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [EMAIL_REGEX, 'Use a valid Email address.'],
        max: [emailMaxLength, `Email length can not be longer than ${emailMaxLength} characters.`]
    },
    password: {
        type: String,
        required: true,
        trim: true,
        match: [PASSWORD_REGEX, 'Use a valid Password.'],
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
UserSchema.pre<IUser>("save", async function (next) {

    // `this` is the Mongoose document
    const user = this;

    // If the password is not modified, proceed to the next middleware
    if (!user.isModified('password')) return next();

    try {
        // If user set a new password or modified the password, encrypt it
        user.password = await generatePassword(user.password);
        next(); 
    } catch (err) {
        if (err instanceof Error)
            next(err);
        else next();
    }
});

// export the user model
const User = mongoose.model<IUser>('User', UserSchema);
export { User }
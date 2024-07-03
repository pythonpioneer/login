import mongoose, { Schema } from "mongoose";
import { IUser } from "./interfaces";
import { emailRegex, passwordRegex, userFieldLengthRestrictions } from "../constants/user";
import { generatePassword } from "../utils/secure/password";

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
        match: [ emailRegex, 'Use a valid Email address.' ],
        max: [ emailMaxLength, `Email length can not be longer than ${emailMaxLength} characters.` ]
    }, 
    password: {
        type: String,
        required: true,
        trim: true,
        match: [ passwordRegex, 'Use a valid Password.' ],
        min: [ passwordMinLength, `Password must be atleast ${passwordMinLength} characters long.` ],
        max: [ passwordMaxLength, `Password can not be longer than ${passwordMaxLength} characters.` ]
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        min: [ fullNameMinLength, `FullName must be atleast ${fullNameMinLength} character long.` ],
        max: [ fullNameMaxLength, `FullName can not be longer than ${fullNameMaxLength} characters.` ]
    },
    accessToken: {
        type: String,
        default: "",
    },
    refreshToken: {
        type: String,
        default: "",
    }
}, { timestamps: true });

// implementing hooks to encrypt password just before saving the password inside the database
UserSchema.pre<IUser>("save", async function (next) {

    // if password is not modified, then don't encrypt the password
    if (!this.isModified("password")) return next();

    // if user set the new password or modified the password then encrypt the password
    this.password = await generatePassword(this.password);
    return next();
});

// export the user model
const User = mongoose.model<IUser>('User', UserSchema);
export { User }
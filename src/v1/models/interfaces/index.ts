import { Document } from "mongoose";


// defining types for the user fields
type Email = string;
type Password = string;
type FullName = string;
type Token = string;

// creating structure for the user
interface IUser extends Document {
    email: Email;
    password: Password;
    fullName: FullName;

    refreshToken?: Token;

    createdAt: Date;
    updatedAt: Date;
}

// exporting all the interfaces
export { IUser, Email, Password, FullName, Token };
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

    refreshToken?: Token | null;

    createdAt: Date;
    updatedAt: Date;
}

// fields that can be updated by the user
interface IUpdatedUser {

    // these fields set by the client
    email?: Email;
    password?: Password;
    fullName?: FullName;

    // this field set by the server
    refreshToken?: Token;
}

// exporting all the interfaces
export { IUser, Email, Password, FullName, Token, IUpdatedUser };
import { Document } from "mongoose";


// creating structure for the user
interface IUser extends Document {
    email: string;
    password: string;
    fullName: string;
}

// exporting all the interfaces
export { IUser };
import { Request, Response } from 'express';
import { User } from '../models/User';
import { generateToken } from '../utils/secure/tokens';
import { IPayloadData } from '../utils/secure/interfaces';
import { IResponse } from '../utils/api/interfaces';
import apiResponse from '../utils/api/apiResponse';
import StatusCode from '../../statusCodes';
import { comparePassword } from '../utils/secure/password';
import { Token } from '../models/interfaces';


// to create a new users or register users
const registerUser = async (req: Request, res: Response): Promise<Response<IResponse>> => {
    try {
        // fetching the data from the request body
        const { fullName, password } = req.body;
        const email = req.body.email.toLowerCase();

        // check that the email is unique
        const existingUser = await User.findOne({ email });
        if (existingUser) return apiResponse({ response: res, statusCode: StatusCode.Conflict, message: "User Already exists with this email" });

        // now, create a new user with these provided data
        const user = await User.create({
            email,
            password,
            fullName
        });

        // now, sending user id as payload in the authentication token
        const payloadData: IPayloadData = {
            user: {
                id: user.id
            }
        };

        // generate the authentication token
        const authToken = generateToken(payloadData);

        // if user not created or something went wrong while creating user
        if (!user) return apiResponse({ response: res, statusCode: StatusCode.BadRequest, message: "User Not Created" });

        // now save the token inside the user model
        user.refreshToken = authToken;
        user.save({ validateBeforeSave: false });

        // user created successfully
        return apiResponse({ response: res, statusCode: StatusCode.OK, message: "User Created Successfully", data: { authToken, fullName: user?.fullName || "No Name" } });

    } catch (error) {

        // Type assertion to handle MongoDB duplicate key error
        if ((error as any)?.code === 11000) {
            // Duplicate key error (e.g., email already exists)
            return apiResponse({ response: res, statusCode: StatusCode.BadRequest, message: "User Not Created", error });
        }

        // other unrecogonized errors
        return apiResponse({ response: res, statusCode: StatusCode.InternalServerError, message: "Internal Server Error", error });
    }
}

// to login users through email and password
const loginUser = async (req: Request, res: Response): Promise<Response<IResponse>> => {
    try {
        // fetching data from request body
        const { email, password } = req.body;

        // now find the user, if user not exist, then login is not possible
        const user = await User.findOne({ email });
        if (!user) return apiResponse({ response: res, statusCode: StatusCode.NotFound, message: "User with this Email does not exist." });

        // compare the user password
        const isPasswordMatched = await comparePassword(password, user.password);
        if (!isPasswordMatched) return apiResponse({ response: res, statusCode: StatusCode.Unauthorized, message: "Invalid Credentials" });

        // payload for tokens
        const payloadData: IPayloadData = {
            user: {
                id: user.id,
            }
        } 

        let authToken: Token;

        /* check that the user have token or not, 
        if user have token then return the same token else generate the new token */
        if (user.refreshToken) authToken = user.refreshToken;
        else authToken = generateToken(payloadData);

        // user logged in successfully
        return apiResponse({ response: res, statusCode: StatusCode.OK, message: "User Logged in Successfully", data: { authToken, fullName: user.fullName } });
        
    } catch (error) {
        
        // other unrecogonized errors
        return apiResponse({ response: res, statusCode: StatusCode.InternalServerError, message: "Internal Server Error", error });
    }
}

export { registerUser, loginUser };
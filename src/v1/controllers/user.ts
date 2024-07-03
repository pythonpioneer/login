import { Request, Response } from 'express';
import { User } from '../models/User';
import { generateToken } from '../utils/secure/tokens';
import { IPayloadData } from '../utils/secure/interfaces';
import { IResponse } from '../utils/api/interfaces';
import apiResponse from '../utils/api/apiResponse';
import StatusCode from '../../statusCodes';


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
        user.accessToken = authToken;
        user.refreshToken = authToken;
        user.save();
        console.log({user})

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
    return apiResponse({ response: res, statusCode: StatusCode.OK, message: "login" })
}

export { registerUser, loginUser };
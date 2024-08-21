import { Request, Response } from 'express';
import { User } from '../models/User';
import { generateToken, PossibleTokenTypes } from '../utils/secure/tokens';
import { IPayloadData } from '../utils/secure/interfaces';
import { IResponse } from '../utils/api/interfaces';
import apiResponse from '../utils/api/apiResponse';
import StatusCode from '../../statusCodes';
import { comparePassword } from '../utils/secure/password';
import { IUpdatedUser, Token } from '../models/interfaces';
import { deleteCookies } from '../utils/cookies';


// to create a new users or register users (token not required)
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
            password,  // password is hashed by pre-hooks inside schema
            fullName
        });

        // now, sending user id as payload in the authentication token
        const payloadData: IPayloadData = {
            user: {
                id: user.id
            }
        };

        // generate the authentication token
        const accessToken: Token = generateToken({ payloadData, tokenType: PossibleTokenTypes.ACCESS_TOKEN }); 
        const refreshToken: Token = generateToken({ payloadData, tokenType: PossibleTokenTypes.REFRESH_TOKEN });

        // if user not created or something went wrong while creating user
        if (!user) return apiResponse({ response: res, statusCode: StatusCode.BadRequest, message: "User Not Created" });

        // now save the token inside the user model
        user.refreshToken = refreshToken;
        user.save({ validateBeforeSave: false });

        // user's information 
        const data: IResponse["data"] = {
            accessToken,
            refreshToken,
            fullName,
        }

        // user created successfully
        return apiResponse({ response: res, statusCode: StatusCode.OK, message: "User Created Successfully", data });

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

// to login users through email and password (token not required)
const loginUser = async (req: Request, res: Response): Promise<Response<IResponse>> => {
    try {
        // fetching data from request body and cookies
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

        // after successfull login, generate new tokens and give it to the client
        const accessToken: Token = generateToken({ payloadData, tokenType: PossibleTokenTypes.ACCESS_TOKEN }); 
        const refreshToken: Token = generateToken({ payloadData, tokenType: PossibleTokenTypes.REFRESH_TOKEN });

        user.refreshToken = refreshToken;
        user.save({ validateBeforeSave: false });

        // user's information 
        const data: IResponse["data"] = {
            accessToken,
            refreshToken, 
            fullName: user.fullName
        }

        // user logged in successfully
        return apiResponse({ response: res, statusCode: StatusCode.OK, message: "User Logged in Successfully", data });
        
    } catch (error) {
        
        // other unrecogonized errors
        return apiResponse({ response: res, statusCode: StatusCode.InternalServerError, message: "Internal Server Error", error });
    }
}

// to logout the user, only refresh token required (refresh token required)
const logoutUser = async (req: Request, res: Response): Promise<Response<IResponse>> => {
    try {
        // @ts-ignore // fetching user information from request and fetch the user
        const userId = req.userId;

        // @ts-ignore  // fetching token from the request as we embed the tokens in the request directly
        const refreshToken = req.refreshToken;

        const user = await User.findById(userId);
        if (!user) return apiResponse({ response: res, statusCode: StatusCode.NotFound, message: "User Not Found" });

        // user already logged out
        if (!user.refreshToken) return apiResponse({ response: res, statusCode: StatusCode.OK, message: "User Already logged out" });
        if (user.refreshToken !== refreshToken) return apiResponse({ response: res, statusCode: StatusCode.Forbidden, message: "Not allowed to logout" });

        // now, clear the tokens
        user.refreshToken = null;
        await user.save({ validateBeforeSave: false });

        // now, delete unnecessary cookies
        deleteCookies(res, 'refreshToken', 'accessToken');

        return apiResponse({ response: res, statusCode: StatusCode.OK, message: "User logged out Successfully!" });
        
    } catch (error) {

        // other unrecogonized errors
        return apiResponse({ response: res, statusCode: StatusCode.InternalServerError, message: "Internal Server Error", error });
    }
}

// to fetch the logged in user details (access token required)
const getCurrentUser = async (req: Request, res: Response): Promise<Response<IResponse>> => {
    try {
        // @ts-ignore // fetching user information from request and fetch the user
        const userId = req.userId;

        const user = await User.findById(userId)?.select('-password');
        if (!user) return apiResponse({ response: res, statusCode: StatusCode.NotFound, message: "User Not Found" });

        // if user is logged in
        if (!user.refreshToken) return apiResponse({ response: res, statusCode: StatusCode.Forbidden, message: "Login To fetch user information." });

        // now, send the user
        return apiResponse({ response: res, statusCode: StatusCode.OK, message: "User Found", user });

    } catch (error) {

        // other unrecogonized errors
        return apiResponse({ response: res, statusCode: StatusCode.InternalServerError, message: "Internal Server Error", error });
    }
}

// to login through refresh token (refresh token required)
const loginViaTokens = async (req: Request, res: Response): Promise<Response<IResponse>> => {
    try {
        // @ts-ignore // fetching user information from request and fetch the user
        const userId = req.userId;
        
        // @ts-ignore  // fetching token from the request as we embed the tokens in the request directly
        const refreshToken = req.refreshToken;

        const user = await User.findById(userId);
        if (!user) return apiResponse({ response: res, statusCode: StatusCode.NotFound, message: "User Not Found" });

        // now, check and match the refresh token
        if (!user.refreshToken) return apiResponse({ response: res, statusCode: StatusCode.Unauthorized, message: "Please login by providing credentials" });
        if (user.refreshToken !== refreshToken) return apiResponse({ response: res, statusCode: StatusCode.Unauthorized, message: "Please login by providing credentials" });

        // payload for tokens and generate a new access token
        const payloadData: IPayloadData = {
            user: {
                id: userId,
            }
        } 
        const accessToken = generateToken({ payloadData, tokenType: PossibleTokenTypes.ACCESS_TOKEN });

        // user's information
        const data: IResponse["data"] = {
            accessToken,
            refreshToken,
            fullName: user.fullName,
        }

        // user logged in successfully
        return apiResponse({ response: res, statusCode: StatusCode.OK, message: "User Logged in Successfully", data });

    } catch (error) {

        // other unrecogonized errors
        return apiResponse({ response: res, statusCode: StatusCode.InternalServerError, message: "Internal Server Error", error });
    }
}

// to delete the existing user (refresh token required)
const deleteUser = async (req: Request, res: Response): Promise<Response<IResponse>> => {
    try {
        // @ts-ignore // fetch data from the request body
        const userId = req?.userId;
        const password = req.body?.password;
        
        // @ts-ignore  // fetching token from the request as we embed the tokens in the request directly
        const refreshToken = req.refreshToken;

        // fetch the user info
        const user = await User.findById(userId);
        if (!user) return apiResponse({ response: res, statusCode: StatusCode.NotFound, message: "User Not Found" });

        // now, check and match the refresh token, so no old tokens can access the delete request
        if (!user.refreshToken) return apiResponse({ response: res, statusCode: StatusCode.Unauthorized, message: "Please login by providing credentials" });
        if (user.refreshToken !== refreshToken) return apiResponse({ response: res, statusCode: StatusCode.Unauthorized, message: "Please login by providing credentials" });

        // compare the user password
        const isPasswordMatched = await comparePassword(password, user.password);
        if (!isPasswordMatched) return apiResponse({ response: res, statusCode: StatusCode.Unauthorized, message: "Invalid Credentials" });

        // now, delete unnecessary cookies
        deleteCookies(res, 'accessToken', 'refreshToken');

        // now, delete the user
        const deletedUser = await User.findByIdAndDelete(userId).select('-password -refreshToken')
        if (!deletedUser) return apiResponse({ response: res, statusCode: StatusCode.NotFound, message: "User not found during deletion" });

        // user deleted successfully
        return apiResponse({ response: res, statusCode: StatusCode.OK, message: "User Deleted Successfully", user: deletedUser });

    } catch (error) {

        // other unrecogonized errors
        return apiResponse({ response: res, statusCode: StatusCode.InternalServerError, message: "Internal Server Error", error });
    }
}

// to update the user information (access token required)
const updateUserInformation = async (req: Request, res: Response): Promise<Response<IResponse>> => {
    try {

        // @ts-ignore // fetching data from request body
        const userId = req?.userId;
        const { email, fullName } = req.body;

        // fetch the user info
        const user = await User.findById(userId);
        if (!user) return apiResponse({ response: res, statusCode: StatusCode.NotFound, message: "User Not Found" });

        // check that the user is still logged in
        if (!user?.refreshToken) return apiResponse({ response: res, statusCode: StatusCode.Forbidden, message: "Please login by providing credentials" });

        // now, create the new user object with updated fields
        const updatedUserInfo: IUpdatedUser = {};

        if (email) {

            // if the given email already exists
            const userWithGivenEmail = await User.findOne({ email });
            if (userWithGivenEmail) return apiResponse({ response: res, statusCode: StatusCode.Conflict, message: "User with this email already exists" });

            // if user with this email doesn't exist
            updatedUserInfo["email"] = email;
        }
        if (fullName) updatedUserInfo["fullName"] = fullName;

        // when there is nothing to update
        const isUpdatedUserInfoEmpty = Object.keys(updatedUserInfo).length === 0;
        if (isUpdatedUserInfoEmpty) return apiResponse({ response: res, statusCode: StatusCode.UnprocessableEntity, message: "There is nothing to update" });

        // now, update the user
        const updatedUser = await User.findByIdAndUpdate(userId, { $set: updatedUserInfo }, { new: true });
        if (!updatedUser) return apiResponse({ response: res, statusCode: StatusCode.InternalServerError, message: "User not updated" });

        // user updated successfully
        return apiResponse({ response: res, statusCode: StatusCode.OK, message: "User updated successfully", user: updatedUser });

    } catch (error) {

        // other unrecogonized errors
        return apiResponse({ response: res, statusCode: StatusCode.InternalServerError, message: "Internal Server Error", error });
    }
}

// to update the user password (refresh token required)
const updateUserPassword = async (req: Request, res: Response): Promise<Response<IResponse>> => {
    try {
        // @ts-ignore // fetching data from request body
        const userId = req?.userId;
        const { password } = req.body;
        
        // @ts-ignore  // fetching token from the request as we embed the tokens in the request directly
        const refreshToken = req.refreshToken;

        // fetch the user info
        const user = await User.findById(userId);
        if (!user) return apiResponse({ response: res, statusCode: StatusCode.NotFound, message: "User Not Found" });

        // now, check and match the refresh token, so no old tokens can access the delete request
        if (!user.refreshToken) return apiResponse({ response: res, statusCode: StatusCode.Forbidden, message: "Please login by providing credentials" });
        if (user.refreshToken !== refreshToken) return apiResponse({ response: res, statusCode: StatusCode.Forbidden, message: "Please login by providing credentials" });

        // now, create the new user object with updated fields, hashing the password using pre-hooks in mongoose-models
        // `save prehook` only get triggered when we use `save` method on the model to update the password/data
        const updatedUserInfo: IUpdatedUser = { password }

        // when there is nothing to update, this code will not execute because this case is already handled by validation middlewares
        const isUpdatedUserInfoEmpty = Object.keys(updatedUserInfo).length === 0;
        if (isUpdatedUserInfoEmpty) return apiResponse({ response: res, statusCode: StatusCode.UnprocessableEntity, message: "There is nothing to update" });

        // now, update the user, using save method
        user.password = password;
        user.save();

        // user updated successfully
        return apiResponse({ response: res, statusCode: StatusCode.OK, message: "User's password updated successfully" });

    } catch (error) {

        // other unrecogonized errors
        return apiResponse({ response: res, statusCode: StatusCode.InternalServerError, message: "Internal Server Error", error });
    }
}

export { registerUser, loginUser, logoutUser, getCurrentUser, loginViaTokens, deleteUser, updateUserInformation, updateUserPassword };
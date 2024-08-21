import { Response } from "express";
import { IApiResponse, IResponse, IScecuredUserFields } from "./interfaces";
import { COOKIE_AGE } from "../secure/constants";
import dotenv from "dotenv";
import { IUser, Token } from "../../models/interfaces";
dotenv.config();


// to send the response
const apiResponse = ({ response, statusCode, message, data, error, user, info }: IResponse): Response<IApiResponse> => {

    // when data exists then only inject cookies
    if (data) {

        // Set data as cookies and insert in the response
        Object.entries(data).forEach(([key, value]) => {
            response.cookie(key, value, {
                httpOnly: true,
                maxAge: COOKIE_AGE,
                secure: true,
                signed: true,
                path: process.env?.COOKIE_PATH || '/',  // update the path in future
            });
        });
    }

    // filtering user
    let filteredUserObject: IScecuredUserFields;
    if (user) {
        if (data) filteredUserObject = filterUserObject(user, data.accessToken);
        else filteredUserObject = filterUserObject(user);

        return response.status(statusCode).json({ statusCode, message, data, error, user: filteredUserObject, info });
    }

    // send the response also with json
    return response.status(statusCode).json({ statusCode, message, data, error, user, info });
}

// filter the user object to only send required fields
const filterUserObject = (user: IUser, accessToken?: Token) => {

    const filteredUserObject: IScecuredUserFields = {
        fullName: user.fullName,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        refreshToken: accessToken ? user.refreshToken : null,
        accessToken: accessToken
    }

    return filteredUserObject;
}

// exporting the response method
export default apiResponse;
export { filterUserObject }

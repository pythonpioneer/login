import { Response } from "express";
import { IApiResponse, IResponse, IScecuredUserFields } from "./interfaces";
import { COOKIE_AGE } from "../secure/constants";
import dotenv from "dotenv";
import { FullName, IUser, Token } from "../../models/interfaces";
dotenv.config();


// to send the response
const apiResponse = ({ response, statusCode, message, data, error, user, info }: IResponse): Response<IApiResponse> => {

    // to store the fullName to send as response in json
    let userFullName: FullName | undefined;

    // when data exists then only inject cookies
    if (data) {

        // removing fullName from the response as it is not required in cookies
        if ('fullName' in data) {
            userFullName = data.fullName;
            const { fullName, ...dataWithoutName } = data;
            data = dataWithoutName;
        }

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

    // filtering user, removing non required fields like password, needed when updating user and only sending required fields
    let filteredUserObject: IScecuredUserFields;
    if (user) {
        if (data) filteredUserObject = filterUserObject(user, data.accessToken);
        else filteredUserObject = filterUserObject(user);

        return response.status(statusCode).json({ statusCode, message, data, error, user: filteredUserObject, info });
    }

    // send the response also with json
    return response.status(statusCode).json({ statusCode, message, data, error, user: userFullName && { fullName: userFullName, ...data }, info });
}

// filter the user object to only send required fields
const filterUserObject = (user: IUser, accessToken?: Token) => {

    const filteredUserObject: IScecuredUserFields = {
        fullName: user.fullName,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        accessToken: accessToken
    }

    if (user?.refreshToken && accessToken) filteredUserObject.refreshToken = user?.refreshToken;

    return filteredUserObject;
}

// exporting the response method
export default apiResponse;
export { filterUserObject }

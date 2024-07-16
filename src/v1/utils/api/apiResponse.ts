import { Response } from "express";
import { IApiResponse, IResponse } from "./interfaces";
import { COOKIE_AGE } from "../secure/constants";
import dotenv from "dotenv";
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

    // send the response also with json
    return response.status(statusCode).json({ statusCode, message, data, error, user, info });
}

// exporting the response method
export default apiResponse;

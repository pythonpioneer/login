import { Response } from "express";
import { IResponse } from "./interfaces";
import { COOKIE_AGE } from "../secure/constants";


// to send the response
const apiResponse = ({ response, statusCode, message, data, error }: IResponse): Response => {

    // when data exists then only inject cookies
    if (data) {

        // Set data as cookies and insert in the response
        Object.entries(data).forEach(([key, value]) => {
            response.cookie(key, value, {
                httpOnly: true,
                maxAge: COOKIE_AGE,
                secure: true,
                signed: true,
            });
        });
    }

    // send the response also with json
    return response.status(statusCode).json({ statusCode, message, data, error });
}

// exporting the response method
export default apiResponse;

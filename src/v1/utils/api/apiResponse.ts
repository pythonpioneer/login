import { Response } from "express";
import { IResponse } from "./interfaces";


// to send the response
const apiResponse = ({ response, statusCode, message, data, error }: IResponse): Response => {

    // when data exists then only inject cookies
    if (data) {

        // Set data as cookies and insert in the response
        Object.entries(data).forEach(([key, value]) => {
            response.cookie(key, value, {
                httpOnly: true,
                maxAge: 15 * 24 * 60 * 60 * 1000,  // expires in 15 days
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

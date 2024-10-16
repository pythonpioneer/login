import { Express, NextFunction, Request, Response } from "express";
import apiResponse from "../utils/api/apiResponse";
import StatusCode from "../../statusCodes";
import { PossibleTokenTypes, verifyToken } from "../utils/secure/tokens";


// to fetch the user id from the refresh token
function fetchLoggedinUserViaRefreshToken(req: Request, res: Response, next: NextFunction) {
    try {
        // fetch the token from the cookie or from the headers, we are fetching token from the headers in multiple ways because the headers are case-insensitive
        const refreshToken = req.cookies?.refreshToken || req.headers["refreshToken"] || req.headers['refreshtoken'];

        if (!refreshToken) return apiResponse({ response: res, statusCode: StatusCode.NotFound, message: "Authentication token is missing" });

        // now, validate the token and embed the userId inside the request
        const payloadData = verifyToken({ authToken: refreshToken, tokenType: PossibleTokenTypes.REFRESH_TOKEN });
        if (!payloadData) return apiResponse({ response: res, statusCode: StatusCode.Unauthorized, message: 'Token Verification failed' });

        // embed userId and refreshToken in the request
        req.userId = payloadData.user.id;
        req.refreshToken = refreshToken;
        
        return next();

    } catch (error) {
        
        // Handle specific token verification errors
        if (error instanceof Error) {
            let errorMessage = error.message || 'Token verification failed';
            if (error.message.includes('expired')) {
                errorMessage = 'Refresh token expired. Please log in again.';
            }
            return apiResponse({ response: res, statusCode: StatusCode.Unauthorized, message: errorMessage });
        }

        // Handle other unrecognized errors
        return apiResponse({ response: res, statusCode: StatusCode.InternalServerError, message: "Something went wrong while validating auth token", error });
    }
}

// to fetch the user id from the access token
function fetchLoggedinUserViaAccessToken(req: Request, res: Response, next: NextFunction) {
    try {
        // fetch the token from the cookie or from the headers, we are fetching token from the headers in multiple ways because the headers are case-insensitive
        const accessToken = req.cookies?.accessToken || req.headers["accessToken"] || req.headers["accesstoken"];
        if (!accessToken) return apiResponse({ response: res, statusCode: StatusCode.NotFound, message: "Authentication token is missing" });

        // now, validate the token and embed the userId inside the request
        const payloadData = verifyToken({ authToken: accessToken, tokenType: PossibleTokenTypes.ACCESS_TOKEN });
        if (!payloadData) return apiResponse({ response: res, statusCode: StatusCode.Unauthorized, message: 'Token Verification failed' });

        // embed userId and accessToken in the request
        req.userId = payloadData.user.id;
        req.accessToken = accessToken;

        return next();

    } catch (error) {
        
        // Handle specific token verification errors
        if (error instanceof Error) {
            let errorMessage = error.message || 'Token verification failed';
            if (error.message.includes('expired')) {
                errorMessage = 'Access token expired. Please log in again.';
            }
            return apiResponse({ response: res, statusCode: StatusCode.Unauthorized, message: errorMessage });
        }

        // Handle other unrecognized errors
        return apiResponse({ response: res, statusCode: StatusCode.InternalServerError, message: "Something went wrong while validating auth token", error });
    }
}

export { fetchLoggedinUserViaRefreshToken, fetchLoggedinUserViaAccessToken }
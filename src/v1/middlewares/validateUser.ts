import { NextFunction, Request, Response } from "express";
import apiResponse from "../utils/api/apiResponse";
import StatusCode from "../../statusCodes";
import { PossibleTokenTypes, verifyToken } from "../utils/secure/tokens";


// to fetch the user id from the authentication token, especially from refresh token
function fetchLoginUser(req: Request, res: Response, next: NextFunction) {
    try {
        // fetch the token from the cookie
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) return apiResponse({ response: res, statusCode: StatusCode.Unauthorized, message: "Authentication token is missing" });

        // now, validate the token and embed the userId inside the request
        const payloadData = verifyToken({ authToken: refreshToken, tokenType: PossibleTokenTypes.REFRESH_TOKEN });
        if (!payloadData) return apiResponse({ response: res, statusCode: StatusCode.Unauthorized, message: 'Token Verification failed' });

        req.userId = payloadData.user.id;
        next();

    } catch (error) {
        
        // unrecogonized errors
        return apiResponse({ response: res, statusCode: StatusCode.InternalServerError, message: "Something went Wrong while validating auth token", error });
    }
}

export { fetchLoginUser }
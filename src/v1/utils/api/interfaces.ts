import { Response } from "express";
import StatusCode from "../../../statusCodes";
import { FullName, Token } from "../../models/interfaces";

// response structure
interface IResponse {
    response: Response;
    statusCode: StatusCode;
    message: string;
    info?: string;

    data?: ISignInResponse;
    error?: any;
}

// structure for the response when signing
interface ISignInResponse {
    authToken: Token;
    fullName: FullName;
}

// exporting all interfaces
export { IResponse, ISignInResponse };
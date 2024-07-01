import { Response } from "express";
import StatusCode from "../../../statusCodes";

// response structure
interface IResponse {
    response: Response;
    statusCode: StatusCode;
    message: string;
    info?: string;

    data?: ISignInResponse;
}

// structure for the response when signing
interface ISignInResponse {
    authToken: string;
}

// exporting all interfaces
export { IResponse, ISignInResponse };
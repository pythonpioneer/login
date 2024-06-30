import { Response } from "express";

// response structure
interface IResponse {
    response: Response;
    statusCode: number;
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
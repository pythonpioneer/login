import { Response } from "express";
import StatusCode from "../../../statusCodes";
import { FullName, IUser, Token } from "../../models/interfaces";

// response structure
interface IResponse {
    response: Response;
    statusCode: StatusCode;
    message: string;
    info?: string;

    data?: ISignInResponse;
    error?: any;
    user?: IScecuredUserFields;
}

// returning response from apiResponse
type IApiResponse = Omit<IResponse, 'response'>;

// structure for the response when signing
interface ISignInResponse {
    accessToken: Token;
    refreshToken: Token;
    fullName: FullName;
}

type IScecuredUserFields = Omit<IUser, 'password' | 'refreshToken'>;

// exporting all interfaces
export { IResponse, ISignInResponse, IScecuredUserFields, IApiResponse };
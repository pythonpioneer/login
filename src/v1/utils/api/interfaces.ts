import { Response } from "express";
import StatusCode from "../../../statusCodes";
import { Email, FullName, IUser, Token } from "../../models/interfaces";
import { IUserCookieData } from "../cookies/interfaces";

// response structure
interface IResponse {
    response: Response;
    statusCode: StatusCode;
    message: string;
    info?: string;

    data?: ISignInResponse | IUserCookieData;
    error?: any;
    user?: IUser;
}

// returning response from apiResponse
type IApiResponse = Omit<IResponse, 'response'>;

// structure for the response when signing
interface ISignInResponse {
    accessToken: Token;
    refreshToken: Token;
    fullName: FullName;
}

// structure for the response when user is authenticated, not including password and other information
type IScecuredUserFields = Pick<IUser, 'fullName' | 'email' | 'updatedAt' | 'createdAt'> & {
    accessToken?: Token;
    refreshToken?: Token;
}

// exporting all interfaces
export { IResponse, ISignInResponse, IScecuredUserFields, IApiResponse };
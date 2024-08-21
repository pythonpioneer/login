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

type IScecuredUserFields = Pick<IUser, 'fullName' | 'email' | 'refreshToken' | 'updatedAt' | 'createdAt'> & {
    accessToken?: Token;
}

// exporting all interfaces
export { IResponse, ISignInResponse, IScecuredUserFields, IApiResponse };
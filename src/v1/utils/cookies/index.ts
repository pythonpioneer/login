import { Response } from "express";
import { IResponse } from "../api/interfaces";
import dotenv from "dotenv";
dotenv.config();


// to provide type safety when deleting cookies, only accepts possible cookies
type PossibleCookies = keyof NonNullable<IResponse['data']>;

// to delete the cookies from the response
const deleteCookies = (res: Response, ...cookies: Array<PossibleCookies>): void => {
    try {
        // now traverse in the cookies and clear the cookies
        cookies.forEach(cookieName => {
            res.clearCookie(cookieName, {

                // provide options
                path: process.env?.COOKIE_PATH || '/',
            });
        });

    } catch (error) {
        throw new Error("Something went wrong while deleting cookies");
    }
}

export { deleteCookies }
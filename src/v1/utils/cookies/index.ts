import { Response } from "express";
import dotenv from "dotenv";
dotenv.config();


// to delete the cookies from the response
const deleteCookies = (res: Response, ...cookies: Array<string>): void => {
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
import { FullName, Token } from "../../models/interfaces";

// user's data that can get embedded in the cookie
interface IUserCookieData {
    accessToken?: Token;
    refreshToken?: Token;
}

export { IUserCookieData }
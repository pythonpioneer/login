import { PossibleTokenTypes } from "./tokens";

// structure for the payload
interface IPayloadData {
    user: {
        id: string
    }
}

// types of the tokens when need to generate or verify
type AuthTokenType = PossibleTokenTypes.ACCESS_TOKEN | PossibleTokenTypes.REFRESH_TOKEN;

export { IPayloadData, AuthTokenType };
// importing all requirements
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { IPayloadData, AuthTokenType } from './interfaces';
import { ACCESS_TOKEN_AGE, REFRESH_TOKEN_AGE } from './constants';
import { Token } from '../../models/interfaces';
dotenv.config();


// to generate the auth token, and putting the data inside the token
const generateToken = ({ payloadData, tokenType = PossibleTokenTypes.ACCESS_TOKEN }: { payloadData: IPayloadData, tokenType?: AuthTokenType }): Token => {
    try {
        // determing the signature based on the token type
        const SIGNATURE = (tokenType === PossibleTokenTypes.ACCESS_TOKEN) ? process.env?.ACCESS_TOKEN_SIGNATURE : process.env?.REFRESH_TOKEN_SIGNATURE;
        if (!SIGNATURE) throw new Error(`Signature is missing, while generating ${tokenType}.`);

        // determine the expiration time based on the token type
        const tokenAge = (tokenType === PossibleTokenTypes.ACCESS_TOKEN) ? ACCESS_TOKEN_AGE : REFRESH_TOKEN_AGE;

        const authToken = jwt.sign(payloadData, SIGNATURE, { expiresIn: tokenAge });
        return authToken;

    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Token generation failed: ${error.message || 'UNKNOWN'}`);
        } else {
            throw new Error('Token generation failed: UNKNOWN');
        }
    }
}

// to verify the generated token, and the data inside the token
const verifyToken = ({ authToken, tokenType = PossibleTokenTypes.ACCESS_TOKEN }: { authToken: Token, tokenType: AuthTokenType }) => {

    // determing the signature based on the token type
    const SIGNATURE = (tokenType === PossibleTokenTypes.ACCESS_TOKEN) ? process.env?.ACCESS_TOKEN_SIGNATURE : process.env?.REFRESH_TOKEN_SIGNATURE;
    if (!SIGNATURE) throw new Error(`Signature is missing, while verifying the ${tokenType}.`);

    try {
        const decoded = jwt.verify(authToken, SIGNATURE);
        return decoded as IPayloadData;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Token verification failed: ${error.message || 'UNKNOWN'}`);
        } else {
            throw new Error('Token verification failed: UNKNOWN');
        }
    }
}

// token types and constants
enum PossibleTokenTypes {
    ACCESS_TOKEN = 'ACCESS_TOKEN',
    REFRESH_TOKEN = 'REFRESH_TOKEN'
}

export { generateToken, verifyToken, PossibleTokenTypes };
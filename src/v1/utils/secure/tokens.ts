// importing all requirements
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { IPayloadData } from './interfaces';
dotenv.config();


// to generate the auth token and the data inside the token
const generateToken = (payloadData: IPayloadData): string => {

    const SIGNATURE = process.env?.SIGNATURE;

    if (!SIGNATURE) throw new Error('Signature is missing, while generating authentication token.');

    const authToken = jwt.sign(payloadData, SIGNATURE);
    return authToken;
}

export { generateToken };
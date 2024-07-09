import { Request } from 'express';


// reopening the expres request object to embed the user field
declare module 'express-serve-static-core' {
    interface Request {
        userId?: string;
    }
}

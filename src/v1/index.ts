// importing requirements
import express, { Request, Response } from 'express';
import { connectToMongo } from './db';

// routes for the application
import userRoutes from './routes/user';
import { Token } from './models/interfaces';

// extending the Request type
declare module "express-serve-static-core" {
	interface Request {
		accessToken?: Token;
		refreshToken?: Token;
		userId?: string;
	}
}


// connect with the mongodb atlas server
connectToMongo();

// implmenting routes for the API
const app = express();

// available routes
app.use('/user', userRoutes);

// health check for the server
app.get('/health', async (_: Request, res: Response) => {
	return res.status(200).json({ status: 200, message: 'Version 1 is Up and Running!' });
});

export default app;

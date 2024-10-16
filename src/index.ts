// importing requirements
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

// importing routes from all possible versions
import V1Routes from './v1'
import V2Routes from './v2'
import { NodeEnvironment } from './v1/db/types';


// loading environment variables and fetching information for the API
dotenv.config();
const PORT: number = parseInt(process.env?.PORT || '5100', 10);
const APIPATH: string = process.env?.APIPATH || "/api/";
const COOKIE_SECRET_KEY = process.env?.COOKIE_SECRET_KEY;
const nodeEnv: NodeEnvironment = (process.env?.NODE_ENV || "development") as NodeEnvironment;

// express development environments and middlewares
const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser(COOKIE_SECRET_KEY));

// providing routes for all possible versions
app.use(APIPATH + 'v1', V1Routes);
app.use(APIPATH + 'v2', V2Routes);

// health check for the server
app.get('/health', async (_: Request, res: Response) => {
	return res.status(200).json({ status: 200, message: 'Server is Up and Running!' });
});

// conditionally start the server
if (nodeEnv !== "test") {

	// app is running on the particular port
	const server = app.listen(PORT, () => {
		console.log(`Server is running on port: ${PORT}`);
	});

	// handling SIGTERM signal for graceful shutdown, when the process is stopped by a system signal
	process.on('SIGTERM', () => {
		console.log('SIGTERM signal received: closing HTTP server');
		server.close(() => {
			console.log('HTTP server closed. Process Terminated.');
		});
	});

	// handling SIGINT signal for graceful shutdown, when the process is interrupted, like with Ctrl+C
	process.on('SIGINT', () => {
		console.log('SIGINT signal received: closing HTTP server');
		server.close(() => {
			console.log('HTTP server closed. Process Terminated Manually.');
		});
	});
}

export default app;

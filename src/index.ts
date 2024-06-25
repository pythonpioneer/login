// importing requirements
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// importing routes from all possible versions
import V1Routes from './v1'
import V2Routes from './v2'


// loading environment variables and fetching information for the API
dotenv.config();
const PORT: number = parseInt(process.env.PORT || '5100', 10);

// express development environments and middlewares
const app = express();
app.use(express.json());
app.use(cors());

// providing routes for all possible versions
app.use('/v1', V1Routes);
app.use('/v2', V2Routes);

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
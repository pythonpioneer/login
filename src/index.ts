// importing requirements
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';


// app environments
const PORT: number = 5100;


// development environment specifications
const app = express();

// dummy messages
app.get('/', (req: Request, res: Response): Response => {
    return res.send("OK!")
})

// to use req.body, we have to use this middleware
app.use(express.json());
app.use(cors());

// running the app
const server = app.listen(PORT!, () => {
    console.log(`Notes app listening on port: ${PORT}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    server.close(() => {
        console.log('Process terminated');
    });
});

process.on('SIGINT', () => {
    server.close(() => {
        console.log('Process terminated');
    });
});
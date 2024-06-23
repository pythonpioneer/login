import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const PORT: number = parseInt(process.env.PORT || '5100');

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use('/v1', require('./v1'));
app.use('/v2', require('./v2'));

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Graceful shutdown
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

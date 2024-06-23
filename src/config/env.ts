import dotenv from 'dotenv';


// Loadin environment variables from .env file
dotenv.config();

// configuration for the server
const config = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),
    databaseUrl: process.env.DATABASE_URL || 'mongodb://localhost:27017/mydatabase',
    apiKey: process.env.API_KEY || 'your_api_key_here',
};

export { config };
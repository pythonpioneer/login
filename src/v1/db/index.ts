// importing requirements
import mongoose from "mongoose";
import dotenv from "dotenv";
import { NodeEnvironment } from "./types";


// loading environment variables and fetching URI to connect with mongodb
dotenv.config();
const mongoURI: string = process.env?.MONGODB_URI || "";
const nodeEnv: NodeEnvironment = (process.env?.NODE_ENV || "development") as NodeEnvironment;

// if the URI is not present
if (!mongoURI) {
    console.error('Error: MONGODB_URI is not defined in environment variables');
    process.exit(1);
}

// to connect with mongodb atlas server
const connectToMongo = async () => {

    // using in-memory monodb server for testing
    if (nodeEnv === "test") return;

    // for developmenet and other environments, may transmute in future
    mongoose.connect(mongoURI)
        .then(() => {
            console.log("Successfully Connected to MongoDB Atlas Server!");
        })
        .catch((err) => {
            console.error("Coneection Interrupted");
            console.error("error: ", err);
        });
};

export { connectToMongo };
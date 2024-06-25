// importing requirements
import mongoose from "mongoose";
import dotenv from "dotenv";


// loading environment variables and fetching URI to connect with mongodb
dotenv.config();
const mongoURI: string = process.env?.MONGODB_URI || "";

// if the URI is not present
if (!mongoURI) {
    console.error('Error: MONGODB_URI is not defined in environment variables');
    process.exit(1);
}

// to connect with mongodb atlas server
const connectToMongo = async () => {
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
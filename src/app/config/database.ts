/* eslint-disable no-console */
import mongoose from "mongoose";

import { SECRET } from "./env";



// DATABASE CONNECTION
const connectDB = async () => {
    try {
        await mongoose.connect(SECRET.DB_URI);
        console.log("🤖 Database connected");
    } catch (error) {
        console.error("❌ Failed to connect to the database:", error);
        process.exit(1);
    };
};

export default connectDB;
/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";


let server: Server;

// SET-SERVER FUNCTION
export const setServer = (s: Server) => {
    server = s;
};

// GRACEFULLY SHUTDOWN
const gracefulShutdown = (reason: string, error?: unknown) => {
    console.log(`⏬ ${reason} Shutting down...`);
    if (error) console.error("💥", error);

    if (server) {
        server.close(() => {
            console.log("Server closed.");
            mongoose.disconnect().then(() => {
                console.log("MongoDB disconnected.");
                process.exit(reason === "SIGINT" || reason === "SIGTERM" ? 0 : 1);
            });
        });
    } else {
        process.exit(1);
    };
};

export default gracefulShutdown;
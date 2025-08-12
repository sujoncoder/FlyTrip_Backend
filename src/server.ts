/* eslint-disable no-console */
import { Server } from "http";

import app from "./app";
import { SECRET } from "./app/config/env";
import connectDB from "./app/config/database";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";
import gracefulShutdown, { setServer } from "./app/config/shutdown";
import { connectRedis } from "./app/config/redis.config";


let server: Server;

// START SERVER FUNCTION
const startServer = async () => {
    await connectDB();
    server = app.listen(SECRET.PORT, () => {
        console.log(`☄️  Server is running on http://localhost: ${SECRET.PORT}`)
    });

    setServer(server);
};


// CALL SYNCHRONIZING ===> FIRST START SERVER THEN SEEDING SUPER ADMIN
(async () => {
    await connectRedis()
    await startServer();
    await seedSuperAdmin();
})();


// UNHANDLE REJECTION ERROR
process.on("uncaughtException", (error) => gracefulShutdown("Uncaught Exception", error));

// UNCAUGHT REJECTION ERROR
process.on("unhandledRejection", (error) => gracefulShutdown("Unhandled Rejection", error));

// SIGNAL TERMINATION SIGTERM
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// START SERVER
// startServer();
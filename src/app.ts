import express, { Application, Request, Response } from "express";
import cors from "cors";
import passport from "passport";
import cookieParser from "cookie-parser";
import expressSession from "express-session";

import "./app/config/passport"

import { router } from "./app/routes";
import notFound from "./app/middlewares/notFound";
import { HTTP_STATUS } from "./app/constants/httpStatus";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { SECRET } from "./app/config/env";



const app: Application = express();

// APPLICATION LEVEL MIDDLEWARES
app.use(expressSession({
    secret: SECRET.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: SECRET.FRONTEND_URL,
    credentials: true
}))


// APPLICATION ROUTE MIDDLEWARE
app.use("/api/v1", router);


// APPLICATION ROOT ROUTE
app.get("/", (req: Request, res: Response) => {
    res.status(HTTP_STATUS.OK).json({
        status: "success",
        message: "Welcome to FlyTrip API 🚀"
    });
});


// NOT-FOUND ROUTE
app.use(notFound);

// GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

export default app;
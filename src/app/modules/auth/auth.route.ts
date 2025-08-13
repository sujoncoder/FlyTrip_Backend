import { NextFunction, Request, Response, Router } from "express";
import passport from "passport";

import { SECRET } from "../../config/env";
import { Role } from "../user/user.interface";
import { checkAuth } from "../../middlewares/checkAuth";
import { forgotMailZodSchema } from "../user/user.validation";
import { validateRequest } from "../../middlewares/validateRequest";

import { changePassword, credentialLogin, forgotPassword, getNewAccessToken, googleCallbackController, logout, resetPassword, setPassword } from "./auth.controller";


// AUTH ROUTES
export const authRoutes = Router()
    .post("/login", credentialLogin)
    .post("/refresh-token", getNewAccessToken)
    .post("/logout", logout)
    .post("/change-password", checkAuth(...Object.values(Role)), changePassword)
    .post("/set-password", checkAuth(...Object.values(Role)), setPassword)
    .post("/forgot-password", validateRequest(forgotMailZodSchema), forgotPassword)
    .post("/reset-password", checkAuth(...Object.values(Role)), resetPassword)

    // START GOOGLE AUTH
    .get("/google", async (req: Request, res: Response, next: NextFunction) => {
        const redirect = req.query.redirect || "/"
        passport.authenticate("google", { scope: ["profile", "email"], state: redirect as string })(req, res, next)
    })

    // GOOGLE CALLBACK AUTH
    // api/v1/auth/google/callback?state=/booking
    .get("/google/callback", passport.authenticate("google", { failureRedirect: `${SECRET.FRONTEND_URL}/login?error=There is some issues with your account. Please contact with out support team!` }), googleCallbackController)
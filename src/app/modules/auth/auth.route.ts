import { NextFunction, Request, Response, Router } from "express";
import passport from "passport";

import { Role } from "../user/user.interface";
import { checkAuth } from "../../middlewares/checkAuth";

import { credentialLogin, getNewAccessToken, googleCallbackController, logout, resetPassword } from "./auth.controller";


// AUTH ROUTES
export const authRoutes = Router()
    .post("/login", credentialLogin)
    .post("/refresh-token", getNewAccessToken)
    .post("/logout", logout)
    .post("/reset-password", checkAuth(...Object.values(Role)), resetPassword)

    // START GOOGLE AUTH
    .get("/google", async (req: Request, res: Response, next: NextFunction) => {
        const redirect = req.query.redirect || "/"
        passport.authenticate("google", { scope: ["profile", "email"], state: redirect as string })(req, res, next)
    })

    // GOOGLE CALLBACK AUTH
    // api/v1/auth/google/callback?state=/booking
    .get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), googleCallbackController)
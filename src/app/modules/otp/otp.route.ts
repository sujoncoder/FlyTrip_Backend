import { Router } from "express";

import { sendOTP, verifyOTP } from "./otp.controller";


// OTP ROUTES
export const otpRoutes = Router()

    .post("/send", sendOTP)
    .post("/verify", verifyOTP)

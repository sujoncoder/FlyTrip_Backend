import { Router } from "express";

import { cancelPayment, failPayment, initPayment, successPayment } from "./payment.controller";


// PAYMENT ROUTES
export const paymentRoutes = Router()
    .post("/init-payment/:bookingId", initPayment)
    .post("/success", successPayment)
    .post("/fail", failPayment)
    .post("/cancel", cancelPayment)

import { Router } from "express";

import { cancelPayment, failPayment, getInvoiceDownloadUrl, initPayment, successPayment, validatePayment } from "./payment.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";


// PAYMENT ROUTES
export const paymentRoutes = Router()
    .post("/success", successPayment)
    .post("/fail", failPayment)
    .post("/cancel", cancelPayment)
    .post("/validate-payment", validatePayment)
    .post("/init-payment/:bookingId", initPayment)
    .get("/invoice/:paymentId", checkAuth(...Object.values(Role)), getInvoiceDownloadUrl)

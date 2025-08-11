import { Request, Response } from "express";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

import { cancelPaymentService, failPaymentService, initPaymentService, successPaymentService } from "./payment.service";
import { SECRET } from "../../config/env";



// INIT PAYMENT CONTROLLER
export const initPayment = catchAsync(async (req: Request, res: Response) => {
    const bookingId = req.params.bookingId;
    const result = await initPaymentService(bookingId as string)
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Payment done successfully",
        data: result,
    });
});


// SUCCESS PAYMENT CONTROLLER
export const successPayment = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;
    const result = await successPaymentService(query as Record<string, string>);

    if (result.success) {
        res.redirect(`${SECRET.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`);
    };
});


// FAIL PAYMENT CONTROLLER
export const failPayment = catchAsync(async (req: Request, res: Response) => {
    const query = req.query
    const result = await failPaymentService(query as Record<string, string>)

    if (!result.success) {
        res.redirect(`${SECRET.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`)
    };
});


// CANCEL PAYMENT CONTROLLERA
export const cancelPayment = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;
    const result = await cancelPaymentService(query as Record<string, string>);

    if (!result.success) {
        res.redirect(`${SECRET.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`)
    };
});
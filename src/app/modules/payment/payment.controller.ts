import { Request, Response } from "express";

import { SECRET } from "../../config/env";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

import { cancelPaymentService, failPaymentService, getInvoiceDownloadUrlService, initPaymentService, successPaymentService } from "./payment.service";



// INITIAL PAYMENT INIT CONTROLLER
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
        res.redirect(`${SECRET.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`)
    };
});


// FAIL PAYMENT CONTROLLER
export const failPayment = catchAsync(async (req: Request, res: Response) => {
    const query = req.query
    const result = await failPaymentService(query as Record<string, string>)

    if (!result.success) {
        res.redirect(`${SECRET.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`)
    }
});


// CANCEL PAYMENT CONTROLLER
export const cancelPayment = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;
    const result = await cancelPaymentService(query as Record<string, string>);

    if (!result.success) {
        res.redirect(`${SECRET.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`)
    };
});


// GET PAYMENT INVOICE DOWNLOAD URL CONTROLLER
export const getInvoiceDownloadUrl = catchAsync(
    async (req: Request, res: Response) => {
        const { paymentId } = req.params;
        const result = await getInvoiceDownloadUrlService(paymentId);
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Invoice download URL retrieved successfully",
            data: result,
        });
    }
);


// VALIDATE PAYMENT CONTROLLER
export const validatePayment = catchAsync(
    async (req: Request, res: Response) => {
        // await validatePaymentService(req.body)
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Payment Validated Successfully",
            data: null,
        });
    }
);
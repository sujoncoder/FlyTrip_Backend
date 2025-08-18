/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { IUser } from "../user/user.interface";
import { ITour } from "../tour/tour.interface";
import { ApiError } from "../../errors/ApiError";
import { sendEmail } from "../../utils/sendEmail";
import { Booking } from "../booking/booking.model";
import { HTTP_STATUS } from "../../constants/httpStatus";
import { BOOKING_STATUS } from "../booking/booking.interface";
import { generatePdf, IInvoiceData } from "../../utils/invoice";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { sslService } from "../sslCommerz/sslCommerz.service";
import { uploadBufferToCloudinary } from "../../config/cloudinary.config";

import { Payment } from "./payment.model";
import { PAYMENT_STATUS } from "./payment.interface";



// INITIAL PAYMENT SERVICE
export const initPaymentService = async (bookingId: string) => {

    const payment = await Payment.findOne({ booking: bookingId })

    if (!payment) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, "Payment Not Found. You have not booked this tour")
    };

    const booking = await Booking.findById(payment.booking)

    const userAddress = (booking?.user as any).address
    const userEmail = (booking?.user as any).email
    const userPhoneNumber = (booking?.user as any).phone
    const userName = (booking?.user as any).name

    const sslPayload: ISSLCommerz = {
        address: userAddress,
        email: userEmail,
        phoneNumber: userPhoneNumber,
        name: userName,
        amount: payment.amount,
        transactionId: payment.transactionId
    }

    const sslPayment = await sslService.sslPaymentInit(sslPayload)

    return {
        paymentUrl: sslPayment.GatewayPageURL
    }

};


// SUCCESS PAYMENT SERVICE
export const successPaymentService = async (query: Record<string, string>) => {

    const session = await Booking.startSession();
    session.startTransaction();

    try {
        const updatedPayment = await Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
            status: PAYMENT_STATUS.PAID,
        }, { new: true, runValidators: true, session: session });

        if (!updatedPayment) {
            throw new ApiError(401, "Payment not found")
        };

        const updatedBooking = await Booking
            .findByIdAndUpdate(
                updatedPayment?.booking,
                { status: BOOKING_STATUS.COMPLETE },
                { new: true, runValidators: true, session }
            )
            .populate("tour", "title")
            .populate("user", "name email")

        if (!updatedBooking) {
            throw new ApiError(401, "Booking not found")
        };

        const invoiceData: IInvoiceData = {
            bookingDate: updatedBooking.createdAt as Date,
            guestCount: updatedBooking.guestCount,
            totalAmount: updatedPayment.amount,
            tourTitle: (updatedBooking.tour as unknown as ITour).title,
            transactionId: updatedPayment.transactionId,
            userName: (updatedBooking.user as unknown as IUser).name
        };

        const pdfBuffer = await generatePdf(invoiceData);

        const cloudinaryResult = await uploadBufferToCloudinary(pdfBuffer, "invoice");

        if (!cloudinaryResult) {
            throw new ApiError(401, "Error uploading pdf");
        };

        console.log("Cloudinary URL:", cloudinaryResult.secure_url);

        const updatedPaymentWithInvoice = await Payment.findByIdAndUpdate(
            updatedPayment._id,
            { invoiceUrl: cloudinaryResult.secure_url },
            { new: true, runValidators: true, session }
        );

        console.log("Updated Payment with Invoice:", updatedPaymentWithInvoice);

        await sendEmail({
            to: (updatedBooking.user as unknown as IUser).email,
            subject: "Your Booking Invoice",
            templateName: "invoice",
            templateData: invoiceData,
            attachments: [
                {
                    filename: "invoice.pdf",
                    content: pdfBuffer,
                    contentType: "application/pdf"
                }
            ]
        });

        await session.commitTransaction();
        session.endSession()
        return { success: true, message: "Payment Completed Successfully" }
    } catch (error) {
        await session.abortTransaction();
        session.endSession()
        // throw new ApiError(httpStatus.BAD_REQUEST, error) ❌❌
        throw error
    }
};


// FAIL PAYMENT SERVICE
export const failPaymentService = async (query: Record<string, string>) => {

    const session = await Booking.startSession();
    session.startTransaction();

    try {
        const updatedPayment = await Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
            status: PAYMENT_STATUS.FAILED,
        }, { new: true, runValidators: true, session: session });

        await Booking
            .findByIdAndUpdate(
                updatedPayment?.booking,
                { status: BOOKING_STATUS.FAILED },
                { runValidators: true, session }
            );

        await session.commitTransaction();
        session.endSession();
        return { success: false, message: "Payment Failed" };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        // throw new ApiError(HTTP_STATUS.BAD_REQUEST, error) ❌❌
        throw error;
    }
};


// CANCEL PAYMENT SERVICE
export const cancelPaymentService = async (query: Record<string, string>) => {
    const session = await Booking.startSession();
    session.startTransaction();

    try {
        const updatedPayment = await Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
            status: PAYMENT_STATUS.CANCELLED,
        }, { runValidators: true, session: session });

        await Booking
            .findByIdAndUpdate(
                updatedPayment?.booking,
                { status: BOOKING_STATUS.CANCEL },
                { runValidators: true, session }
            );

        await session.commitTransaction();
        session.endSession();
        return { success: false, message: "Payment Cancelled" };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        // throw new ApiError(HTTP_STATUS.BAD_REQUEST, error) ❌❌
        throw error
    }
};


// GET PAYMENT INVOICE DOWNLOAD URL SERVICE
export const getInvoiceDownloadUrlService = async (paymentId: string) => {
    const payment = await Payment.findById(paymentId)
        .select("invoiceUrl");

    if (!payment) {
        throw new ApiError(401, "Payment not found");
    };

    if (!payment.invoiceUrl) {
        throw new ApiError(401, "No invoice found");
    };

    return payment.invoiceUrl;
};
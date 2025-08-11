/* eslint-disable @typescript-eslint/no-explicit-any */
import { HTTP_STATUS } from "../../constants/httpStatus";
import { ApiError } from "../../errors/ApiError";
import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { sslPaymentInit } from "../sslCommerz/sslCommerz.service";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";


// INIT PAYMENT
export const initPaymentService = async (bookingId: string) => {

    const payment = await Payment.findOne({ booking: bookingId });

    if (!payment) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, "Payment Not Found. You have not booked this tour");
    };

    const booking = await Booking.findById(payment.booking);

    const userAddress = (booking?.user as any).address;
    const userEmail = (booking?.user as any).email;
    const userPhoneNumber = (booking?.user as any).phone;
    const userName = (booking?.user as any).name;

    const sslPayload: ISSLCommerz = {
        address: userAddress,
        email: userEmail,
        phoneNumber: userPhoneNumber,
        name: userName,
        amount: payment.amount,
        transactionId: payment.transactionId
    };

    const sslPayment = await sslPaymentInit(sslPayload);

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

        await Booking
            .findByIdAndUpdate(
                updatedPayment?.booking,
                { status: BOOKING_STATUS.COMPLETE },
                { runValidators: true, session }
            );

        await session.commitTransaction();
        session.endSession();
        return { success: true, message: "Payment Completed Successfully" };
    } catch (error) {
        await session.abortTransaction();
        session.endSession()
        // throw new AppError(httpStatus.BAD_REQUEST, error) ❌❌
        throw error;
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
        // throw new AppError(httpStatus.BAD_REQUEST, error) ❌❌
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
        }, { runValidators: true, session: session })

        await Booking
            .findByIdAndUpdate(
                updatedPayment?.booking,
                { status: BOOKING_STATUS.CANCEL },
                { runValidators: true, session }
            );

        await session.commitTransaction();
        session.endSession();
        return { success: false, message: "Payment Cancelled" }
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        // throw new AppError(httpStatus.BAD_REQUEST, error) ❌❌
        throw error;
    }
};
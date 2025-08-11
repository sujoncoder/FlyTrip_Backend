/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from "../user/user.model";
import { ApiError } from "../../errors/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";

import { Booking } from "./booking.model";
import { Payment } from "../payment/payment.model";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Tour } from "../tour/tour.model";
import { BOOKING_STATUS, IBooking } from "./booking.interface";
import { sslPaymentInit } from "../sslCommerz/sslCommerz.service";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";


const getTransactionId = () => {
    return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`
};


// CREATE BOOKING SERVICE
export const createBookingService = async (payload: Partial<IBooking>, userId: string) => {
    const transactionId = getTransactionId();

    // TRANSITION ROLLBACK
    const session = await Booking.startSession();
    session.startTransaction();

    try {
        const user = await User.findById(userId);

        if (!user?.phone || !user.address) {
            throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Please update your profile to book a tour")
        };

        const tour = await Tour.findById(payload.tour).select("costFrom");

        if (!tour?.costFrom) {
            throw new ApiError(HTTP_STATUS.BAD_REQUEST, "No tour coast found !")
        };

        const amount = Number(tour.costFrom) * Number(payload.guestCount);

        const booking = await Booking.create([{
            user: userId,
            status: BOOKING_STATUS.PENDING,
            ...payload
        }], { session });

        const payment = await Payment.create([{
            booking: booking[0]._id,
            status: PAYMENT_STATUS.UNPAID,
            transactionId: transactionId,
            amount: amount
        }], { session });

        const updatedBooking = await Booking.findByIdAndUpdate(booking[0]._id, { payment: payment[0]._id }, { new: true, runValidators: true, session })
            .populate("user", "name email phone address")
            .populate("tour", "title costFrom")
            .populate("payment");

        const userAddress = (updatedBooking?.user as any).address
        const userEmail = (updatedBooking?.user as any).email
        const userPhoneNumber = (updatedBooking?.user as any).phone
        const userName = (updatedBooking?.user as any).name

        const sslPayload: ISSLCommerz = {
            address: userAddress,
            email: userEmail,
            phoneNumber: userPhoneNumber,
            name: userName,
            amount: amount,
            transactionId: transactionId
        };

        const sslPayment = await sslPaymentInit(sslPayload);

        await session.commitTransaction();
        session.endSession();
        return {
            payment: sslPayment.GatewayPageURL,
            booking: updatedBooking
        };

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        // throw new ApiError(HTTP_STATUS.BAD_REQUEST, error) ❌
        throw error;
    };
};


// GET ALL BOOKING SERVICE
export const getAllBookingService = async () => {
    return
};


// GET USER BOOKINGS SERVICE
export const getUserBookingsService = async () => {
    return
};


// GET SINGLE BOOKINGS SERVICE
export const getSingleBookingService = async () => {
    return
};


// UPDATE BOOKING STATUS SERVICE
export const updateBookingStatusService = async () => {
    return
};
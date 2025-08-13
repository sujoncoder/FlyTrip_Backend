import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

import { createBookingService, getAllBookingService, getSingleBookingService, getUserBookingService, updateBookingStatusService } from "./booking.service";




// CREATE BOOKING CONTROLLER
export const createBooking = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload;

    const booking = await createBookingService(req.body, decodedToken.userId);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Booking created successfully',
        data: booking,
    });
});


// GET ALL BOOKING CONTROLLER
export const getAllBooking = catchAsync(async (req: Request, res: Response) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const bookings = await getAllBookingService();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Bookings retrieved successfully",
        data: {},
    });
});


// GET USER BOOKINGS CONTROLLER
export const getUserBookings = catchAsync(async (req: Request, res: Response) => {
    const bookings = await getUserBookingService();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Bookings retrieved successfully",
        data: bookings,
    });
});


// GET SINGLE BOOKINGS CONTROLLER
export const getSingleBooking = catchAsync(async (req: Request, res: Response) => {
    const booking = await getSingleBookingService();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Booking retrieved successfully",
        data: booking,
    });
});


// UPDATE BOOKING STATUS CONTROLLER
export const updateBookingStatus = catchAsync(async (req: Request, res: Response) => {
    const updated = await updateBookingStatusService();
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Booking Status Updated Successfully",
        data: updated,
    });
});
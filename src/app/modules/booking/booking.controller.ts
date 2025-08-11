import { Request, Response } from "express";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { createBookingService } from "./booking.service";
import { JwtPayload } from "jsonwebtoken";




// CREATE BOOKING CONTROLLER
export const createBooking = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload

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

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Tour type created successfully',
        data: "",
    });
});


// GET USER BOOKINGS CONTROLLER
export const getUserBookings = catchAsync(async (req: Request, res: Response) => {

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Tour type created successfully',
        data: "",
    });
});


// GET SINGLE BOOKINGS CONTROLLER
export const getSingleBooking = catchAsync(async (req: Request, res: Response) => {

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Tour type created successfully',
        data: "",
    });
});


// UPDATE BOOKING STATUS CONTROLLER
export const updateBookingStatus = catchAsync(async (req: Request, res: Response) => {


    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Bokking created successfully',
        data: "",
    });
});
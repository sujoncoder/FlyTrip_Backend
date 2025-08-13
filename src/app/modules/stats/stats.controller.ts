// controllers/stats.controller.ts
import { Request, Response } from "express";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { getBookingStatService, getPaymentStatService, getTourStatService, getUserStatService } from "./stats.service";



// TOUR STATS CONTROLLER
export const getTourStats = catchAsync(async (req: Request, res: Response) => {
    const stats = await getTourStatService();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Tour stats fetched successfully",
        data: stats,
    });
});


// USER STATS CONTROLLER
export const getUserStats = catchAsync(async (req: Request, res: Response) => {
    const stats = await getUserStatService();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User stats fetched successfully",
        data: stats,
    });
});


// BOOKING STATS CONTROLLER
export const getBookingStats = catchAsync(async (req: Request, res: Response) => {
    const stats = await getBookingStatService();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Booking stats fetched successfully",
        data: stats,
    });
});


// PAYMENT STATS CONTROLLER
export const getPaymentStats = catchAsync(async (req: Request, res: Response) => {
    const stats = await getPaymentStatService();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Payment stats fetched successfully",
        data: stats,
    });
});
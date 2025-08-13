import { Request, Response } from "express";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { sendOTPService, verifyOTPService } from "./otp.service";



// SEND OTP CONTROLLER
export const sendOTP = catchAsync(async (req: Request, res: Response) => {
    const { email, name } = req.body;
    await sendOTPService(email, name);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "OTP sent successfully",
        data: null,
    });
});


// VERIFY OTP CONTROLLER
export const verifyOTP = catchAsync(async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    await verifyOTPService(email, otp)
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "OTP verified successfully",
        data: null,
    });
});
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { HTTP_STATUS } from "../../constants/httpStatus";

import { createUserService, getAllUserService, updateUserService } from "./user.services";



// CREATE USER CONTROLLER
export const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await createUserService(req.body);

    sendResponse(res, {
        success: true,
        statusCode: HTTP_STATUS.CREATED,
        message: "User Created Successfully",
        data: user,
    });
});


// UPDATE USER CONTROLLER
export const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;

    const verifiedToken = req.user;

    const payload = req.body;
    const user = await updateUserService(userId, payload, verifiedToken)

    sendResponse(res, {
        success: true,
        statusCode: HTTP_STATUS.CREATED,
        message: "User Updated Successfully",
        data: user,
    });
});


// GET ALL USERS CONTROLLER
export const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getAllUserService();

    sendResponse(res, {
        success: true,
        statusCode: HTTP_STATUS.OK,
        message: "All Users Retrieved Successfully",
        data: result.data,
        meta: result.meta
    });
});
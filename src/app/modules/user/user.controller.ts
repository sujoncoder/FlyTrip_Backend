/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { HTTP_STATUS } from "../../constants/httpStatus";

import { createUserService, getAllUserService, getMeService, getSingleUserService, updateUserService } from "./user.services";



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


// GET ALL USERS CONTROLLER
export const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await getAllUserService(query as Record<string, string>);

    sendResponse(res, {
        success: true,
        statusCode: HTTP_STATUS.CREATED,
        message: "All Users Retrieved Successfully",
        data: result.data,
        meta: result.meta
    });
})


// GET MY PROFILE CONTROLLER
export const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const result = await getMeService(decodedToken.userId);

    sendResponse(res, {
        success: true,
        statusCode: HTTP_STATUS.CREATED,
        message: "Your profile Retrieved Successfully",
        data: result.data
    });
});


// GET SINGLE USER CONTROLLER
export const getSingleUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await getSingleUserService(id);
    sendResponse(res, {
        success: true,
        statusCode: HTTP_STATUS.CREATED,
        message: "User Retrieved Successfully",
        data: result.data
    });
});


// UPDATE USER CONTROLLER
export const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const verifiedToken = req.user;
    const payload = req.body;

    const user = await updateUserService(userId, payload, verifiedToken as JwtPayload);

    sendResponse(res, {
        success: true,
        statusCode: HTTP_STATUS.CREATED,
        message: "User Updated Successfully",
        data: user,
    });
});